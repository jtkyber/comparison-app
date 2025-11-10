import { sql } from '@/src/lib/db';
import { IEntry } from '@/src/types/entries.types';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
	const { comparisonID, entry }: { comparisonID: number; entry: IEntry } = await req.json();
	const { id, name, hidden, cells } = entry;

	const attributes = await sql`
		SELECT id, type FROM attributes
		WHERE comparison_id = ${comparisonID}
	;`;

	const attrIDs = attributes.map(a => a.id);

	const values: Partial<string | null>[] = [];
	const ratings: Partial<number | null>[] = [];

	for (const attr of attributes) {
		if (attr.type === 'yesNo') {
			values.push(cells?.[attr.id]?.value?.toString() || 'true');
		} else {
			values.push(cells?.[attr.id]?.value?.toString() || null);
		}
		ratings.push(cells?.[attr.id]?.rating ?? null);
	}

	const query = `
	WITH upd_entry AS (
		UPDATE entries
		SET name = $3,
			hidden = $4
		WHERE id = $1
		RETURNING id
	), u AS (
		SELECT a, v, r
		FROM unnest($2::int[], $5::text[], $6::numeric[]) AS t(a, v, r)
	), upd_cells AS (
		UPDATE cells
		SET value  = u.v,
			rating = u.r
		FROM u
		WHERE cells.attribute_id = u.a AND cells.entry_id = $1  
		RETURNING cells.id
	)
	SELECT
		(SELECT count(*) FROM upd_entry) AS entries_updated,
		(SELECT count(*) FROM upd_cells)  AS cells_updated;
    `;

	const entries = await sql.query(query, [id, attrIDs, name, hidden, values, ratings]);

	return NextResponse.json(entries);
}
