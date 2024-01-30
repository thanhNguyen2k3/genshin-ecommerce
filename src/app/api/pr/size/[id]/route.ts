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

        const existSize = await db.size.findFirst({
            where: {
                id,
            },
        });

        if (!existSize) {
            return NextResponse.json({ message: 'Không tìm thấy màu' }, { status: 400 });
        }

        const newSize = await db.size.update({
            where: {
                id,
            },
            data: {
                name,
                value,
            },
        });

        return NextResponse.json(newSize, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};

export const DELETE = async ({ params: { id } }: Params) => {
    try {
        const existSize = await db.size.findFirst({
            where: {
                id,
            },
        });

        if (!existSize) {
            return NextResponse.json({ message: 'Không tìm thấy màu' }, { status: 400 });
        }

        await db.size.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({ message: 'Xóa thành công' }, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};
