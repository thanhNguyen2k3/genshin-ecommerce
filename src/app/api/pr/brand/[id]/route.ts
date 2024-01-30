import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
    params: {
        id: string;
    };
};

export const GET = async (_req: NextRequest, { params: { id } }: Params) => {
    try {
        const brand = await db.brand.findFirst({
            where: {
                id,
            },
        });

        if (!brand) {
            return NextResponse.json({ message: 'Không tìm thây thương hiệu này' }, { status: 201 });
        }

        return NextResponse.json(brand, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify(error.message), { status: 400 });
    }
};

export const PATCH = async (req: NextRequest, { params: { id } }: Params) => {
    try {
        const body = await req.json();
        const { name } = body;

        const brand = await db.brand.update({
            where: {
                id,
            },
            data: {
                name,
            },
        });

        return NextResponse.json(brand, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify(error.message), { status: 400 });
    }
};
