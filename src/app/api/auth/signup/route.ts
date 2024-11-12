import asyncHandler from "../../_utils/asyncHandler";
import { UserRole } from "@prisma/client";
import { ApiResponse } from "../../_utils/ApiResponse";
import { ApiError } from "../../_utils/ApiError";
import SignUpSchemaBackend from "@/schema/SignupSchemaBackend";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import { userRepository } from "../../_repositoriy/UserRepository";
import { hashPassword } from "@/app/api/_helper/PasswordHelper";
import { genrateVerificationCode, genrateVerificationCodeExpiry } from "../../_helper/VerificationCodeHelper";
import { NextResponse } from "next/server";

async function createOrUpdateUser({ id, name, email, password }: { id?: string, name: string, email: string, password: string }) {
    const hashedPassword = await hashPassword(password);
    const verificationCode = genrateVerificationCode();
    const codeExpireAt = genrateVerificationCodeExpiry();

    if (id) {
        return await userRepository.updateUser(id, {
            name,
            email,
            password: hashedPassword,
            verificationCode,
            codeExpireAt,
            isVerified: false,
        });
    } else {
        return await userRepository.createUser({
            name,
            email,
            password: hashedPassword,
            verificationCode,
            codeExpireAt,
            isVerified: false,
            roles: [UserRole.CUSTOMER],
        });
    }
}

export const POST = asyncHandler(async (req) => {
    const body = await req.json();
    const result = SignUpSchemaBackend.safeParse(body);

    if (result.error) {
        const error = formatValidationErrors(result.error);
        throw new ApiError(400, "Validation error", error);
    }

    const { name, email, password } = result.data;
    const existUser = await userRepository.getUserByEmail(email);

    let user;
    if (existUser) {
        if (existUser.isVerified === false) {
            user = await createOrUpdateUser({
                id: existUser.id,
                name,
                email,
                password,
            });
            const { password: _, verificationCode: __, codeExpireAt: ___, ...rest } = user;
            return NextResponse.json(new ApiResponse(rest), { status: 201 });
        } else {
            throw new ApiError(400, "User already exists and is verified");
        }
    } else {

        user = await createOrUpdateUser({ name, email, password });
        const { password: _, verificationCode: __, codeExpireAt: ___, ...rest } = user;
        return NextResponse.json(new ApiResponse(rest), { status: 201 });
    }
});
