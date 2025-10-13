import { sql } from '@/src/lib/db';
import { IComparison } from '@/src/types/comparisons.types';
import { IEntry } from '@/src/types/entries.types';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { comparisonID } = await req.json();

	const [comparisonData] = await sql`
		SELECT * FROM comparisons
		WHERE id = ${comparisonID}
    ;`;

	const attributeIDs: number[] = comparisonData.attributes;
	const entryIDs: number[] = comparisonData.entries;

	const query = `
		SELECT json_build_object(
			'attributes', (
				SELECT json_agg(row_to_json(t))
				FROM (
					SELECT * FROM attributes
					WHERE id = ANY($1)
				) t
			),
			'entries', (
				SELECT json_agg(row_to_json(t))
				FROM (
					SELECT * FROM entries
					WHERE id = ANY($2)
				) t
			)
		) AS data
	`;

	const data = await sql.query(query, [attributeIDs, entryIDs]);

	const table = data[0].data;

	const entries: IEntry[] = [];
	for (let i = 0; i < table.entries?.length; i++) {
		const entryFromDB = table.entries[i];
		const entryTemp: IEntry = {
			id: entryFromDB.id,
			name: entryFromDB.name,
			values: {},
		};

		for (let j = 0; j < entryFromDB.values?.length; j++) {
			const attrID: number = entryFromDB.attributeids[j];
			const value: number = entryFromDB.values[j];

			entryTemp.values[attrID] = value;
		}

		entries.push(entryTemp);
	}

	const returnData: IComparison = {
		id: comparisonData.id,
		name: comparisonData.name,
		attributes: table.attributes || [],
		entries: entries,
	};

	return NextResponse.json(returnData);
}
