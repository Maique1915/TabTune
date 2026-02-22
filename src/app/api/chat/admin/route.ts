import { NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import { users } from '@/lib/db/schema';
// import { eq } from 'drizzle-orm';

export async function GET() {
    return NextResponse.json({ message: "Database disabled" }, { status: 503 });
}
