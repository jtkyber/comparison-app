import { sql } from '@/src/lib/db';
import { IAttribute } from '@/src/types/attributes.types';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
	const { id, hidden, name, prefix, suffix, type, range, bestIndex, textRatingType, importance }: IAttribute =
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
            selfrated = LOWER(${textRatingType}),
            importance = ${importance}
        WHERE id = ${id}
        RETURNING id
    ;`;

	return NextResponse.json(attributes.id);
}
