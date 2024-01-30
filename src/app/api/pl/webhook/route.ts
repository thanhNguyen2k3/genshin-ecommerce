import Stripe from 'stripe';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { StatusEnum } from '@/types/enum';

export const POST = async (req: Request) => {
    const body = await req.text();
    const signature = headers().get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country,
    ];

    const addressString = addressComponents.filter((c) => c !== null).join(', ');

    if (event.type === 'checkout.session.completed') {
        const order = await db.order.update({
            where: {
                id: session?.metadata?.orderId,
            },
            data: {
                isPaid: true,
                address: addressString,
                phone: session?.customer_details?.phone || '',
                status: StatusEnum.ORDER_CONFIRM,
            },
            include: {
                orderItems: true,
            },
        });

        const productIds = order.orderItems.map((orderItem) => orderItem.productId);

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

    return new NextResponse(null, { status: 200 });
};
