import asyncHandler from "@/app/api/_utils/asyncHandler";
import { ApiError } from "@/app/api/_utils/ApiError";
import { ApiResponse } from "@/app/api/_utils/ApiResponse";
import { NextResponse } from "next/server";
import { validateAdminSession } from "../../_utils/ValidateSession";
import CategorySchema from "@/schema/CategorySchema";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import { CategoryRepository } from "../../_repositoriy/CategoryRepository";

export const POST = asyncHandler(async (req) => {
    validateAdminSession();
    
    const body = await req.json();
    const result = CategorySchema.safeParse(body);
    if (!result.success) {
        const error = formatValidationErrors(result.error);
        throw new ApiError(400, "Validation error", error);
    }
    const { name, parentId } = result.data;
    const existingCategory = await CategoryRepository.getCategoryByName(name);
    if (existingCategory) {
        throw new ApiError(400, `Category with name "${name}" already exists.`);
    }
    const newCategory = await CategoryRepository.createCategory({
        name,
        parent: parentId ? { connect: { id: parentId } } : undefined,
    });
    return NextResponse.json(new ApiResponse(newCategory), { status: 201 });
});


export const GET = asyncHandler(async (req) => {
    const categories = await CategoryRepository.getAllCategories();
    return NextResponse.json(new ApiResponse(categories), { status: 200 });
});
