import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
    params: {
        id: string;
    };
};

export const GET = async (_req: NextRequest, { params: { id } }: Params) => {
    try {
        if (!id) return NextResponse.json({ message: 'Không có danh mục này' });

        const existingCategory = await db.category.findUnique({
            where: {
                id,
            },
        });

        return NextResponse.json(existingCategory, { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify((error as any).message), { status: 400 });
    }
};

export const PATCH = async (req: NextRequest, { params: { id } }: Params) => {
    const body = await req.json();

    if (!id) return new NextResponse(JSON.stringify({ message: 'Không tìm thấy danh mục này' }), { status: 400 });

    try {
        const { name, thumbnail } = body;

        const newCategory = await db.category.update({
            where: {
                id,
            },
            data: {
                name,
                thumbnail,
            },
        });

        return NextResponse.json(newCategory, { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify((error as any).message), { status: 400 });
    }
};

export const DELETE = async (_req: NextRequest, { params: { id } }: Params) => {
    try {
        await db.category.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({ message: 'Xóa danh mục thành công' }, { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify((error as any).message), { status: 400 });
    }
};
