import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { ExtandProduct } from '@/types/extend';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const OPTIONS = async () => {
    return NextResponse.json({}, { headers: corsHeaders });
};

export const POST = async (req: Request) => {
    const session = await getAuthSession();

    const { productIds } = await req.json();

    if (!productIds || productIds.length === 0) {
        return new NextResponse('ProductIds are required');
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    productIds.forEach((product: ExtandProduct & { extraSelected: string }) => {
        line_items.push({
            quantity: product.quantity!,
            price_data: {
                currency: 'USD',
                product_data: {
                    name: product.name,
                },
                unit_amount: Number(product.price) * 100,
            },
        });
    });

    const order = await db.order.create({
        data: {
            userId: session?.user.id!,
            isPaid: false,
            orderItems: {
                create: productIds.map((product: ExtandProduct & { extraSelected?: string }) => ({
                    product: {
                        connect: {
                            id: product.id,
                        },
                    },
                    quantity: product.quantity,
                    name:
                        product?.extraSelected?.length! > 0
                            ? `${product.name} - ${product.extraSelected}`
                            : product.name,
                })),
            },
        },
    });

    const checkoutSession = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        billing_address_collection: 'required',
        phone_number_collection: {
            enabled: true,
        },
        success_url: `${process.env.NEXT_URL}/shopping-cart/checkout?success=true`,
        cancel_url: `${process.env.NEXT_URL}/shopping-cart/checkout?success=false`,
        metadata: {
            orderId: order.id,
        },
    });

    return NextResponse.json({ url: checkoutSession.url }, { headers: corsHeaders });
};
