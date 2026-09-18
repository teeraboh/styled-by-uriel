import { z } from "zod";

// Shared between the client-side checkout form and (later) the server-side
// order creation route — see .agents/rules/code-style.md.
export const checkoutSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(15, "Enter a valid phone number"),
  whatsappUpdates: z.boolean().optional(),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  streetAddress: z.string().min(5, "Street address is required"),
  landmark: z.string().optional(),
  state: z.string().min(1, "Select your state"),
  city: z.string().min(2, "City is required"),
  shippingMethod: z.enum(["standard", "express", "pickup"]),
  orderNotes: z.string().optional(),
  termsAgreed: z.boolean().refine((value) => value === true, {
    message: "Please accept the terms and conditions",
  }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
