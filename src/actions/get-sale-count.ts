import { db } from '@/lib/db';

export const getSaleCount = async () => {
    const saleCount = await db.product.count({
        where: {
            saleOff: {
                gt: 0,
            },
        },
    });

    return saleCount;
};
