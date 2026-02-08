import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/modules/projects/infrastructure/project.service";
import { UpdateProjectSchema } from "@/modules/projects/application/dtos/project.dto";

const projectService = new ProjectService();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = 1;
    const project = await projectService.getProject(Number(params.id), userId);

    if (!project) return NextResponse.json({ error: "Not Found" }, { status: 404 });
    return NextResponse.json(project);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const validatedData = UpdateProjectSchema.parse(body);
        const userId = 1;

        const project = await projectService.updateProject(Number(params.id), userId, validatedData);
        return NextResponse.json(project);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = 1;
    await projectService.deleteProject(Number(params.id), userId);
    return new NextResponse(null, { status: 204 });
}
