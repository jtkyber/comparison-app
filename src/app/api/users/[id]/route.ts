import db from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
	const id = params.id;
	return NextResponse.json(id);
}
