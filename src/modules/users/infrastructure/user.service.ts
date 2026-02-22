// import { db } from "@/lib/db";
// import { users } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";
import { CreateUserDTO, UpdateUserDTO } from "../application/dtos/user.dto";

export class UserService {
    async createUser(data: CreateUserDTO) {
        console.log("Database disabled: createUser", data);
        return null;
    }

    async findByEmail(email: string) {
        console.log("Database disabled: findByEmail", email);
        return null;
    }

    async findById(id: number) {
        console.log("Database disabled: findById", id);
        return null;
    }

    async updateUser(id: number, data: UpdateUserDTO) {
        console.log("Database disabled: updateUser", id, data);
        return null;
    }
}
