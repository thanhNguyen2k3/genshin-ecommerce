import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { name } = body;

        const region = await db.region.create({
            data: {
                name,
            },
        });

        return NextResponse.json(region, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};

export const GET = async () => {
    try {
        const region = await db.region.findMany();

        if (region.length === 0) return NextResponse.json({ message: 'Không tìm thấy vùng nào' }, { status: 200 });

        return NextResponse.json(region, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};
