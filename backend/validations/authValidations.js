import { z } from "zod";

const COMMON_WEAK_PASSWORDS = new Set([
  "password",
  "password123",
  "password123!",
  "password1234",
  "12345678",
  "123456789",
  "1234567890",
  "qwerty123",
  "qwerty1234",
  "admin123",
  "admin1234",
  "admin123!",
  "welcome123",
  "welcome123!",
  "letmein123",
  "iloveyou123",
  "pass1234",
  "1234pass",
]);

export const passwordSchema = z
  .string({ required_error: "Password is required" })
  .min(8, "Password must be at least 8 characters long")
  .max(128, "Password cannot exceed 128 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character (!@#$%^&*...)")
  .refine(
    (val) => !COMMON_WEAK_PASSWORDS.has(val.toLowerCase()),
    "Password is too common or easily guessable. Please choose a stronger password."
  )
  .refine(
    (val) => !/^(.)\1+$/.test(val),
    "Password cannot consist of a single repeated character"
  );

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters"),
    email: z.string().trim().email("Invalid email address"),
    password: passwordSchema,
    role: z.enum(["FOUNDER", "INVESTOR"]),
  })
  .refine(
    (data) => {
      const emailPrefix = data.email.split("@")[0].toLowerCase();
      const passLower = data.password.toLowerCase();
      if (emailPrefix.length >= 3 && passLower.includes(emailPrefix)) {
        return false;
      }
      return true;
    },
    {
      message: "Password cannot contain your email username",
      path: ["password"],
    }
  );

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
