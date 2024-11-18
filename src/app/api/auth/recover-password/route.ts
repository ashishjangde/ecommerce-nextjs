import asyncHandler from "../../_utils/asyncHandler";
import { ApiResponse } from "../../_utils/ApiResponse";
import { ApiError } from "../../_utils/ApiError";
import ForgotPasswordSchema from "@/schema/ForgotPasswordBackendSchema";
import { userRepository } from "../../_repositoriy/UserRepository"; // DB repository
import userRepositoryRedis from "../../_redisRepository/UserRepositoryRedis";
import { NextResponse } from "next/server";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import { hashPassword } from "@/app/api/_helper/PasswordHelper";

export const POST = asyncHandler(async (req) => {
    const body = await req.json();
    const result = ForgotPasswordSchema.safeParse(body);

    if (!result.success) {
        const error = formatValidationErrors(result.error);
        throw new ApiError(400, "validation error", error);
    }

    const { email, verificationCode, newPassword } = result.data;

    let user = await userRepositoryRedis.getUserByEmail(email);

    if (!user) {
        user = await userRepository.getUserByEmail(email);
        if (user) {
            
            await userRepositoryRedis.saveUser(user.id, user);
        }
    }

    if (!user || !user.isVerified) {
        throw new ApiError(400, "User not found or not verified");
    }

    if (user.verificationCode !== verificationCode) {
        throw new ApiError(400, "Invalid code");
    }

    if (user.codeExpireAt! < new Date()) {
        throw new ApiError(400, "Code expired");
    }

    const hashedPassword = await hashPassword(newPassword);

    await userRepository.updateUser(user.id, { password: hashedPassword, verificationCode: null, codeExpireAt: null });

    await userRepositoryRedis.updateUser(user.id, { password: hashedPassword, verificationCode: null, codeExpireAt: null });

    return NextResponse.json(new ApiResponse("Password updated successfully"), { status: 200 });
});
