import { asyncHandler } from "../../_utils/asyncHandler";
import prisma from "@/db/connectDb";
import { SignUpSchemaBackend } from "@/schema/SignupSchemaBackend";
import { ApiError } from "../../_utils/ApiError";
import { formatValidationErrors } from "../../_utils/formatValidationError";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs"; 
import { APIResponse } from "../../_utils/ApiResponse";
import { NextResponse ,NextRequest } from "next/server";

export const POST = asyncHandler(async (req: NextRequest) => { // Remove `res` argument

    const parsedData = SignUpSchemaBackend.safeParse(await req.json()); // Parse the JSON body
    if (!parsedData.success) {
        const errors = formatValidationErrors(parsedData.error);
        throw new ApiError(400, "Input Validation Failed", errors);
    }
    const { name, email, password } = parsedData.data;

    const existingUser = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    if (existingUser) throw new ApiError(400, "User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword, 
            roles: [UserRole.CUSTOMER], 
        },
    });

    const { password: _, verificationCode: __, codeExpireAt:___, ...userData } = user;


    return NextResponse.json({
        data: new APIResponse(userData)
    }, { status: 201 });
});
