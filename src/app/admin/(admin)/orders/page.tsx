import OrderData from '@/components/client/admin/OrderData';
import { db } from '@/lib/db';
import { ExtandOrder } from '@/types/extend';

type Props = {
    searchParams: { [key: string]: string | string[] | undefined };
};

const Page = async ({ searchParams }: Props) => {
    const status = searchParams['status'] || undefined;
    const payMethod = searchParams['method'] || undefined;
    const startDate = searchParams['startdate'] || undefined;
    const endDate = searchParams['enddate'] || undefined;

    const orders = await db.order.findMany({
        where: {
            deleted: false,
            payMethod: {
                equals: payMethod === '1' ? 1 : payMethod === '2' ? 2 : undefined,
            },
            status: Number(status) ? Number(status) : Number(status) === 0 ? 0 : undefined,
            createdAt: startDate &&
                endDate && {
                    lte: new Date(`${endDate}`)?.toISOString(),
                    gte: new Date(`${startDate}`)?.toISOString(),
                },
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                    variant: {
                        include: {
                            color: true,
                            size: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div>
            <OrderData orders={orders as ExtandOrder[]} />
        </div>
    );
};

export default Page;
