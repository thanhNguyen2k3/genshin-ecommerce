import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        const { name } = body;

        const brand = await db.brand.create({
            data: {
                name,
            },
        });

        return NextResponse.json(brand, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify(error.message), { status: 400 });
    }
};

export const GET = async () => {
    try {
        const brands = await db.brand.findMany();
        if (brands.length === 0) {
            return NextResponse.json({ message: 'Không tìm thấy thương hiệu nào' });
        }

        return NextResponse.json(brands, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify(error.message), { status: 400 });
    }
};
