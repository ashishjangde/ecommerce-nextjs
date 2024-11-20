import asyncHandler from "@/app/api/_utils/asyncHandler";
import { ApiError } from "@/app/api/_utils/ApiError";
import { ApiResponse } from "@/app/api/_utils/ApiResponse";
import { NextResponse } from "next/server";
import { validateAdminSession } from "../../_utils/ValidateSession";
import CategorySchema from "@/schema/CategorySchema";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import { CategoryRepository } from "../../_repositoriy/CategoryRepository";
import CategoryRepositoryRedis from "../../_redisRepository/CategoryRepositoryRedis";
import redisClient from "@/db/connectRedisDb";

const EXPIRATION_TIME = 60;

export const POST = asyncHandler(async (req) => {
  validateAdminSession();

  const body = await req.json();
  const result = CategorySchema.safeParse(body);
  if (!result.success) {
    const error = formatValidationErrors(result.error);
    throw new ApiError(400, "Validation error", error);
  }

  const { name, parentId } = result.data;
  const existingCategory = await CategoryRepositoryRedis.getCategoryByName(name) 
    || await CategoryRepository.getCategoryByName(name);

  if (existingCategory) {
    throw new ApiError(400, `Category with name "${name}" already exists.`);
  }

  const newCategory = await CategoryRepository.createCategory({
    name,
    parent: parentId ? { connect: { id: parentId } } : undefined,
  });

  await CategoryRepositoryRedis.saveCategory(newCategory.id, newCategory);

  return NextResponse.json(new ApiResponse(newCategory), { status: 201 });
});


export const GET = asyncHandler(async () => {
    const dbCategories = await CategoryRepository.getAllCategories();
    
    await Promise.all(
      dbCategories.map(async (category) => {
        const key = `category:${category.id}`;
        const exists = await redisClient.exists(key);
  
        if (!exists) {
          await redisClient.set(key, JSON.stringify(category));
          await redisClient.expire(key, EXPIRATION_TIME);
        }
      })
    );
  
    return NextResponse.json(new ApiResponse(dbCategories), { status: 200 });
  });
  