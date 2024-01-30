import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

let PER_PAGE = 9;

export const GET = async (req: NextRequest) => {
    const url = new URL(req.url);
    const query = url.searchParams;
    const currentPage = Math.max(Number(query.get('page') || 1), 1);

    const options: any = {
        take: PER_PAGE,
        skip: (currentPage - 1) * PER_PAGE,
    };

    const countOptions: any = {};

    if (query.get('categoryId')) {
        options.where = {
            deleted: false,
            category: {
                id: query.get('categoryId'),
            },
        };
        countOptions.where = options.where;
    }

    const products = await db.product.findMany({
        ...options,
        include: {
            category: true,
            options: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const count = await db.product.count(countOptions);

    return NextResponse.json({ products, count, length: products.length });
};
