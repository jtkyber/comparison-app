import { sql } from '@/src/lib/db';
import { IAttribute } from '@/src/types/attributes.types';
import { IComparison } from '@/src/types/comparisons.types';
import { IEntry } from '@/src/types/entries.types';
import { toCamelAttribute } from '@/src/utils/server';
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
				SELECT json_agg(row_to_json(t) ORDER BY t.pos)
				FROM (
				SELECT a.*, array_position($1::int[], a.id) AS pos
				FROM attributes a
				WHERE a.id = ANY($1)
				) t
			),
			'entries', (
				SELECT json_agg(row_to_json(t) ORDER BY t.pos)
				FROM (
				SELECT e.*, array_position($2::int[], e.id) AS pos
				FROM entries e
				WHERE e.id = ANY($2)
				) t
			)
		) AS data;
	`;

	const data = await sql.query(query, [attributeIDs, entryIDs]);

	const table = data[0].data;

	const entries: IEntry[] = [];
	for (let i = 0; i < table.entries?.length; i++) {
		const entryFromDB = table.entries[i];
		const entryTemp: IEntry = {
			id: entryFromDB.id,
			name: entryFromDB.name,
			cells: {},
		};

		for (let j = 0; j < entryFromDB.values?.length; j++) {
			const attrID: number = entryFromDB.attributeids[j];
			const value: string = entryFromDB.values[j];
			const rating: number = entryFromDB.ratings[j];

			entryTemp.cells[attrID] = {
				value: value === 'true' ? true : value === 'false' ? false : value,
				rating: rating,
			};
		}

		entries.push(entryTemp);
	}

	const attributes = table?.attributes.map((attr: IAttribute) => toCamelAttribute(attr));

	const returnData: IComparison = {
		id: comparisonData.id,
		name: comparisonData.name,
		attributes: attributes || [],
		entries: entries,
	};

	return NextResponse.json(returnData);
}
