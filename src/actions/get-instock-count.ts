import { db } from '@/lib/db';

export const getInstockCount = async () => {
    const instockCount = await db.product.findMany({
        where: {
            inStock: {
                gt: 0,
            },
        },
    });

    const inventorys = await db.variant.findMany({
        where: {
            inventory: {
                gt: 0,
            },
        },
    });

    const totalInstock = instockCount.reduce((total, order) => {
        const inventory = inventorys.reduce((init, variant) => {
            return init + variant.inventory;
        }, 0);

        return total + order.inStock! + inventory;
    }, 0);

    return totalInstock;
};
