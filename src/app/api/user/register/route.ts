import { sql } from '@/src/lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { username, password } = await req.json();

	const hash = await bcrypt.hash(password, 10);

	const [data] = await sql`
        WITH user_table AS (
			INSERT INTO users (username, hash)
			VALUES (${username}, ${hash})
			RETURNING id
		)
		INSERT INTO settings (userid)
		SELECT id FROM user_table
		RETURNING user_id
    ;`;

	return NextResponse.json(data.userid);
}
