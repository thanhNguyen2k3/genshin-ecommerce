import { db } from '@/lib/db';
import { StatusEnum } from '@/types/enum';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = async (req: NextRequest) => {
    try {
        const body = await req.json();

        const { orderIds, status } = body;

        const orders = await db.order.findMany({
            where: {
                id: {
                    in: orderIds,
                },
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!orders) {
            return NextResponse.json({ message: 'Order not found' }, { status: 201 });
        }

        for (const orderId of orderIds) {
            const order = await db.order.update({
                where: {
                    id: orderId,
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

            if (order.status === StatusEnum.ORDER_CONFIRM) {
                let holder: any = {};

                order.orderItems.forEach((d) => {
                    if (holder.hasOwnProperty(d.productId)) {
                        holder[d.productId] = holder[d.productId] + d.quantity;
                    } else {
                        holder[d.productId] = d.quantity;
                    }
                });

                let obj2: any[] = [];

                for (const prop in holder) {
                    obj2.push({ key: prop, value: holder[prop] });
                }

                obj2.map(async (item) => {
                    await db.product.updateMany({
                        where: {
                            id: item.key,
                        },
                        data: {
                            inStock: {
                                decrement: item.value,
                            },
                            selled: {
                                increment: item.value,
                            },
                        },
                    });
                });
            }
        }

        return NextResponse.json({ orders }, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }));
    }
};
