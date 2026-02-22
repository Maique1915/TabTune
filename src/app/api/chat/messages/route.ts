import { NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import { messages } from '@/lib/db/schema';
// import { eq, asc } from 'drizzle-orm';

export async function GET() {
    return NextResponse.json({ message: "Database disabled" }, { status: 503 });
}

export async function POST() {
    return NextResponse.json({ message: "Database disabled" }, { status: 503 });
}
