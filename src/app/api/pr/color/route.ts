import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { name, value } = body;

        const color = await db.color.create({
            data: {
                name,
                value,
            },
        });

        if (!color) {
            return NextResponse.json({ message: 'Error' }, { status: 400 });
        }

        return NextResponse.json({ color }, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};

export const GET = async () => {
    try {
        const colors = await db.color.findMany();

        if (colors.length === 0) {
            return NextResponse.json({ message: 'Không tìm thấy màu' }, { status: 200 });
        }

        return NextResponse.json(colors, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};
