import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
	const { id, hidden, name, prefix, suffix, type, range, bestIndex, selfRated, importance } =
		await req.json();

	const [attributes] = await sql`
        UPDATE attributes
        SET name = ${name},
            hidden = ${hidden},
            prefix = ${prefix},
            suffix = ${suffix},
            type = ${type},
            range = ${range},
            bestindex = ${bestIndex},
            selfrated = ${selfRated},
            importance = ${importance}
        WHERE id = ${id}
        RETURNING id
    ;`;

	return NextResponse.json(attributes.id);
}
