import asyncHandler from "../../_utils/asyncHandler";
import {  UserRole } from "@prisma/client";
import { ApiResponse } from "../../_utils/ApiResponse";
import { ApiError } from "../../_utils/ApiError";
import SignUpSchemaBackend from "@/schema/SignupSchemaBackend";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import { userRepository } from "../../_repositoriy/UserRepository";
import { hashPassword } from "@/helpers/PasswordHelper";
import { genrateVerificationCode , genrateVerificationCodeExpiry } from "../../_helper/VerificationCodeHelper";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req) => {
    const result = SignUpSchemaBackend.safeParse(req.body);
    if (!result.success) {
        const error =  formatValidationErrors(result.error);
        throw new ApiError(400, "validation error", error );
    }
    const { name, email, password } = result.data;
    const existUser = await userRepository.getUserByEmail(email);
    if (existUser?.isVerified === false) {
        const hashedPassword = await hashPassword(password);
        const verificationCode = genrateVerificationCode();
        const codeExpireAt = genrateVerificationCodeExpiry();
        const user = await userRepository.createUser({
             name,
            email, 
            password: hashedPassword , 
            verificationCode , 
            codeExpireAt ,
            isVerified: false,
            roles: [UserRole.CUSTOMER],
        });
        const { password: _ , verificationCode: __,  codeExpireAt: ___,  ...rest } = user;
        return NextResponse.json(new ApiResponse(rest) , { status: 201 });
     }else{
        if (existUser)  throw new ApiError(400, "user already exist");
        const hashedPassword = await hashPassword(password);
        const verificationCode = genrateVerificationCode();
        const codeExpireAt = genrateVerificationCodeExpiry();
        const user = await userRepository.createUser({
             name,
            email, 
            password: hashedPassword , 
            verificationCode , 
            codeExpireAt ,
            isVerified: false,
            roles: [UserRole.CUSTOMER],
        });
        const { password: _ , verificationCode: __,  codeExpireAt: ___,  ...rest } = user;
        return NextResponse.json(new ApiResponse(rest) , { status: 201 });
        
     }


});