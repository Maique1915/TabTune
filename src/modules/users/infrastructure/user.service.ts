import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { CreateUserDTO, UpdateUserDTO } from "../application/dtos/user.dto";

export class UserService {
    async createUser(data: CreateUserDTO) {
        const [result] = await db.insert(users).values({
            name: data.name,
            email: data.email,
            passwordHash: data.password, // In a real app, hash this first!
            preferredLanguage: data.preferredLanguage,
        });
        return await this.findById(result.insertId);
    }

    async findByEmail(email: string) {
        return await db.query.users.findFirst({
            where: eq(users.email, email),
        });
    }

    async findById(id: number) {
        return await db.query.users.findFirst({
            where: eq(users.id, id),
        });
    }

    async updateUser(id: number, data: UpdateUserDTO) {
        await db.update(users)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(users.id, id));
        return await this.findById(id);
    }
}
