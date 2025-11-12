import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { userID, name } = await req.json();

	const [data] = await sql`
        INSERT into comparisons (name, user_id)
        VALUES (${name}, ${userID})
        RETURNING id
    ;`;

	const newComparisonID: number = data.id;

	if (!newComparisonID) throw new Error('Unable to add comparison to database');

	await sql`
		UPDATE settings
		SET selected_comparison = ${newComparisonID}
		WHERE user_id = ${userID}
	;`;

	const comparisons = await sql`
		SELECT * FROM comparisons
		WHERE user_id = ${userID}
	;`;

	return NextResponse.json({
		comparisons,
		newComparisonID,
	});
}
