import asyncHandler from "@/app/api/_utils/asyncHandler";
import { ApiError } from "@/app/api/_utils/ApiError";
import { ApiResponse } from "@/app/api/_utils/ApiResponse";
import { NextResponse } from "next/server";
import { validateAdminSession } from "../_utils/ValidateSession";
import prisma from "@/db/connectPrismaDb";



export const GET = asyncHandler(async () => {

  const category = prisma.category.findMany({
    where: {
      parentId: null,
    }
  })
  return NextResponse.json(new ApiResponse(category), { status: 200 });
});

export const POST = asyncHandler(async (req) => {
  await validateAdminSession();
  const body = await req.json();
  const result = await prisma.category.create({
    data: body,
  });
  return NextResponse.json(new ApiResponse(result), { status: 200 });
});