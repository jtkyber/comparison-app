import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
	const { comparisonID, entryIDs }: { comparisonID: number; entryIDs: number[] } = await req.json();

	if (typeof comparisonID !== 'number' || !Array.isArray(entryIDs)) {
		throw new Error('Invalid body data');
	}

	const comparisons = await sql`
        DELETE FROM entries
        WHERE id = ANY(${entryIDs})
        RETURNING *
    ;`;

	return NextResponse.json(comparisons);
}
