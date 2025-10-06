import { sql } from '@/src/lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { username, password } = await req.json();

	const [user] = await sql`
        SELECT * FROM users
        WHERE username = ${username}
    ;`;

	if (!user?.hash) throw new Error('No matching username');
	const match = await bcrypt.compare(password, user.hash);
	if (!match) throw new Error('Wrong password');

	const comparisons = await sql`
		SELECT * FROM comparisons
		WHERE id IN (${user.comparisons.toString()})
	;`;

	return NextResponse.json({
		username: user.username,
		comparisons: comparisons,
	});
}
