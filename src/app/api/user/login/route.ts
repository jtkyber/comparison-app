import { sql } from '@/src/lib/db';
import { DBUser } from '@/src/types/db.types';
import { ISettings } from '@/src/types/settings.types';
import { isNumeric } from '@/src/utils/general';
import { underscoreToCamelObject } from '@/src/utils/server';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { username, password } = await req.json();

	const [user] = (await sql`
        SELECT * FROM users
        WHERE username = ${username}
    ;`) as DBUser[];

	if (!user?.hash) throw new Error('No matching username');
	const match = await bcrypt.compare(password, user.hash);
	if (!match) throw new Error('Wrong password');

	const comparisons = await sql`
		SELECT * FROM comparisons
		WHERE user_id = ${user.id}
	;`;

	const [settings] = await sql`
		SELECT * FROM settings
		WHERE user_id = ${user.id}
	;`;

	delete user.hash;

	for (const key in settings) {
		const value = settings[key];
		if (typeof value === 'string' && isNumeric(value)) settings[key] = parseFloat(value);
	}

	return NextResponse.json({
		user: {
			...user,
			comparisons: comparisons,
		},
		settings: underscoreToCamelObject(settings),
	});
}
