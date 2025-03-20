import { z } from 'zod'

const SignupSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().email({ message: "Invalid email format" }).min(5, { message: "Email must be at least 5 characters long" }),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(15, { message: "Password must not exceed 15 characters" })
        .regex(/\d/, { message: "Password must contain at least one number" })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character" })
});


const LoginSchema = z.object({
    email: z.string().email("Invalid email format").min(5)
});

export { SignupSchema, LoginSchema };