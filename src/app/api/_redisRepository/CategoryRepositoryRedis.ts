import handleDatabaseOperation from "../_utils/handelDatabaseOperation";
import redisClient from "@/db/connectRedisDb";
import { Category } from "@prisma/client";

const EXPIRATION_TIME = 60; // 1 minute

export const CategoryRepositoryRedis = {
  saveCategory: async (
    categoryId: string,
    categoryData: Category
  ): Promise<void> => {
    return await handleDatabaseOperation(async () => {
      const key = `category:${categoryId}`;
      await redisClient.set(key, JSON.stringify(categoryData));
      await redisClient.expire(key, EXPIRATION_TIME);
    });
  },

  updateCategory: async (
    categoryId: string,
    categoryData: Partial<Category>
  ): Promise<void> => {
    return await handleDatabaseOperation(async () => {
      const key = `category:${categoryId}`;
      const existingData = await redisClient.get(key);
      const updatedData = existingData
        ? { ...JSON.parse(existingData), ...categoryData }
        : categoryData;

      await redisClient.set(key, JSON.stringify(updatedData));
      await redisClient.expire(key, EXPIRATION_TIME);
    });
  },

  getCategoryById: async (categoryId: string): Promise<Category | null> => {
    return await handleDatabaseOperation(async () => {
      const key = `category:${categoryId}`;
      const data = await redisClient.get(key);
      return data ? (JSON.parse(data) as Category) : null;
    });
  },

  getCategoryByName: async (name: string): Promise<Category | null> => {
    return await handleDatabaseOperation(async () => {
      const keys = await redisClient.keys(`category:*`);
      for (const key of keys) {
        const data = await redisClient.get(key);
        const category = JSON.parse(data as string) as Category;
        if (category.name === name) {
          return category;
        }
      }
      return null;
    });
  },

  deleteCategory: async (categoryId: string): Promise<number | null> => {
    return await handleDatabaseOperation(async () => {
      const key = `category:${categoryId}`;
      const exists = await redisClient.del(key);
      return exists ? 1 : null;
    });
  },

  getAllCategories: async (): Promise<Category[]> => {
    return await handleDatabaseOperation(async () => {
      const keys = await redisClient.keys(`category:*`);
      const categories = [];
      for (const key of keys) {
        const data = await redisClient.get(key);
        if (data) categories.push(JSON.parse(data) as Category);
      }
      return categories;
    });
  },
};

export default CategoryRepositoryRedis;
