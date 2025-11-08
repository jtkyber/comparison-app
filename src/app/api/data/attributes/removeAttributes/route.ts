import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
	const { comparisonID, attributeIDs }: { comparisonID: number; attributeIDs: number[] } = await req.json();

	if (typeof comparisonID !== 'number' || !Array.isArray(attributeIDs)) {
		throw new Error('Invalid body data');
	}

	await sql.transaction([
		sql`DELETE FROM cells WHERE attribute_id = ANY(${attributeIDs})`,
		sql`DELETE FROM keyRatingPairs WHERE attribute_id = ANY(${attributeIDs})`,
		sql`DELETE FROM attributes WHERE id = ANY(${attributeIDs})`,
	]);

	return NextResponse.json(true);
}
