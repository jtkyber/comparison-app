import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
	const { id } = await req.json();

	const [comparison] = await sql`
        SELECT * FROM comparison
        WHERE id = ${id}
    ;`;

	return NextResponse.json(comparison);
}
