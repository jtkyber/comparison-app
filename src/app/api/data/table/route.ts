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

	const attributes: IAttribute[] = table?.attributes.map((attr: IAttribute) => toCamelAttribute(attr));

	const entries: IEntry[] = [];
	for (let i = 0; i < table.entries?.length; i++) {
		const entryFromDB = table.entries[i];
		const entryTemp: IEntry = {
			id: entryFromDB.id,
			name: entryFromDB.name,
			hidden: entryFromDB.hidden,
			cells: {},
		};

		for (let j = 0; j < entryFromDB.values?.length; j++) {
			const attrID: number = entryFromDB.attributeids[j];
			let value: string | number = entryFromDB.values[j];
			const rating: number = entryFromDB.ratings[j];

			entryTemp.cells[attrID] = {
				value: value === 'true' ? true : value === 'false' ? false : value,
				rating: rating,
			};
		}

		entries.push(entryTemp);
	}

	for (const entry of entries) {
		for (const attr of attributes) {
			const key = attr.id;
			const value = entry.cells[key].value;
			const attributeType = attr.type;

			if (attributeType === 'number' && typeof value === 'string') {
				entry.cells[key].value = parseFloat(value) || 0;
			}
		}
	}

	const returnData: IComparison = {
		id: comparisonData.id,
		name: comparisonData.name,
		attributes: attributes || [],
		entries: entries,
	};

	return NextResponse.json(returnData);
}
