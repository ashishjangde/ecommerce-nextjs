import asyncHandler from "../../_utils/asyncHandler";
import { ApiResponse } from "../../_utils/ApiResponse";
import { ApiError } from "../../_utils/ApiError";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import { userRepository } from "../../_repositoriy/UserRepository"; 
import { userRepositoryRedis } from "../../_redisRepository/UserRepositoryRedis"; 
import EmailAndVerificationCodeSchema from "@/schema/EmailAndVerificationCodeSchema";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req) => {
  // Validate input data
  const result = EmailAndVerificationCodeSchema.safeParse(req.body);
  if (!result.success) {
    const error = formatValidationErrors(result.error);
    throw new ApiError(400, "validation error", error);
  }

  const { email, verificationCode } = result.data;

  // Check for user in Redis first
  let user = await userRepositoryRedis.getUserByEmail(email);
  
  // If not found in Redis, fall back to the database
  if (!user) {
    user = await userRepository.getUserByEmail(email);
    // Cache the user data in Redis for future requests
    if (user) {
      await userRepositoryRedis.saveUser(user.id, user);
    }
  }

  if (!user) {
    throw new ApiError(400, "user not found");
  }

  // Check if the user is already verified
  if (user.isVerified) {
    throw new ApiError(400, "user already verified");
  }

  // Check if the verification code matches
  if (user.verificationCode !== verificationCode) {
    throw new ApiError(400, "invalid code");
  }

  // Check if the verification code has expired
  if (user.codeExpireAt! < new Date()) {
    throw new ApiError(400, "code expired");
  }

  // Update user verification status in the database and Redis
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
