import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { StatusEnum } from '@/types/enum';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const session = await getAuthSession();
        const body = await req.json();
        const { fullName, payMethod, deliveryMethod, total, email, phone, address, orderItems, detailAddress } = body;

        // if (!session) {
        //     return NextResponse.json({ message: 'Không tìm thấy khách hàng' }, { status: 403 });
        // }

        const order = await db.order.create({
            data: {
                fullName,
                email,
                address,
                deliveryMethod,
                phone,
                userId: session?.user ? session.user.id : null,
                status: StatusEnum.ORDER_UNCONFIRM,
                detailAddress,
                payMethod,
                total,
                isPaid: false,
            },
            include: {
                orderItems: true,
            },
        });

        for (const item of orderItems) {
            await db.orderItem.create({
                data: {
                    productId: item?.id,
                    orderId: order.id,
                    variantId: item?.variantId || null,
                    price: item.price,
                    quantity: item.quantity,
                },
            });
        }

        return NextResponse.json(order, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify(error.message), { status: 400 });
    }
};
