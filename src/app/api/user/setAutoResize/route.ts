import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
	const { userID, autoResize } = await req.json();

	const [settings] = await sql`
        UPDATE settings
        SET auto_resize = ${autoResize}
        WHERE userid = ${userID}
        RETURNING id
    ;`;

	return NextResponse.json(settings.id);
}
