import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { CreateProjectDTO, UpdateProjectDTO } from "../application/dtos/project.dto";

export class ProjectService {
    async createProject(data: CreateProjectDTO) {
        const [result] = await db.insert(projects).values({
            userId: data.userId,
            name: data.name,
            screenContext: data.screenContext,
            data: data.data,
        });
        return await this.getProject(result.insertId, data.userId);
    }

    async listUserProjects(userId: number) {
        return await db.query.projects.findMany({
            where: eq(projects.userId, userId),
            orderBy: (fields: any, { desc }: any) => [desc(fields.updatedAt)],
        });
    }

    async getProject(id: number, userId: number) {
        return await db.query.projects.findFirst({
            where: and(eq(projects.id, id), eq(projects.userId, userId)),
        });
    }

    async updateProject(id: number, userId: number, data: UpdateProjectDTO) {
        await db.update(projects)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(projects.id, id), eq(projects.userId, userId)));
        return await this.getProject(id, userId);
    }

    async deleteProject(id: number, userId: number) {
        return await db.delete(projects)
            .where(and(eq(projects.id, id), eq(projects.userId, userId)));
    }
}
