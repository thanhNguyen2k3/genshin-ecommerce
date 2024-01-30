import ProductInTrash from '@/components/client/admin/ProductInTrash';
import { db } from '@/lib/db';

type Props = {
    searchParams: { [key: string]: string | string[] | undefined };
};

const Page = async ({ searchParams }: Props) => {
    const productId = searchParams['productId'];

    const products = await db.product.findMany({
        where: {
            deleted: true,
        },
        include: {
            options: true,
            category: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const extraOptions = await db.option.findMany({
        where: {
            productId: productId as string,
        },
        include: {
            product: true,
        },
    });

    const categories = await db.category.findMany();

    return <ProductInTrash products={products} options={extraOptions} categories={categories} />;
};

export default Page;
