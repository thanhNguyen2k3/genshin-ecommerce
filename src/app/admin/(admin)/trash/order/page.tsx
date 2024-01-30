import OrderInTrash from '@/components/client/admin/OrderInTrash';
import { db } from '@/lib/db';

const Page = async () => {
    const orders = await db.order.findMany({
        where: {
            deleted: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
            user: true,
        },
    });

    return <OrderInTrash orders={orders} />;
};

export default Page;
