import zod from "zod";

const FileSchema = zod
  .object({
    name: zod.string().min(1, "File name is required"),
    type: zod.string().min(1, "File type is required"),
    size: zod.number().positive("File size must be positive"),
  })
  .optional();


const BaseCategorySchema = zod.object({
  id: zod.string().min(1, "Category ID is required"),
  name: zod.string().min(1, "Category name is required"),
  parentId: zod.string().nullable(), 
  image: FileSchema, 
  isFeatured: zod.boolean().optional(),
});


const CreateCategorySchema = zod
  .array(BaseCategorySchema)
  .refine(
    (categories) => {
      const rootCategories = categories.filter((category) => !category.parentId);
      const childCategories = categories.filter((category) => category.parentId);

      return rootCategories.length === 1 && childCategories.length >= 2;
    },
    {
      message: "You must have exactly one root category (no parentId) and at least two child categories (with parentId).",
    }
  )
  .refine(
    (categories) => {
      const rootCategory = categories.find((category) => !category.parentId);
      return rootCategory ? rootCategory.isFeatured !== undefined : true;
    },
    {
      message: "The root category must have 'isFeatured' defined.",
    }
  )
  .refine(
    (categories) => {
      const childCategories = categories.filter((category) => category.parentId);
      return childCategories.every((category) => category.isFeatured === undefined);
    },
    {
      message: "Child categories (with parentId) cannot have 'isFeatured'.",
    }
  )
  .refine(
    (categories) => {
      const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));
      const validHierarchy = categories.every((category) => {
        if (category.parentId) {
          return categoryMap.has(category.parentId);
        }
        return true;
      });
      return validHierarchy;
    },
    {
      message: "Each child category must have a valid parentId that exists in the provided categories.",
    }
  );

export default CreateCategorySchema;
