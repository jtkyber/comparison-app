import { sql } from '@/src/lib/db';
import { moveArrayItem } from '@/src/utils/arrays';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
	const { comparisonID, attributeID, newAttrPos } = await req.json();

	const [comparison] = await sql`
        SELECT * FROM comparisons
        WHERE id = ${comparisonID}
    ;`;

	const attributes: number[] = comparison.attributes;
	const oldIndex: number = attributes.indexOf(attributeID);
	const newAttributes: number[] = moveArrayItem(attributes, newAttrPos, oldIndex);

	const [updatedAttributes] = await sql`
        UPDATE comparisons
        SET attributes = ${newAttributes}
        WHERE id = ${comparisonID}
        RETURNING id
    ;`;

	return NextResponse.json(updatedAttributes);
}
