import { sql } from '@/src/lib/db';
import { isNumeric } from '@/src/utils/general';
import { underscoreToCamelObject } from '@/src/utils/server';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { username, password } = await req.json();

	const hash = await bcrypt.hash(password, 10);

	const [data] = await sql`
        WITH user_table AS (
			INSERT INTO users (username, hash)
			VALUES (${username}, ${hash})
			RETURNING id, username
		), settings_table AS (
			INSERT INTO settings (user_id)
			SELECT id FROM user_table
			RETURNING *
		)
		SELECT
			row_to_json(user_table) AS "user",
			row_to_json(settings_table) AS "settings"
		FROM user_table
		CROSS JOIN settings_table
    ;`;

	for (const key in data.settings) {
		const value = data.settings[key];
		if (typeof value === 'string' && isNumeric(value)) data.settings[key] = parseFloat(value);
	}

	return NextResponse.json({
		user: {
			...data.user,
			comparisons: [],
		},
		settings: underscoreToCamelObject(data.settings),
	});
}
