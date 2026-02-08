import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const screenContext = searchParams.get('screenContext') as any;

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        let query = db.select().from(projects).where(eq(projects.userId, Number(userId)));

        if (screenContext) {
            query = db.select().from(projects).where(
                and(
                    eq(projects.userId, Number(userId)),
                    eq(projects.screenContext, screenContext)
                )
            );
        }

        const userProjects = await query;

        return NextResponse.json(userProjects);
    } catch (error: any) {
        console.error('Fetch projects error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, name, screenContext, data } = body;

        if (!userId || !name || !screenContext || !data) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const [newProject] = await db.insert(projects).values({
            userId: Number(userId),
            name,
            screenContext,
            data: typeof data === 'string' ? JSON.parse(data) : data,
        });

        // Drizzle-mysql returns { insertId: ... } or similar depending on the driver
        // For simplicity and common patterns, we fetch back the ID or rely on body
        return NextResponse.json({ message: 'Project created successfully', id: newProject.insertId });
    } catch (error: any) {
        console.error('Create project error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name, data, screenContext } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing project id' }, { status: 400 });
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (data) updateData.data = typeof data === 'string' ? JSON.parse(data) : data;
        if (screenContext) updateData.screenContext = screenContext;

        await db.update(projects)
            .set(updateData)
            .where(eq(projects.id, Number(id)));

        return NextResponse.json({ message: 'Project updated successfully' });
    } catch (error: any) {
        console.error('Update project error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing project id' }, { status: 400 });
        }

        await db.delete(projects).where(eq(projects.id, Number(id)));

        return NextResponse.json({ message: 'Project deleted successfully' });
    } catch (error: any) {
        console.error('Delete project error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
