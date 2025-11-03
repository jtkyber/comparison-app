import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
	const { userID, comparisonID } = await req.json();

	const [settings] = await sql`
        UPDATE settings
        SET selected_comparison = ${comparisonID}
        WHERE userid = ${userID}
        RETURNING id
    ;`;

	return NextResponse.json(settings.id);
}
