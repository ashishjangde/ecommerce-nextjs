import asyncHandler from "../../_utils/asyncHandler";
import { UserRole } from "@prisma/client";
import { ApiResponse } from "../../_utils/ApiResponse";
import { ApiError } from "../../_utils/ApiError";
import SignUpSchemaBackend from "@/schema/auth/SignupSchemaBackend";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import { userRepository } from "../../_repositoriy/UserRepository";
import { userRepositoryRedis } from "../../_redisRepository/UserRepositoryRedis"; 
import { hashPassword } from "@/app/api/_helper/PasswordHelper";
import { genrateVerificationCode, genrateVerificationCodeExpiry } from "../../_helper/VerificationCodeHelper";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/helpers/SendVerificationEmail";

async function createOrUpdateUser({ id, name, email, password }: { id?: string, name: string, email: string, password: string }) {
    const hashedPassword = await hashPassword(password);
    const verificationCode = genrateVerificationCode();
    const codeExpireAt = genrateVerificationCodeExpiry();

    if (id) {
        const updatedUser = await userRepository.updateUser(id, {
            name,
            email,
            password: hashedPassword,
            verificationCode,
            codeExpireAt,
            isVerified: false,
        });

        await userRepositoryRedis.saveUser(updatedUser.id, updatedUser);
        await sendVerificationEmail(email , name, verificationCode);
        return updatedUser;
    } else {

        const newUser = await userRepository.createUser({
            name,
            email,
            password: hashedPassword,
            verificationCode,
            codeExpireAt,
            isVerified: false,
            roles: [UserRole.CUSTOMER],
        });
        await userRepositoryRedis.saveUser(newUser.id, newUser);
        await sendVerificationEmail(email , name, verificationCode);
        return newUser;
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

    let existUser = await userRepositoryRedis.getUserByEmail(email);

    if (!existUser) {
      
        existUser = await userRepository.getUserByEmail(email);
        if (existUser) {
          
            await userRepositoryRedis.saveUser(existUser.id, existUser);
        }
    }

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
