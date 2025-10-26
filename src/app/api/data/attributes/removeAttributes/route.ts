import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
	const { comparisonID, attributeIDs }: { comparisonID: number; attributeIDs: number[] } = await req.json();

	if (typeof comparisonID !== 'number' || !Array.isArray(attributeIDs)) {
		throw new Error('Invalid body data');
	}

	const query = `
        WITH upd_entries AS (
            UPDATE entries
            SET
            attributeids = COALESCE(
                (
                SELECT array_agg(attributeids[i] ORDER BY i)
                FROM generate_subscripts(COALESCE(attributeids, ARRAY[]::integer[]), 1) AS i
                WHERE attributeids[i] <> ALL($1::int[])
                ),
                ARRAY[]::integer[]
            ),
            "values" = COALESCE(
                (
                SELECT array_agg("values"[i] ORDER BY i)
                FROM generate_subscripts(COALESCE(attributeids, ARRAY[]::integer[]), 1) AS i
                WHERE attributeids[i] <> ALL($1::int[])
                ),
                ARRAY[]::varchar(36)[]
            )
            WHERE comparisonid = $2::integer
            RETURNING id
        ), del_keyratingpairs AS (
            DELETE FROM keyratingpairs
            WHERE attributeid = ANY($1::int[])
            RETURNING id
        ), del_attribute AS (
            DELETE FROM attributes
            WHERE id = ANY($1::int[])
            RETURNING id
        )
        SELECT
            (SELECT count(*) FROM upd_entries) AS entries_updated,
            (SELECT count(*) FROM del_keyratingpairs) AS keyratingpairs_deleted,
            (SELECT count(*) FROM del_attribute) AS attributes_deleted
	;`;

	const comparisons = await sql.query(query, [attributeIDs, comparisonID]);

	return NextResponse.json(comparisons);
}
