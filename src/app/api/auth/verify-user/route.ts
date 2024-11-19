import asyncHandler from "../../_utils/asyncHandler";
import { ApiResponse } from "../../_utils/ApiResponse";
import { ApiError } from "../../_utils/ApiError";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import { userRepository } from "../../_repositoriy/UserRepository"; 
import { userRepositoryRedis } from "../../_redisRepository/UserRepositoryRedis"; 
import EmailAndVerificationCodeSchema from "@/schema/EmailAndVerificationCodeSchema";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req) => {

  const result = EmailAndVerificationCodeSchema.safeParse(req.body);
  if (!result.success) {
    const error = formatValidationErrors(result.error);
    throw new ApiError(400, "validation error", error);
  }

  const { email, verificationCode } = result.data;

  let user = await userRepositoryRedis.getUserByEmail(email);
  
  if (!user) {
    user = await userRepository.getUserByEmail(email);
    if (user) {
      await userRepositoryRedis.saveUser(user.id, user);
    }
  }

  if (!user) {
    throw new ApiError(400, "user not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "user already verified");
  }

  if (user.verificationCode !== verificationCode) {
    throw new ApiError(400, "invalid code");
  }

  if (user.codeExpireAt! < new Date()) {
    throw new ApiError(400, "code expired");
  }

  await userRepository.updateUser(user.id, {
    isVerified: true,
    verificationCode: null,
    codeExpireAt: null,
  });
  await userRepositoryRedis.updateUser(user.id, {
    isVerified: true,
    verificationCode: null,
    codeExpireAt: null,
  });

  return NextResponse.json(new ApiResponse("user verified successfully"), { status: 200 });
});
