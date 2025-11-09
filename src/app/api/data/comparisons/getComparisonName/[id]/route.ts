import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: any }) {
	const { id } = await params;

	const [data] = await sql`
        SELECT name FROM comparisons
        WHERE id = ${id}
    ;`;

	return NextResponse.json(data.name);
}
