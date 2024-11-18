import asyncHandler from "@/app/api/_utils/asyncHandler";
import { ApiError } from "@/app/api/_utils/ApiError";
import { ApiResponse } from "@/app/api/_utils/ApiResponse";
import {  NextResponse } from "next/server";


export const POST = asyncHandler(async (req) => {
    const body = await req.json();
});