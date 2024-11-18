import asyncHandler from "@/app/api/_utils/asyncHandler";
import { ApiError } from "@/app/api/_utils/ApiError";
import { ApiResponse } from "@/app/api/_utils/ApiResponse";
import { NextResponse } from "next/server";
import { validateAdminSession } from "../../_utils/ValidateSession";
import CategorySchema from "@/schema/CategorySchema";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import prisma from "@/db/connectDb";

export const POST = asyncHandler(async (req) => {
  validateAdminSession();

  const body = await req.json();
  const result = CategorySchema.safeParse(body);

  // Validate the schema
  if (!result.success) {
    const error = formatValidationErrors(result.error);
    throw new ApiError(400, "Validation error", error);
  }

  const { name, parentId } = result.data;

  const existingCategory = await prisma.category.findUnique({
    where: { name },
  });

  if (existingCategory) {
    throw new ApiError(400, `Category with name "${name}" already exists.`);
  }

  const newCategory = await prisma.category.create({
    data: {
      name,
      parentId,
    },
  });

  return NextResponse.json(new ApiResponse(newCategory), { status: 201 });
});

export const GET = asyncHandler(async (req) => {

    const categories = await prisma.category.findMany({
      include: {
        parent: true, 
        children: true, 
      },
    });
  
    return NextResponse.json(new ApiResponse(categories), { status: 200 });
  });
  