import { sql } from '@/src/lib/db';
import { IAttribute } from '@/src/types/attributes.types';
import { DBAttribute } from '@/src/types/db.types';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { comparisonID, attribute }: { comparisonID: number; attribute: IAttribute } = await req.json();
	const { name, hidden, prefix, suffix, type, range, bestIndex, textRatingType, keyRatingPairs, importance } =
		attribute;

	let [attributeIDObj] = await sql`
	    INSERT INTO attributes (name, type, importance, range, best_index, text_rating_type, prefix, suffix, hidden, comparison_id, pos)
	    VALUES (${name}, ${type}, ${importance}, ${range}, ${bestIndex}, LOWER(${textRatingType})::text_rating_type, ${prefix}, ${suffix}, ${hidden}, ${comparisonID}, (SELECT COALESCE(MAX(pos), 0) + 1 FROM attributes WHERE comparison_id = ${comparisonID}))
		RETURNING id
	;`;

	if (typeof attributeIDObj.id !== 'number') {
		throw new Error('Unable to add new attribute');
	}

	const newAttributeID: number = attributeIDObj.id;

	const pairKeys = keyRatingPairs.map(p => p.key);
	const pairRatings = keyRatingPairs.map(p => p.rating);

	await sql`
		INSERT INTO keyratingpairs (key, rating, attribute_id, comparison_id)
		SELECT 
			t.key,
			t.rating,
			${newAttributeID}::int,
			${comparisonID}::int
		FROM UNNEST(${pairKeys}::text[], ${pairRatings}::numeric[]) AS t(key, rating)
		RETURNING *
	;`;

	const cells = await sql`
		INSERT INTO cells (entry_id, attribute_id, comparison_id)
		SELECT e.id, ${newAttributeID}, ${comparisonID}
		FROM entries e
		WHERE e.comparison_id = ${comparisonID}
		RETURNING *
	;`;

	return NextResponse.json(cells);
}
