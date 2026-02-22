import { NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import { projects } from '@/lib/db/schema';
// import { eq, and } from 'drizzle-orm';

export async function GET() {
    return NextResponse.json({ message: "Database disabled" }, { status: 503 });
}

export async function POST() {
    return NextResponse.json({ message: "Database disabled" }, { status: 503 });
}

export async function PUT() {
    return NextResponse.json({ message: "Database disabled" }, { status: 503 });
}

export async function DELETE() {
    return NextResponse.json({ message: "Database disabled" }, { status: 503 });
}
