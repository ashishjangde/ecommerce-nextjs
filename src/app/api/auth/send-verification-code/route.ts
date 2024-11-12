import asyncHandler from "../../_utils/asyncHandler";
import { ApiResponse } from "../../_utils/ApiResponse";
import { ApiError } from "../../_utils/ApiError";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import { userRepository } from "../../_repositoriy/UserRepository";
import { NextResponse } from "next/server";
import EmailVerificationSchema from "@/schema/EmailverifiactionSchema";
import { genrateVerificationCode, genrateVerificationCodeExpiry } from "../../_helper/VerificationCodeHelper";


export const POST = asyncHandler(async (req) => {
    const result = EmailVerificationSchema.safeParse(req.body);
    if (!result.success) {
        const error =  formatValidationErrors(result.error);
        throw new ApiError(400, "validation error", error );
    }
    const { email } = result.data;
    const user = await userRepository.getUserByEmail(email);
    if(!user){
        throw new ApiError(400, "user not found");
    }
    if(!user.isVerified){
        throw new ApiError(400, "user not  verified");
    }
    const verificationCode = genrateVerificationCode();
    const verificationCodeExpiry = genrateVerificationCodeExpiry();
    await userRepository.updateUser(user.id , { verificationCode , codeExpireAt: verificationCodeExpiry });
    //send and email to user with verification code
    return NextResponse.json(new ApiResponse("verification code send successfully") , { status: 200 });
});