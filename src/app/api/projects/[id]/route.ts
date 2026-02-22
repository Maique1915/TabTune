import { NextRequest, NextResponse } from "next/server";
// import { ProjectService } from "@/modules/projects/infrastructure/project.service";
// import { UpdateProjectSchema } from "@/modules/projects/application/dtos/project.dto";

// const projectService = new ProjectService();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    // const { id } = await params;
    // const userId = 1;
    // const project = await projectService.getProject(Number(id), userId);

    // if (!project) return NextResponse.json({ error: "Not Found" }, { status: 404 });
    // return NextResponse.json(project);
    return NextResponse.json({ message: "Database disabled" }, { status: 503 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        /*
        const { id } = await params;
        const body = await req.json();
        const validatedData = UpdateProjectSchema.parse(body);
        const userId = 1;

        const project = await projectService.updateProject(Number(id), userId, validatedData);
        return NextResponse.json(project);
        */
        return NextResponse.json({ message: "Database disabled" }, { status: 503 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    // const { id } = await params;
    // const userId = 1;
    // await projectService.deleteProject(Number(id), userId);
    // return new NextResponse(null, { status: 204 });
    return NextResponse.json({ message: "Database disabled" }, { status: 503 });
}
