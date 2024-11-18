import { Category, Prisma } from "@prisma/client";
import handleDatabaseOperation from "../_utils/handelDatabaseOperation";
import prisma from "@/db/connectPrismaDb";

export const CategoryRepository = {
  getCategoryById: async (id: string): Promise<Category | null> => {
    return await handleDatabaseOperation(async () => {
      return prisma.category.findUnique({ where: { id } });
    });
  },


  updateCategory: async (
    id: string,
    categoryData: Partial<Prisma.CategoryUpdateInput>
  ): Promise<Category> => {
    return await handleDatabaseOperation(async () => {
      return prisma.category.update({ where: { id }, data: categoryData });
    });
  },


  deleteCategory: async (id: string): Promise<Category> => {
    return await handleDatabaseOperation(async () => {
      return prisma.category.delete({ where: { id } });
    });
  },


  getAllCategories: async (): Promise<Category[]> => {
    return await handleDatabaseOperation(async () => {
      return prisma.category.findMany({
        include: {
          parent: true, 
          children: true, 
        },
      });
    });
  },


  getCategoryByName: async (name: string): Promise<Category | null> => {
    return await handleDatabaseOperation(async () => {
      return prisma.category.findUnique({ where: { name } });
    });
  },


  createCategory: async (categoryData: Prisma.CategoryCreateInput): Promise<Category> => {
    return await handleDatabaseOperation(async () => {
      return prisma.category.create({
        data: categoryData,
      });
    });
  },
  
};
