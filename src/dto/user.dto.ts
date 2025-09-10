import {z} from "zod";

export const createUserSchema = z.object({
    name: z.string().min(2, "Name is required").max(50, "Name is too long").trim(),
    last_name: z.string().min(1, "Last name is required").trim(),
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    password: z.string().min(6, "Password must be at least 6 characters long").max(50, "Password is too long"),
});

export interface CreateUserDto extends z.infer<typeof createUserSchema> {}