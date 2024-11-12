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
});