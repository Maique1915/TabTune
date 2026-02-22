import { NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import { users } from '@/lib/db/schema';
// import { bcrypt } from 'bcryptjs';

export async function POST() {
    return NextResponse.json({ message: "Database disabled" }, { status: 503 });
}
