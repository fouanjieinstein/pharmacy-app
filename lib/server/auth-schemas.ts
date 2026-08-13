import { z } from "zod";

// Server-side validation. The client also validates for UX, but that is never
// relied upon — every field is re-checked here before it reaches the database.

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(190),
  phone: z.string().trim().max(32).optional().or(z.literal("")),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .max(200, "Password is too long"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(190),
  password: z.string().min(1, "Password is required").max(200),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

/** Flattens zod issues into a { field: message } map for the client. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) out[key] = issue.message;
  }
  return out;
}
