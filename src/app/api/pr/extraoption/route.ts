import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async () => {
    try {
        const extraOptions = await db.option.findMany({
            include: {
                product: true,
            },
        });

        if (extraOptions.length === 0) return new NextResponse(JSON.stringify({ message: 'Trống' }), { status: 201 });

        return new NextResponse(JSON.stringify(extraOptions), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify((error as any).message), { status: 400 });
    }
};

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    try {
        const { extraName, extraPrice, productId } = body;

        const newExtraOption = await db.option.create({
            data: {
                extraName,
                extraPrice,
                productId,
            },
        });

        return new NextResponse(JSON.stringify(newExtraOption), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify((error as any).message), { status: 400 });
    }
};
