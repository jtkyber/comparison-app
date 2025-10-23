import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { userID, name } = await req.json();

	const [data] = await sql`
        INSERT into comparisons (name, userid)
        VALUES (${name}, ${userID})
        RETURNING ID
    ;`;

	const comparisonID = data.id;
	if (!comparisonID) {
		throw new Error('Unable to add comparison to database');
	}

	const [user] = await sql`
        UPDATE users
        SET comparisons = array_append(coalesce(comparisons, ARRAY[]::integer[]), ${comparisonID}::integer)
        WHERE id = ${userID}::integer
        RETURNING comparisons
    ;`;

	const newComparisonList = user.comparisons;
	if (!newComparisonList) {
		throw new Error('Unable to add comparison to user account');
	}

	const comparisons = await sql`
		SELECT * FROM comparisons
		WHERE userid = ${userID}
	;`;

	return NextResponse.json(comparisons);
}
