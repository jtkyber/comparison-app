import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
	const { comparisonID, entryIDs }: { comparisonID: number; entryIDs: number[] } = await req.json();

	if (typeof comparisonID !== 'number' || !Array.isArray(entryIDs)) {
		throw new Error('Invalid body data');
	}

	await sql.transaction([
		sql`DELETE FROM entries WHERE id = ANY(${entryIDs})`,
		sql`DELETE FROM cells WHERE entry_id = ANY(${entryIDs})`,
	]);

	return NextResponse.json(true);
}
