import BuildInvoice from '@/components/admin/invoice/BuildInvoice';
import { db } from '@/lib/db';

type Props = {
    params: {
        id: string;
    };
};

const Page = async ({ params: { id } }: Props) => {
    const order = await db.order.findFirst({
        where: {
            id,
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
            user: true,
        },
    });

    return <BuildInvoice order={order as any} />;
};

export default Page;
