import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        const { id, name, email, preferredLanguage } = await req.json();

        if (!id || !name || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Update user in database
        await db.update(users)
            .set({
                name,
                email,
                preferredLanguage: preferredLanguage as "en" | "pt" | "es"
            })
            .where(eq(users.id, id));

        // Fetch updated user to return
        const updatedUser = await db.query.users.findFirst({
            where: eq(users.id, id),
        });

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found after update' }, { status: 404 });
        }

        const { passwordHash, ...userWithoutPassword } = updatedUser;

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: userWithoutPassword
        });
    } catch (error: any) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
