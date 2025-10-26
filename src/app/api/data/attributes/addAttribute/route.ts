import { sql } from '@/src/lib/db';
import { IAttribute } from '@/src/types/attributes.types';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { comparisonID, attribute }: { comparisonID: number; attribute: IAttribute } = await req.json();
	const { name, hidden, prefix, suffix, type, range, bestIndex, textRatingType, keyRatingPairs, importance } =
		attribute;

	let [data] = await sql`
	    INSERT INTO attributes (name, type, importance, range, bestindex, textratingtype, prefix, suffix, hidden, comparisonid, pos)
	    VALUES (${name}, ${type}, ${importance}, ${range}, ${bestIndex}, LOWER(${textRatingType})::text_rating_type, ${prefix}, ${suffix}, ${hidden}, ${comparisonID}, (SELECT COALESCE(MAX(pos), 0) + 1 FROM attributes WHERE comparisonid = ${comparisonID}))
		RETURNING id
	;`;

	if (typeof data.id !== 'number') {
		throw new Error('Unable to add new attribute');
	}

	const newAttributeID: number = data.id;

	const pairKeys = keyRatingPairs.map(p => p.key);
	const pairRatings = keyRatingPairs.map(p => p.rating);

	await sql`
		INSERT INTO keyratingpairs (key, rating, attributeid, comparisonid)
		SELECT 
			t.key,
			t.rating,
			${newAttributeID}::int,
			${comparisonID}::int
		FROM UNNEST(${pairKeys}::text[], ${pairRatings}::numeric[]) AS t(key, rating)
		RETURNING *
	;`;

	const entries = await sql`
		UPDATE entries
		SET
			attributeids = array_append(coalesce(attributeids, ARRAY[]::integer[]), ${newAttributeID}::integer),
			"values" = array_append(coalesce("values", ARRAY[]::varchar(36)[]), ''::varchar(36))
		WHERE comparisonid = ${comparisonID}
		RETURNING id
		;`;

	if (!entries) {
		throw new Error('Unable to add attribute to entries');
	}

	return NextResponse.json(entries);
}
