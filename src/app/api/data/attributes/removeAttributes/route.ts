import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
	const { comparisonID, attributeIDs }: { comparisonID: number; attributeIDs: number[] } = await req.json();

	if (typeof comparisonID !== 'number' || !Array.isArray(attributeIDs)) {
		throw new Error('Invalid body data');
	}

	const query = `
        BEGIN ;

        DELETE FROM cells WHERE attribute_id = ANY($1::int[]);
        DELETE FROM key_rating_pairs WHERE attribute_id = ANY($1::int[]);
        DELETE FROM attributes WHERE id = ANY($1::int[]);

        COMMIT:
    `;

	const comparisons = await sql.query(query, [attributeIDs]);

	return NextResponse.json(comparisons);
}
