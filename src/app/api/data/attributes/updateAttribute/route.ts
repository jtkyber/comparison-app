import { sql } from '@/src/lib/db';
import { IAttribute } from '@/src/types/attributes.types';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
	const { comparisonID, attribute } = await req.json();
	const {
		id,
		hidden,
		name,
		prefix,
		suffix,
		type,
		range,
		bestIndex,
		textRatingType,
		keyRatingPairs,
		importance,
	}: IAttribute = attribute;

	const existingPairs = await sql`
		SELECT id FROM keyratingpairs
		WHERE attribute_id = ${id}
	;`;
	const existingPairIDs = existingPairs.map(pair => pair.id);

	const pairsToKeep = keyRatingPairs.filter(pair => pair.id > 0);
	const pairIDsToKeep = pairsToKeep.map(pair => pair.id);
	const deletedPairIDs = existingPairIDs.filter(id => !pairIDsToKeep.includes(id));

	const pairIDs = keyRatingPairs.map(p => (p.id > 0 ? p.id : null));
	const pairKeys = keyRatingPairs.map(p => p.key);
	const pairRatings = keyRatingPairs.map(p => p.rating);

	const attributes = await sql`
        WITH upd_attributes AS (
            UPDATE attributes
            SET name = ${name},
                hidden = ${hidden},
                prefix = ${prefix},
                suffix = ${suffix},
                type = ${type},
                range = ${range},
                best_index = ${bestIndex},
                text_rating_type = LOWER(${textRatingType})::text_rating_type,
                importance = ${importance}
            WHERE id = ${id}
            RETURNING id
        ), upd_keyratingpairs AS (
			INSERT INTO keyratingpairs (id, key, rating, attribute_id, comparison_id)
			SELECT 
				COALESCE(t.id, nextval(pg_get_serial_sequence('keyratingpairs', 'id'))),
				t.key,
				t.rating,
				${id}::int,
				${comparisonID}::int
			FROM UNNEST(${pairIDs}::int[], ${pairKeys}::text[], ${pairRatings}::numeric[]) AS t(id, key, rating)
			ON CONFLICT(id) DO UPDATE 
			SET
				key = EXCLUDED.key,
				rating = EXCLUDED.rating
			RETURNING *
		), del_keyratingpairs AS (
			DELETE FROM keyratingpairs
			WHERE id = ANY(COALESCE(${deletedPairIDs}::int[], '{}'))
			RETURNING *
		)
        SELECT
            (SELECT count(*) FROM upd_attributes) AS attributes_updated,
            (SELECT count(*) FROM upd_keyratingpairs) AS keyratingpairs_updated,
            (SELECT count(*) FROM del_keyratingpairs) AS keyratingpairs_deleted
    ;`;

	return NextResponse.json(attributes);
}
