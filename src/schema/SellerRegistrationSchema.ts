import { z } from 'zod';

const SellerRegistrationSchema = z.object({
  businessName: z
    .string()
    .min(2, { message: "Business name must be at least 2 characters long." })
    .max(100, { message: "Business name must be no more than 100 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits." }),

  address: z.object({
    street: z
      .string()
      .min(5, { message: "Street address must be at least 5 characters." }),
    city: z
      .string()
      .min(2, { message: "City name must be at least 2 characters." }),
    state: z
      .string()
      .min(2, { message: "State name must be at least 2 characters." }),
    pinCode: z
      .string()
      .max(6, { message: "Postal code must be no more than 6 characters." })
      .regex(/^\d{6}$/, { message: "Postal code must be a 6-digit number." }),
    country: z
      .string()
      .min(2, { message: "Country name must be at least 2 characters." }),
  }),

  website: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional(),
  gstin: z
    .string()
    .length(15, { message: "GSTIN must be exactly 15 characters." }),
  panNumber: z
    .string()
    .length(10, { message: "PAN number must be exactly 10 characters." }),
});

export default SellerRegistrationSchema;
