import { sql } from '@/src/lib/db';
import { IAttribute, IKeyRatingPair, isAttribute } from '@/src/types/attributes.types';
import { IComparison } from '@/src/types/comparisons.types';
import { DBAttribute, DBCell, DBComparison, DBEntry, DBKeyRatingPair } from '@/src/types/db.types';
import { ICellValue, IEntry } from '@/src/types/entries.types';
import { underscoreToCamelObject } from '@/src/utils/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { comparisonID } = await req.json();

	const query = `
	SELECT
		(SELECT row_to_json(c) FROM comparisons c WHERE c.id = $1) AS comparison,

		COALESCE((SELECT json_agg(a ORDER BY a.pos) FROM attributes a WHERE a.comparison_id = $1), '[]'::json) AS attributes,
		COALESCE((SELECT json_agg(e ORDER BY e.pos) FROM entries e WHERE e.comparison_id = $1), '[]'::json) AS entries,
		COALESCE((SELECT json_agg(c ORDER BY c.id) FROM cells c WHERE c.comparison_id = $1), '[]'::json) AS cells,
		COALESCE((SELECT json_agg(k ORDER BY k.id) FROM keyratingpairs k WHERE k.comparison_id = $1), '[]'::json) AS keyratingpairs
	;`;

	const [data] = await sql.query(query, [comparisonID]);

	const comparisonDB: DBComparison = data.comparison;
	const attributesDB: DBAttribute[] = data.attributes;
	const entriesDB: DBEntry[] = data.entries;
	const cellsDB: DBCell[] = data.cells;
	const keyRatingPairsArrayDB: DBKeyRatingPair[] = data.keyratingpairs;

	if (attributesDB.length && !isAttribute(attributesDB[0])) {
		throw new Error('Could not retrieve attributes');
	}

	const attributesCamel = attributesDB.map(a => underscoreToCamelObject(a)) as any[];
	attributesCamel.sort((a, b) => a.pos - b.pos);

	const attributes: IAttribute[] = attributesCamel.map((a: IAttribute) => ({
		...a,
		importance: parseFloat(a.importance as any),
	}));

	for (const attr of attributes) {
		const keyRatingPairs: IKeyRatingPair[] = [];
		const pairs = keyRatingPairsArrayDB.filter(pair => pair.attribute_id === attr.id);

		for (let i = 0; i < pairs.length; i++) {
			const { id, key, rating } = pairs[i];
			keyRatingPairs[i] = {
				id,
				key,
				rating: rating,
			};
		}

		attr.keyRatingPairs = keyRatingPairs;
	}

	const cellsByEntry: {
		[key: number]: {
			[key: number]: ICellValue;
		};
	} = {};

	for (let i = 0; i < cellsDB.length; i++) {
		const { value, rating, entry_id, attribute_id }: DBCell = cellsDB[i];
		cellsByEntry[entry_id] = {
			...cellsByEntry[entry_id],
			[attribute_id]: {
				value: value === 'true' ? true : value === 'false' ? false : value,
				rating: rating,
			},
		};
	}

	const entries: IEntry[] = [];
	for (let i = 0; i < entriesDB?.length; i++) {
		const entryFromDB = entriesDB[i];
		const entryTemp: IEntry = {
			id: entryFromDB.id,
			pos: entryFromDB.pos,
			name: entryFromDB.name,
			hidden: entryFromDB.hidden,
			cells: cellsByEntry[entryFromDB.id],
		};

		entries.push(entryTemp);
	}

	// Cell value string to float conversion (delete possibly)
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
		id: comparisonDB.id,
		name: comparisonDB.name,
		attributes: attributes || [],
		entries: entries,
	};

	return NextResponse.json(returnData);
}
