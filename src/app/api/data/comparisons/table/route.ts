import { sql } from '@/src/lib/db';
import { IAttribute, IKeyRatingPair, isAttribute } from '@/src/types/attributes.types';
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

	const rawAttributes = await sql`
		SELECT * FROM attributes
		WHERE comparisonid = ${comparisonID}
	;`;

	const keyRatingPairsArray = await sql`
		SELECT * FROM keyratingpairs
		WHERE comparisonid = ${comparisonID}
	;`;

	if (rawAttributes.length && !isAttribute(rawAttributes[0])) {
		throw new Error('Could not retrieve attributes');
	}

	const attributesCamel = rawAttributes.map(attr => toCamelAttribute(attr)) as any[];
	attributesCamel.sort((a, b) => a.pos - b.pos);

	const attributes: IAttribute[] = attributesCamel.map((a: IAttribute) => ({
		...a,
		importance: parseFloat(a.importance as any),
	}));

	for (const attr of attributes) {
		const keyRatingPairs: IKeyRatingPair[] = [];
		const pairs = keyRatingPairsArray.filter(pair => pair.attributeid === attr.id);

		for (let i = 0; i < pairs.length; i++) {
			const { id, key, rating } = pairs[i];
			keyRatingPairs[i] = {
				id,
				key,
				rating: parseFloat(rating),
			};
		}

		attr.keyRatingPairs = keyRatingPairs;
	}

	const entries = await sql`
		SELECT * FROM entries
		WHERE comparisonid = ${comparisonID}
	;`;

	const structuredEntries: IEntry[] = [];
	for (let i = 0; i < entries?.length; i++) {
		const entryFromDB = entries[i];
		const entryTemp: IEntry = {
			id: entryFromDB.id,
			pos: entryFromDB.pos,
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

		structuredEntries.push(entryTemp);
	}

	for (const entry of structuredEntries) {
		for (const attr of attributes) {
			const key = attr.id;
			const value = entry.cells[key].value;
			const attributeType = attr.type;

			if (attributeType === 'number' && typeof value === 'string') {
				entry.cells[key].value = parseFloat(value) || 0;
			}
		}
	}

	structuredEntries.sort((a, b) => a.pos - b.pos);

	const returnData: IComparison = {
		id: comparisonData.id,
		name: comparisonData.name,
		attributes: attributes || [],
		entries: structuredEntries,
	};

	return NextResponse.json(returnData);
}
