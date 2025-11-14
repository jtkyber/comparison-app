import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
	const { userID, width } = await req.json();

	const [settings] = await sql`
        UPDATE settings
        SET manager_width = ${width}
        WHERE user_id = ${userID}
        RETURNING id
    ;`;

	return NextResponse.json(settings.id);
}
