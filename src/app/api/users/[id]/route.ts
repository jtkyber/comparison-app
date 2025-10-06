import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: any }) {
	const { id } = params;

	return NextResponse.json(id);
}
