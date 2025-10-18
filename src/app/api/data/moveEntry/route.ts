import { sql } from '@/src/lib/db';
import { moveArrayItem } from '@/src/utils/arrays';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
	const { comparisonID, EntryID, newEntryPos } = await req.json();

	const [comparison] = await sql`
        SELECT * FROM comparisons
        WHERE id = ${comparisonID}
    ;`;

	const entries: number[] = comparison.entries;
	const oldIndex: number = entries.indexOf(EntryID);
	const newEntries: number[] = moveArrayItem(entries, newEntryPos, oldIndex);

	const [updatedEntries] = await sql`
        UPDATE comparisons
        SET entries = ${newEntries}
        WHERE id = ${comparisonID}
        RETURNING id
    ;`;

	return NextResponse.json(updatedEntries);
}
