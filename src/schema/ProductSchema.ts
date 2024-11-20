import z from "zod";

const ProductVariantSchema = z.object({
  id: z.string().optional(), 
  name: z.string().min(1, "Variant name is required"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  variantType: z.string().min(1, "Variant type is required"),
  attributes: z.record(z.string(), z.any()).optional(), 
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
  sellingPrice: z.number().positive("Selling price must be positive"),
  actualPrice: z.number().positive("Actual price must be positive"),
  images: z.array(z.string().url("Each image must be a valid URL")).min(1, "At least one image is required"),
  productId: z.string().optional(), 
});


const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Product name is required"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().min(1, "Product description is required"),
  sellingPrice: z.number().positive("Selling price must be positive"),
  actualPrice: z.number().positive("Actual price must be positive"),
  gender: z.enum(["Male", "Female", "Unisex"]).optional(),
  productImages: z.array(z.string().url("Each image must be a valid URL")).min(1, "At least one image is required"),
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
  tags: z.array(z.string()).optional(),
  sellerId: z.string().min(1, "Seller ID is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  attributes: z.record(z.string(), z.any()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  variants: z.array(ProductVariantSchema).optional(), 
});

export default ProductSchema;
