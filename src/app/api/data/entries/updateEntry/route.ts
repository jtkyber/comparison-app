import { sql } from '@/src/lib/db';
import { IEntry } from '@/src/types/entries.types';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
	const { comparisonID, entry }: { comparisonID: number; entry: IEntry } = await req.json();
	const { id, name, hidden, cells } = entry;

	const attributes = await sql`
		SELECT id, type FROM attributes
		WHERE comparisonid = ${comparisonID}
	;`;

	const attributeIDs = attributes.map(a => a.id);

	const values: Partial<string | null>[] = [];
	const ratings: Partial<number | null>[] = [];

	for (const attr of attributes) {
		if (attr.type === 'yesNo') {
			values.push(cells?.[attr.id]?.value?.toString() || 'true');
		} else {
			values.push(cells?.[attr.id]?.value?.toString() || null);
		}
		ratings.push(cells?.[attr.id]?.rating || null);
	}

	const [entries] = await sql`
        UPDATE entries
        SET name = ${name},
            attributeids = ${attributeIDs},
            values = ${values},
            ratings = ${ratings},
			hidden = ${hidden}
        WHERE id = ${id}
        RETURNING *
    ;`;

	return NextResponse.json(entries);
}
