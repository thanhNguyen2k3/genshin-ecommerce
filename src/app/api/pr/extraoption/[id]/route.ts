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

        const { extraName, extraPrice } = body;

        const product = await db.option.update({
            where: {
                id,
            },
            data: {
                extraName,
                extraPrice,
            },
        });

        return new NextResponse(JSON.stringify(product), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify((error as any).message), { status: 400 });
    }
};
