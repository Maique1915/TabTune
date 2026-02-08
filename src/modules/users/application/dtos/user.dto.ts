import { z } from "zod";

export const CreateUserSchema = z.object({
    name: z.string().min(2).max(255),
    email: z.string().email(),
    password: z.string().min(6),
    preferredLanguage: z.enum(["en", "pt", "es"]).optional(),
});

export const UpdateUserSchema = CreateUserSchema.partial();

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
