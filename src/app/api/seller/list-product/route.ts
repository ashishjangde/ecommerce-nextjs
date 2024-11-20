import asyncHandler from "@/app/api/_utils/asyncHandler";
import { ApiError } from "@/app/api/_utils/ApiError";
import { ApiResponse } from "@/app/api/_utils/ApiResponse";
import {  NextResponse } from "next/server";
import { validateSellerSession } from "../../_utils/ValidateSession";


export const POST = asyncHandler(async (req) => {
    validateSellerSession();
    const body = await req.json();
    

});