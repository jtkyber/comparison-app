import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { userID, name } = await req.json();

	const data = await sql`
        INSERT into comparisons (name, user_id)
        VALUES (${name}, ${userID})
        RETURNING id
    ;`;

	if (data.length === 1) {
		await sql`
			UPDATE settings
			SET selected_comparison = ${data[0].id}
			WHERE user_id = ${userID}
		;`;

		console.log('setting first selected comparison');
	}

	const comparisonID = data[0].id;
	if (!comparisonID) {
		throw new Error('Unable to add comparison to database');
	}

	const comparisons = await sql`
		SELECT * FROM comparisons
		WHERE user_id = ${userID}
	;`;

	return NextResponse.json(comparisons);
}
