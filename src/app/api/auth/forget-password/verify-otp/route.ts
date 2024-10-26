import { asyncHandler } from "@/app/api/_utils/asyncHandler";
import { formatValidationErrors } from "@/app/api/_utils/formatValidationError";
import { generateVerificationCode } from "@/app/api/_utils/verificationCodeGenrator";
import prisma from "@/db/connectDb";
import { emailValidatorSchema } from "@/schema/GenralSchema";
import { ApiError } from "@/app/api/_utils/ApiError";
import z from "zod";
import { NextResponse } from "next/server";
import { APIResponse } from "@/app/api/_utils/ApiResponse";

const verifyOtpSchema = z.object({
        email: z.string().email(),
        verificationCode: z.string().min(6),
    });

export const POST = asyncHandler(async (req) => {
    const parsedData = verifyOtpSchema.safeParse(await req.json());

    if (!parsedData.success) {
        const errors = formatValidationErrors(parsedData.error);
        throw new ApiError(400, "Input Validation Failed", errors);
    }
    const { email  , verificationCode} = parsedData.data;

    const existingUser = await prisma.user.findUnique({ 
        where: {
            email: email,
        },
    });
    if (!existingUser) throw new ApiError(404, "User not found");

    if(existingUser.verificationCode !== verificationCode) throw new ApiError(400, "Invalid verification code");

    return NextResponse.json({ data: new APIResponse("varification code is valid") },{ status: 200 });    

   

})