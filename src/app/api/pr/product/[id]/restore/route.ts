import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
    params: {
        id: string;
    };
};

export const PATCH = async (req: NextRequest, { params: { id } }: Params) => {
    const body = await req.json();

    try {
        const { deleted } = body;

        const existingProduct = await db.product.findFirst({
            where: {
                id,
            },
        });

        if (!existingProduct) return new NextResponse(JSON.stringify({ message: 'Không tìm thấy sản phẩm' }));

        await db.product.update({
            where: {
                id,
            },
            data: {
                deleted,
            },
        });

        return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify((error as any).message), { status: 400 });
    }
};
