import { sql } from '@/src/lib/db';
import { underscoreToCamelObject } from '@/src/utils/server';
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
		WHERE userid = ${user.id}
	;`;

	const [settings] = await sql`
		SELECT * FROM settings
		WHERE userid = ${user.id}
	;`;

	delete user.hash;

	return NextResponse.json({
		user: {
			...user,
			comparisons: comparisons,
		},
		settings: underscoreToCamelObject(settings),
	});
}
