import { sql } from '@/src/lib/db';
import { IEntry } from '@/src/types/entries.types';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
	const { comparisonID, entry }: { comparisonID: number; entry: IEntry } = await req.json();
	const { id, name, hidden, cells } = entry;

	const [comparisonData] = await sql`
        SELECT * FROM comparisons
        WHERE id = ${comparisonID}
    ;`;

	const attributeIDs: number[] = comparisonData.attributes;

	const attributes = await sql`
        SELECT t.*
        FROM unnest(${attributeIDs}::int[]) WITH ORDINALITY AS u(id, ord)
        JOIN attributes t ON t.id = u.id
        ORDER BY u.ord
    ;`;

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
        RETURNING id
    ;`;

	return NextResponse.json(entries);
}
