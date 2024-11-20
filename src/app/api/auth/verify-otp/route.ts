import asyncHandler from "../../_utils/asyncHandler";
import { ApiResponse } from "../../_utils/ApiResponse";
import { ApiError } from "../../_utils/ApiError";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import { userRepository } from "../../_repositoriy/UserRepository"; 
import { userRepositoryRedis } from "../../_redisRepository/UserRepositoryRedis"; 
import EmailAndVerificationCodeSchema from "@/schema/auth/IdAndVerificationCodeSchema";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req) => {
    const body = await req.json();

    const result = EmailAndVerificationCodeSchema.safeParse(body);
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

    
    if (!user.isVerified) {
        throw new ApiError(400, "user not verified");
    }


    if (user.verificationCode !== verificationCode) {
        throw new ApiError(400, "invalid code");
    }


    if (user.codeExpireAt! < new Date()) {
        throw new ApiError(400, "code expired");
    }

    await userRepository.updateUser(user.id, { isVerified: true });
    
    await userRepositoryRedis.updateUser(user.id, { isVerified: true });

    return NextResponse.json(new ApiResponse("user has valid code"), { status: 200 });
});
