import z from 'zod';

const CategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters long."), 
  parentId: z.string().optional().nullable(), 
});

export default CategorySchema;
