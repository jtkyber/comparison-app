import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: any }) {
	const { id } = await params;

	const [user] = await sql`
		SELECT * FROM users
		WHERE id = ${id}
	;`;

	return NextResponse.json(user);
}
