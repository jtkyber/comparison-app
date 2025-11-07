import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
	const { userID, fitColMin } = await req.json();

	const [settings] = await sql`
        UPDATE settings
        SET fit_col_min = ${fitColMin}
        WHERE user_id = ${userID}
        RETURNING id
    ;`;

	return NextResponse.json(settings.id);
}
