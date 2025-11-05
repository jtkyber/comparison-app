import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
	const {
		comparisonID,
		entryID,
		newEntryPos,
	}: {
		comparisonID: number;
		entryID: number;
		newEntryPos: number;
	} = await req.json();

	const entries = (await sql`
        SELECT id, pos FROM entries
        WHERE comparison_id = ${comparisonID}
    ;`) as { id: number; pos: number }[];

	entries.sort((a, b) => a.pos - b.pos);
	const movedIndex = entries.findIndex(a => a.id === entryID);
	const movedEntry = entries.splice(movedIndex, 1)[0];
	entries.splice(newEntryPos, 0, movedEntry);

	for (let i = 0; i < entries.length; i++) entries[i].pos = i;

	const entryIdArray: number[] = entries.map(e => e.id);

	const updatedEntries = await sql`
	    WITH pairs AS (
	        SELECT id, pos
	        FROM UNNEST(${entryIdArray}::int[]) WITH ORDINALITY AS t(id, pos)
	    )
	    UPDATE entries
	    SET pos = pairs.pos
	    FROM pairs
	    WHERE entries.id = pairs.id
	    RETURNING *
	;`;

	return NextResponse.json(updatedEntries);
}
