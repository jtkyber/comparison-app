import { sql } from '@/src/lib/db';
import { IEntry } from '@/src/types/entries.types';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { comparisonID, entry }: { comparisonID: number; entry: IEntry } = await req.json();
	const { name, hidden, cells } = entry;

	const attributes = await sql`
		SELECT id, type FROM attributes
		WHERE comparisonid = ${comparisonID}
	;`;

	const attributeIDs = attributes.map(a => a.id);
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
	    INSERT INTO entries (name, attributeids, values, ratings, hidden, comparisonid, pos)
	    VALUES (${name}, ${attributeIDs}, ${values}, ${ratings}, ${hidden}, ${comparisonID}, (SELECT COALESCE(MAX(pos), 0) + 1 FROM entries WHERE comparisonid = ${comparisonID}))
		RETURNING *
		;`;

	if (typeof data.id !== 'number') {
		throw new Error('Unable to add new entry');
	}

	return NextResponse.json(data);
}
