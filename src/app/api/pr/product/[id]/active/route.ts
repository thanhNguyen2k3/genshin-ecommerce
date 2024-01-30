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

        const { inActive, ids } = body;

        const products = await db.product.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });

        const existingProduct = await db.product.findFirst({
            where: {
                id,
            },
        });

        if (ids?.length >= 0) {
            if (!products) {
                return NextResponse.json({ message: 'Products not found' }, { status: 400 });
            }

            await db.product.updateMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
                data: {
                    inActive,
                },
            });

            return NextResponse.json({ message: 'success' }, { status: 200 });
        } else {
            if (!existingProduct) {
                return NextResponse.json({ message: 'Product not found' }, { status: 400 });
            }

            await db.product.update({ where: { id }, data: { inActive } });

            return NextResponse.json({ message: 'success' }, { status: 200 });
        }
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};
