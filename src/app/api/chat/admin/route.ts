import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        const foundAdmin = await db.select({
            id: users.id,
            name: users.name,
            email: users.email
        })
            .from(users)
            .where(eq(users.nivel, 'admin'))
            .limit(1);

        if (!foundAdmin.length) {
            return NextResponse.json({ error: 'No admin found' }, { status: 404 });
        }

        return NextResponse.json(foundAdmin[0]);
    } catch (error: any) {
        console.error('Fetch admin error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
