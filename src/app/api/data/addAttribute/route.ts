import { sql } from '@/src/lib/db';
import { IAttribute } from '@/src/types/attributes.types';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { comparisonID, attribute }: { comparisonID: number; attribute: IAttribute } = await req.json();
	const { name, prefix, suffix, type, range, bestIndex, selfRated, importance } = attribute;

	let [data] = await sql`
	    INSERT INTO attributes (name, type, importance, range, bestindex, selfrated, prefix, suffix)
	    VALUES (${name}, ${type}, ${importance}, ${range}, ${bestIndex}, ${selfRated}, ${prefix}, ${suffix})
	    RETURNING id
	    ;`;

	if (typeof data.id !== 'number') {
		throw new Error('Unable to add new attribute');
	}

	const newAttributeID: number = data.id;

	const [comparisonData] = await sql`
		SELECT * FROM comparisons
		WHERE id = ${comparisonID}
    ;`;

	const entryIDs: number[] = comparisonData.entries;

	const query = `
        WITH upd_entries AS (
            UPDATE entries
            SET 
                attributeids = array_append(coalesce(attributeids, ARRAY[]::integer[]), $1::integer),
                "values" = array_append(coalesce("values", ARRAY[]::varchar(36)[]), $2::varchar(36))
            WHERE id = ANY($3::int[])
            RETURNING id
        ), upd_comparisons AS (
            UPDATE comparisons
            SET attributes = array_append(coalesce(attributes, ARRAY[]::integer[]), $1::integer)
            WHERE id = $4::int
            RETURNING id
        )
        SELECT
            (SELECT count(*) FROM upd_entries) AS entries_updated,
            (SELECT count(*) FROM upd_comparisons) AS comparisons_updated;
    `;

	const comparisons = await sql.query(query, [newAttributeID, '', entryIDs, comparisonID]);

	if (!comparisons) {
		throw new Error('Unable to add attribute to entries and comparison');
	}

	return NextResponse.json(comparisons);
}
