import CheckoutDetail from '@/components/client/user/checkout/CheckoutDetail';
import { db } from '@/lib/db';
import { ExtandProduct } from '@/types/extend';

const Page = async () => {
    const products = await db.product.findMany({
        include: {
            category: true,
            variants: {
                include: {
                    color: true,
                    size: true,
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
        },
    });

    const orderItems = await db.orderItem.findMany({
        include: {
            product: true,
            variant: true,
        },
    });
    return (
        <div>
            <CheckoutDetail products={products as ExtandProduct[]} orderItems={orderItems as any} />
        </div>
    );
};

export default Page;
