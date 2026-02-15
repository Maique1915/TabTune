import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get('conversationId');

        if (!conversationId) {
            return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 });
        }

        const chatMessages = await db.select()
            .from(messages)
            .where(eq(messages.conversationId, Number(conversationId)))
            .orderBy(asc(messages.createdAt));

        return NextResponse.json(chatMessages);
    } catch (error: any) {
        console.error('Fetch messages error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { conversationId, senderId, content } = body;

        if (!conversationId || !senderId || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await db.insert(messages).values({
            conversationId: Number(conversationId),
            senderId: Number(senderId),
            content,
        });

        return NextResponse.json({ message: 'Message sent successfully' });
    } catch (error: any) {
        console.error('Send message error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
