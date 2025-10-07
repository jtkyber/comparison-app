import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: any }) {
	const { id } = await params;

	const comparison = await sql`
        SELECT * FROM comparisons
        WHERE id = ${id}
    ;`;

	return NextResponse.json(comparison);
}
