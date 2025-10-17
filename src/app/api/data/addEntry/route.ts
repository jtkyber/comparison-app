import { sql } from '@/src/lib/db';
import { IEntry } from '@/src/types/entries.types';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { comparisonID, entry }: { comparisonID: number; entry: IEntry } = await req.json();
	const { name, cells } = entry;

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

	let values: Partial<string | null>[] = [];
	let ratings: Partial<number | null>[] = [];

	for (const attr of attributes) {
		if (attr.type === 'yesNo') {
			values.push(cells?.[attr.id]?.value?.toString() || 'true');
		} else {
			values.push(cells?.[attr.id]?.value?.toString() || null);
		}
		ratings.push(cells?.[attr.id]?.rating || null);
	}

	let [data] = await sql`
	    INSERT INTO entries (name, attributeids, values, ratings)
	    VALUES (${name}, ${attributeIDs}, ${values}, ${ratings})
	    RETURNING id
	;`;

	if (typeof data.id !== 'number') {
		throw new Error('Unable to add new entry');
	}

	const newEntryID: number = data.id;

	let comparisons = await sql`
	    UPDATE comparisons
	    SET entries = array_append(coalesce(entries, ARRAY[]::integer[]), ${newEntryID}::integer)
	    WHERE id = ${comparisonID}::int
	    RETURNING id
	;`;

	return NextResponse.json(comparisons);
}
