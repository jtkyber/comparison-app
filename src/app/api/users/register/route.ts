import { sql } from '@/src/lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { username, password } = await req.json();

	const hash = await bcrypt.hash(password, 10);

	const [user] = await sql`
        INSERT INTO users (username, hash)
        VALUES (${username}, ${hash})
        RETURNING username, comparisons
    ;`;

	const comparisons = await sql`
		SELECT * FROM comparisons
		WHERE id IN (${user.comparisons.toString()})
	;`;

	return NextResponse.json({
		username: user.username,
		comparisons: comparisons,
	});
}
