import { z } from "zod";

export const loginSchema = z.object({
  orgId: z.string().min(1, "Organisation ID is required"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  orgName: z.string().min(2, "Organisation name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().max(120, "Name is too long"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
