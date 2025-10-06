import { sql } from '@/src/lib/db';
import { IEntry } from '@/src/types/entries';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { attributeIDs, entryIDs } = await req.json();

	const [data] = await sql`
		SELECT json_build_object(
			'attributes', (
				SELECT json_agg(row_to_json(t))
				FROM (
					SELECT * FROM attributes
					WHERE id IN (${attributeIDs.toString()})
				) t
			),
			'entries', (
				SELECT json_agg(row_to_json(t))
				FROM (
					SELECT * FROM entries
					WHERE id IN (${entryIDs.toString()})
				) t
			)
		) AS data
	`;

	const table = data.data;

	const entries: IEntry[] = [];
	for (let i = 0; i < table.entries.length; i++) {
		const entryFromDB = table.entries[i];
		const entryTemp: IEntry = {
			name: entryFromDB.name,
			values: {},
		};

		for (let j = 0; j < entryFromDB.values; j++) {
			const attrID: number = entryFromDB.attributeids[j];
			const value: number = entryFromDB.values[j];

			entryTemp.values[attrID] = value;
		}

		entries.push(entryTemp);
	}

	return NextResponse.json({
		attributes: table.attributes,
		entries: entries,
	});
}
