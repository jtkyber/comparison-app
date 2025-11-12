import { sql } from '@/src/lib/db';
import { DBUser } from '@/src/types/db.types';
import { isNumeric } from '@/src/utils/general';
import { underscoreToCamelObject } from '@/src/utils/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: any }) {
	const { id } = await params;

	const [user] = (await sql`
        SELECT * FROM users
        WHERE id = ${id}
    ;`) as DBUser[];

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
