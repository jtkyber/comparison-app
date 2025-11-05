import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: any }) {
	const { userid } = await params;

	const comparisons = await sql`
		SELECT * FROM comparisons
		WHERE user_id = ${userid}
    ;`;

	return NextResponse.json(comparisons);
}
