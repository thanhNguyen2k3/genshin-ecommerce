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
        const { name } = body;

        const region = await db.region.update({
            where: {
                id,
            },
            data: {
                name,
            },
        });

        return NextResponse.json(region, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};
