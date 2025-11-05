import { sql } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
	const {
		comparisonID,
		attributeID,
		newAttrPos,
	}: {
		comparisonID: number;
		attributeID: number;
		newAttrPos: number;
	} = await req.json();

	const attributes = (await sql`
        SELECT id, pos FROM attributes
        WHERE comparison_id = ${comparisonID}
    ;`) as { id: number; pos: number }[];

	attributes.sort((a, b) => a.pos - b.pos);
	const movedIndex = attributes.findIndex(a => a.id === attributeID);
	const movedAttribute = attributes.splice(movedIndex, 1)[0];
	attributes.splice(newAttrPos, 0, movedAttribute);

	for (let i = 0; i < attributes.length; i++) attributes[i].pos = i;

	const attrIdArray: number[] = attributes.map(a => a.id);

	const updatedAttributes = await sql`
	    WITH pairs AS (
	        SELECT id, pos
	        FROM UNNEST(${attrIdArray}::int[]) WITH ORDINALITY AS t(id, pos)
	    )
	    UPDATE attributes
	    SET pos = pairs.pos
	    FROM pairs
	    WHERE attributes.id = pairs.id
	    RETURNING *
	;`;

	return NextResponse.json(updatedAttributes);
}
