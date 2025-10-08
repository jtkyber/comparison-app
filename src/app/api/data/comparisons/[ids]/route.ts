import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: any }) {
	const { ids } = await params;
	const idsFormatted = ids.split(',').map(Number);

	const query = `
		SELECT * FROM comparisons
		WHERE id = ANY($1)
    ;`;

	const comparisons = await sql.query(query, [idsFormatted]);

	return NextResponse.json(comparisons);
}
