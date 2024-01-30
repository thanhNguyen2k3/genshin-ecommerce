import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
    params: {
        id: string;
    };
};

export const PATCH = async (_req: NextRequest, { params: { id } }: Params) => {
    try {
        const order = await db.order.update({
            where: {
                id,
            },
            data: {
                isPaid: true,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                        variant: {
                            include: {
                                color: true,
                                size: true,
                            },
                        },
                    },
                },
            },
        });

        await db.timeLine.create({
            data: {
                orderId: order.id,
                status: order.status,
            },
            include: {
                order: true,
            },
        });

        return NextResponse.json(order, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};
