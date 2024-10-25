import { asyncHandler } from "@/app/api/_utils/asyncHandler";
import { formatValidationErrors } from "@/app/api/_utils/formatValidationError";
import { generateVerificationCode } from "@/app/api/_utils/verificationCodeGenrator";
import prisma from "@/db/connectDb";
import { emailValidatorSchema } from "@/schema/GenralSchema";
import { ApiError } from "@/app/api/_utils/ApiError";
import { NextResponse } from "next/server";
import { APIResponse } from "@/app/api/_utils/ApiResponse";


export const POST = asyncHandler(async (req) => {
    const parsedData = emailValidatorSchema.safeParse(await req.json());
    if (!parsedData.success) {
        const errors = formatValidationErrors(parsedData.error);
        throw new ApiError(400, "Input Validation Failed", errors);
    }
    const { email } = parsedData.data;

    const existingUser = await prisma.user.findUnique({ 
        where: {
            email: email,
        },
    });
    if (!existingUser) throw new ApiError(404, "User not found");

    const verificationCode = generateVerificationCode();

    await prisma.user.update({
        where: {
            email: email,
        },
        data: {
            verificationCode: verificationCode,
            codeExpireAt: new Date(Date.now() + 10 * 60 * 1000),
        },
    });
    //TODO sendEmail to the user 

    return NextResponse.json({ data: new APIResponse("OTP sent successfully") }, { status: 200 });

})