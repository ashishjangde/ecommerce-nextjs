import asyncHandler from "../../_utils/asyncHandler";
import { ApiResponse } from "../../_utils/ApiResponse";
import { ApiError } from "../../_utils/ApiError";
import ForgotPasswordSchema from "@/schema/ForgotPasswordBackendSchema";
import { userRepository } from "../../_repositoriy/UserRepository";
import { NextResponse } from "next/server";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import { hashPassword } from "@/helpers/PasswordHelper";


export const POST = asyncHandler(async (req) => {
   const result = ForgotPasswordSchema.safeParse(req.body);
   if (!result.success) {
       const error =  formatValidationErrors(result.error);
       throw new ApiError(400, "validation error", error );
   }
   const { email , verificationCode , newPassword } = result.data;
   const user = await userRepository.getUserByEmail(email);
   if(!user || !user.isVerified){
       throw new ApiError(400, "user not found");
   }
   if(user.verificationCode !== verificationCode){
       throw new ApiError(400, "invalid code");
   }
   if(user.codeExpireAt! < new Date()){
       throw new ApiError(400, "code expired");
   }
   const hashedPassword = await hashPassword(newPassword);
   await userRepository.updateUser(user.id , { password: hashedPassword, verificationCode: null , codeExpireAt: null });
   return NextResponse.json(new ApiResponse("password updated successfully") , { status: 200 });
});