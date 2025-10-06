import { sql } from '@/src/lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { username, password } = await req.json();

	const hash = await bcrypt.hash(password, 10);

	const [data] = await sql`
    INSERT INTO users (username, hash)
    VALUES (${username}, ${hash})
    RETURNING username, comparisons
    ;`;

	return NextResponse.json(data);
}
