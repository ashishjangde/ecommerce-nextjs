import asyncHandler from "@/app/api/_utils/asyncHandler";
import { ApiResponse } from "@/app/api/_utils/ApiResponse";
import prisma from "@/db/connectPrismaDb";
import { NextRequest, NextResponse } from "next/server";

export const GET = asyncHandler(async (req: NextRequest, context: { params: { id: string } }) => {
  const { id } = context.params;

  const categories = await prisma.category.findMany({
    where: {
      parentId: id,
    },
  });

  return NextResponse.json(new ApiResponse(categories), { status: 200 });
});
