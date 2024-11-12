import asyncHandler from "../../_utils/asyncHandler";
import { ApiResponse } from "../../_utils/ApiResponse";
import { ApiError } from "../../_utils/ApiError";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import { userRepository } from "../../_repositoriy/UserRepository";
import EmailAndVerificationCodeSchema from "@/schema/EmailAndVerificationCodeSchema";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req) => {
    const body = await req.json();
    const result = EmailAndVerificationCodeSchema.safeParse(body);
    if (!result.success) {
        const error =  formatValidationErrors(result.error);
        throw new ApiError(400, "validation error", error );
    }
    const { email , verificationCode } = result.data;
    const user = await userRepository.getUserByEmail(email);
    if(!user){
        throw new ApiError(400, "user not found");
    }
    if(!user.isVerified){
        throw new ApiError(400, "user not  verified");
    }
    if(user.verificationCode !== verificationCode){
        throw new ApiError(400, "invalid code");
    }
    if(user.codeExpireAt! < new Date()){
        throw new ApiError(400, "code expired");
    }
    await userRepository.updateUser(user.id , { isVerified: true });


    return NextResponse.json(new ApiResponse("user have valid code") , { status: 200 });

});