import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversations } from '@/lib/db/schema';
import { eq, and, or } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userOneId, userTwoId } = body;

        if (!userOneId || !userTwoId) {
            return NextResponse.json({ error: 'Missing user IDs' }, { status: 400 });
        }

        // Ensure userOneId < userTwoId for consistency if desired, 
        // but here we just need to find the pair
        const u1 = Math.min(Number(userOneId), Number(userTwoId));
        const u2 = Math.max(Number(userOneId), Number(userTwoId));

        let existing = await db.select().from(conversations).where(
            and(
                eq(conversations.userOneId, u1),
                eq(conversations.userTwoId, u2)
            )
        ).limit(1);

        if (existing.length) {
            return NextResponse.json(existing[0]);
        }

        const [result] = await db.insert(conversations).values({
            userOneId: u1,
            userTwoId: u2,
        });

        const newConv = await db.select().from(conversations).where(eq(conversations.id, result.insertId)).limit(1);

        return NextResponse.json(newConv[0]);
    } catch (error: any) {
        console.error('Conversation API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
