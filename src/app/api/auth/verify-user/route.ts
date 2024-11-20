import asyncHandler from "../../_utils/asyncHandler";
import { ApiResponse } from "../../_utils/ApiResponse";
import { ApiError } from "../../_utils/ApiError";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import { userRepository } from "../../_repositoriy/UserRepository"; 
import { userRepositoryRedis } from "../../_redisRepository/UserRepositoryRedis"; 
import IdandVerificationCodeSchema from '@/schema/auth/IdAndVerificationCodeSchema';
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req) => {

  const body = await req.json();

  const result = IdandVerificationCodeSchema.safeParse(body);
  console.log(result);
  if (!result.success) {
    const error = formatValidationErrors(result.error);
    throw new ApiError(400, "validation error", error);
  }

  const { id , verificationCode } = result.data;

  let user = await userRepositoryRedis.getUserById(id);
  
  if (!user) {
    user = await userRepository.getUserById(id);
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
