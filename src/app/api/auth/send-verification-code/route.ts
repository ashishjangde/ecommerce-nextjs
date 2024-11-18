import asyncHandler from "../../_utils/asyncHandler";
import { ApiResponse } from "../../_utils/ApiResponse";
import { ApiError } from "../../_utils/ApiError";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import { userRepository } from "../../_repositoriy/UserRepository"; 
import userRepositoryRedis from "../../_redisRepository/UserRepositoryRedis";
import { NextResponse } from "next/server";
import EmailVerificationSchema from "@/schema/EmailVerifiactionSchema";
import { genrateVerificationCode, genrateVerificationCodeExpiry } from "../../_helper/VerificationCodeHelper";
import { sendVerificationEmail } from "@/helpers/SendVerificationEmail";

export const POST = asyncHandler(async (req) => {
    const body = await req.json();
    const result = EmailVerificationSchema.safeParse(body);

    if (!result.success) {
        const error = formatValidationErrors(result.error);
        throw new ApiError(400, "validation error", error);
    }
    const { email } = result.data;

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

    
    const verificationCode = genrateVerificationCode();
    const verificationCodeExpiry = genrateVerificationCodeExpiry();

    await userRepository.updateUser(user.id, { verificationCode, codeExpireAt: verificationCodeExpiry });
    await userRepositoryRedis.updateUser(user.id, { verificationCode, codeExpireAt: verificationCodeExpiry });

    await sendVerificationEmail(email , user.name, verificationCode);

    return NextResponse.json(new ApiResponse("Verification code sent successfully"), { status: 200 });
});
