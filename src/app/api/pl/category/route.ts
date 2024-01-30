import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async () => {
    try {
        const categories = await db.category.findMany({
            include: {
                products: true,
            },
        });

        if (categories.length === 0) return NextResponse.json({ message: 'Không có danh mục nào' }, { status: 200 });

        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify((error as any).message), { status: 400 });
    }
};
