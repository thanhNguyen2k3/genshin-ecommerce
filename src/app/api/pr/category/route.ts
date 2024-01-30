import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async () => {
    try {
        const categories = await db.category.findMany();

        if (categories.length === 0) return NextResponse.json({ message: 'Không có danh mục nào' }, { status: 200 });

        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify((error as any).message), { status: 400 });
    }
};

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    try {
        const { name, thumbnail } = body;

        const newCategory = await db.category.create({
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
