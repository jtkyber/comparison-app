import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
	const { id } = await req.json();

	const data = await sql.transaction([
		sql`DELETE FROM comparisons WHERE id = ${id}`,
		sql`DELETE FROM attributes WHERE comparison_id = ${id}`,
		sql`DELETE FROM entries WHERE comparison_id = ${id}`,
		sql`DELETE FROM keyratingpairs WHERE comparison_id = ${id}`,
		sql`DELETE FROM cells WHERE comparison_id = ${id}`,
		sql`DELETE FROM cells WHERE comparison_id = ${id}`,
		sql`SELECT * FROM comparisons FETCH FIRST 1 ROW ONLY`,
	]);

	return NextResponse.json(data[6][0]);
}
