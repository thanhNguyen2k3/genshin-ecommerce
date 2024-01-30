import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
    params: {
        id: string;
    };
};

export const PATCH = async (req: NextRequest, { params: { id } }: Params) => {
    const session = await getAuthSession();

    try {
        const body = await req.json();

        const { deleted } = body;

        const order = await db.order.findFirst({
            where: {
                id,
            },
        });

        if (!order) {
            return new NextResponse(JSON.stringify({ messgae: 'Order not found' }), { status: 400 });
        }

        const newOrder = await db.order.update({
            where: {
                id,
            },
            data: {
                deleted,
            },
        });

        return new NextResponse(JSON.stringify(newOrder));
    } catch (error: any) {
        return new NextResponse(JSON.stringify(error.message), { status: 400 });
    }
};
