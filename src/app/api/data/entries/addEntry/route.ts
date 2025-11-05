import { sql } from '@/src/lib/db';
import { DBAttribute, DBCell, DBEntry } from '@/src/types/db.types';
import { IEntry } from '@/src/types/entries.types';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { comparisonID, entry }: { comparisonID: number; entry: IEntry } = await req.json();
	const { name, hidden, cells } = entry;

	const attributes = (await sql`
		SELECT id, type FROM attributes
		WHERE comparison_id = ${comparisonID}
	;`) as DBAttribute[];

	const attrIDs = attributes.map(a => a.id);
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

	let [entryDB] = (await sql`
	    INSERT INTO entries (name, hidden, comparison_id, pos)
	    VALUES (${name}, ${hidden}, ${comparisonID}, (SELECT COALESCE(MAX(pos), 0) + 1 FROM entries WHERE comparison_id = ${comparisonID}))
		RETURNING *
	;`) as DBEntry[];

	if (typeof entryDB.id !== 'number') {
		throw new Error('Unable to add new entry');
	}

	let cellsDB = (await sql`
		INSERT INTO cells (entry_id, attribute_id, comparison_id, value, rating)
		SELECT ${entryDB.id}, a, ${comparisonID}, v, r
		FROM unnest(${attrIDs}::int[], ${values}::varchar(36)[], ${ratings}::numeric[]) AS t(a, v, r)
		RETURNING *
	;`) as DBCell[];

	console.log(cellsDB);

	return NextResponse.json(entryDB);
}
