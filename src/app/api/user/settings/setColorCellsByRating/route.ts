import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
	const { userID, colorCellsByRating } = await req.json();

	const [settings] = await sql`
        UPDATE settings
        SET color_cells_by_rating = ${colorCellsByRating}
        WHERE user_id = ${userID}
        RETURNING id
    ;`;

	return NextResponse.json(settings.id);
}
