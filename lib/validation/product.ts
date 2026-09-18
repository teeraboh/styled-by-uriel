import { z } from "zod";

export const productSchema = z
  .object({
    name: z.string().min(2, "Product name must be at least 2 characters").max(100),
    description: z.string().min(10, "Description must be at least 10 characters").max(1000),
    price: z.number().positive("Price must be greater than zero").max(10000000),
    category_id: z.string().min(1, "Category is required"),
    availability: z.boolean().default(true),
    stock_quantity: z.number().int().nonnegative("Stock quantity cannot be negative"),
    images: z.array(z.string().url("Must be a valid image URL")).min(1, "At least one product image is required"),
    sizes: z.array(z.string()).optional(),
  })
  .strict();

export type ProductFormValues = z.infer<typeof productSchema>;
