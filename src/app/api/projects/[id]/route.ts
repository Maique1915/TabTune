import { NextRequest, NextResponse } from "next/server";
// import { ProjectService } from "@/modules/projects/infrastructure/project.service";
// import { UpdateProjectSchema } from "@/modules/projects/application/dtos/project.dto";

// const projectService = new ProjectService();

export async function GET() {
    return NextResponse.json({ message: "Database disabled" }, { status: 503 });
}

export async function PATCH() {
    return NextResponse.json({ message: "Database disabled" }, { status: 503 });
}

export async function DELETE() {
    return NextResponse.json({ message: "Database disabled" }, { status: 503 });
}
