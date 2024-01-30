import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { name } = body;

        const vision = await db.vision.create({
            data: {
                name,
            },
        });

        return NextResponse.json(vision, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};

export const GET = async () => {
    try {
        const visons = await db.vision.findMany();

        if (visons.length === 0) return NextResponse.json({ message: 'Không tìm thấy vision nào' }, { status: 200 });

        return NextResponse.json(visons, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};
