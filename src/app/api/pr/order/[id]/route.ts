import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { StatusEnum } from '@/types/enum';
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

        const { status } = body;

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
                status,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (newOrder.status === StatusEnum.ORDER_CONFIRM) {
            for (const item of newOrder.orderItems) {
                if (item?.variantId) {
                    await db.variant.update({
                        where: {
                            id: item?.variantId!,
                        },
                        data: {
                            inventory: {
                                decrement: item.quantity,
                            },
                            product: {
                                update: {
                                    selled: {
                                        increment: item.quantity,
                                    },
                                },
                            },
                        },
                    });
                } else {
                    await db.product.update({
                        where: {
                            id: item?.productId!,
                        },
                        data: {
                            inStock: {
                                decrement: item.quantity,
                            },
                            selled: {
                                increment: item.quantity,
                            },
                        },
                    });
                }
            }
        }

        return NextResponse.json({ message: 'Cập nhật thành công' }, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify(error.message), { status: 400 });
    }
};
