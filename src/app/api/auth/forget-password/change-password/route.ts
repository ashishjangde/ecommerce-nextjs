import { asyncHandler } from "@/app/api/_utils/asyncHandler";
import { formatValidationErrors } from "@/app/api/_utils/formatValidationError";
import prisma from "@/db/connectDb";
import { ApiError } from "@/app/api/_utils/ApiError";
import z from "zod";
import { NextResponse } from "next/server";
import { APIResponse } from "@/app/api/_utils/ApiResponse";
import bcrypt from "bcryptjs";

const verifyChangePasswordSchema = z.object({
        email: z.string().email(),
        verificationCode: z.string().min(6),
        password: z.string().min(6),
    });

export const POST = asyncHandler(async (req) => {
    const parsedData = verifyChangePasswordSchema.safeParse(await req.json());

    if (!parsedData.success) {
        const errors = formatValidationErrors(parsedData.error);
        throw new ApiError(400, "Input Validation Failed", errors);
    }
    const { email  , verificationCode , password} = parsedData.data;

    const existingUser = await prisma.user.findUnique({ 
        where: {
            email: email,
        },
    });
    if (!existingUser) throw new ApiError(404, "User not found");

    if(existingUser.verificationCode !== verificationCode) throw new ApiError(400, "Invalid verification code");

    if(existingUser.codeExpireAt! < new Date()) throw new ApiError(400, "Verification code expired");

    const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: {
            email: email,
        },
        data: {
            password: hashedPassword,
            verificationCode: null,
            codeExpireAt: null,
        }
    }) 

    return NextResponse.json({
        data : new APIResponse("password changed successfully"),
    },{ status: 200})

})