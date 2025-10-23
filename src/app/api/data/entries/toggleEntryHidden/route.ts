import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
	const { id } = await req.json();

	const [entries] = await sql`
        UPDATE entries
        SET hidden = NOT hidden
        WHERE id = ${id}
        RETURNING id
    ;`;

	return NextResponse.json(entries.id);
}
