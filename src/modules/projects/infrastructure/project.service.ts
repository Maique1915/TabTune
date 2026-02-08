import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { CreateProjectDTO, UpdateProjectDTO } from "../application/dtos/project.dto";

export class ProjectService {
    async createProject(data: CreateProjectDTO) {
        const [project] = await db.insert(projects).values({
            userId: data.userId,
            name: data.name,
            data: data.data,
        }).returning();
        return project;
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
        const [project] = await db.update(projects)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(projects.id, id), eq(projects.userId, userId)))
            .returning();
        return project;
    }

    async deleteProject(id: number, userId: number) {
        return await db.delete(projects)
            .where(and(eq(projects.id, id), eq(projects.userId, userId)));
    }
}
