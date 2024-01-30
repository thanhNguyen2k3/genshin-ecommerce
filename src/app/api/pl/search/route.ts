import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);

        const query = searchParams.get('q');

        const categoryId = searchParams.get('categoryId') || undefined;

        const products = await db.product.findMany({
            where: {
                deleted: false,
                name: {
                    contains: query!.toLowerCase(),
                    mode: 'insensitive',
                },
                category: {
                    id: categoryId,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                category: true,
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                colors: {
                    include: {
                        color: true,
                    },
                },
                sizes: {
                    include: {
                        size: true,
                    },
                },
                variants: {
                    include: {
                        color: true,
                        size: true,
                    },
                },
            },
        });

        return NextResponse.json(products);
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }));
    }
};
