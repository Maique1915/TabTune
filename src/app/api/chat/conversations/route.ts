import { NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import { conversations } from '@/lib/db/schema';
// import { eq, and, or } from 'drizzle-orm';

export async function POST() {
    return NextResponse.json({ message: "Database disabled" }, { status: 503 });
}
