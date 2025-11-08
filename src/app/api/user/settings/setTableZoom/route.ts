import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
	const { userID, tableZoom } = await req.json();

	const [settings] = await sql`
        UPDATE settings
        SET table_zoom = ${tableZoom}
        WHERE user_id = ${userID}
        RETURNING id
    ;`;

	return NextResponse.json(settings.id);
}
