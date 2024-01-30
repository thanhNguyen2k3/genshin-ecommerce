import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
    params: {
        id: string;
    };
};

export const PATCH = async (req: NextRequest, { params: { id } }: Params) => {
    try {
        const body = await req.json();

        const { name, value } = body;

        const existColor = await db.color.findFirst({
            where: {
                id,
            },
        });

        if (!existColor) {
            return NextResponse.json({ message: 'Không tìm thấy màu' }, { status: 400 });
        }

        const newColor = await db.color.update({
            where: {
                id,
            },
            data: {
                name,
                value,
            },
        });

        return NextResponse.json(newColor, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};

export const DELETE = async ({ params: { id } }: Params) => {
    try {
        const existColor = await db.color.findFirst({
            where: {
                id,
            },
        });

        if (!existColor) {
            return NextResponse.json({ message: 'Không tìm thấy màu' }, { status: 400 });
        }

        await db.color.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({ message: 'Xóa thành công' }, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};
