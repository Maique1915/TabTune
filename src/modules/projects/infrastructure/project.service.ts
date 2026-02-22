// import { db } from "@/lib/db";
// import { projects } from "@/lib/db/schema";
// import { eq, and } from "drizzle-orm";
import { CreateProjectDTO, UpdateProjectDTO } from "../application/dtos/project.dto";

export class ProjectService {
    async createProject(data: CreateProjectDTO) {
        console.log("Database disabled: createProject", data);
        return null;
    }

    async listUserProjects(userId: number) {
        console.log("Database disabled: listUserProjects", userId);
        return [];
    }

    async getProject(id: number, userId: number) {
        console.log("Database disabled: getProject", id, userId);
        return null;
    }

    async updateProject(id: number, userId: number, data: UpdateProjectDTO) {
        console.log("Database disabled: updateProject", id, userId, data);
        return null;
    }

    async deleteProject(id: number, userId: number) {
        console.log("Database disabled: deleteProject", id, userId);
        return null;
    }
}
