import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
	const { comparisonID, entryIDs }: { comparisonID: number; entryIDs: number[] } = await req.json();

	if (typeof comparisonID !== 'number' || !Array.isArray(entryIDs)) {
		throw new Error('Invalid body data');
	}

	const query = `
        WITH upd_comparisons AS (
            UPDATE comparisons
            SET entries = COALESCE(
                (
                    SELECT array_agg(elem)
                    FROM unnest(COALESCE(entries, ARRAY[]::integer[])) AS elem
                    WHERE elem <> ALL ($1::int[])
                ),
                ARRAY[]::integer[]
            )
            WHERE id = $2::int
            RETURNING id
        ), del_entry AS (
            DELETE FROM entries
            WHERE id = ANY($1::int[])
            RETURNING id
        )
        SELECT
            (SELECT count(*) FROM upd_comparisons) AS comparisons_updated,
            (SELECT count(*) FROM del_entry) AS entries_deleted
    ;`;

	const comparisons = await sql.query(query, [entryIDs, comparisonID]);

	return NextResponse.json(comparisons);
}
