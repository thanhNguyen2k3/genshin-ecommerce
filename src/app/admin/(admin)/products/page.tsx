import ProductData from '@/components/client/admin/ProductData';
import { db } from '@/lib/db';

type Props = {
    searchParams: { [key: string]: string | string[] | undefined };
};

const Page = async ({ searchParams }: Props) => {
    const searchQuery = searchParams['q'] || undefined;
    const startDate = searchParams['startdate'] || undefined;
    const endDate = searchParams['enddate'] || undefined;

    const products = await db.product.findMany({
        where: {
            deleted: false,
            createdAt: startDate &&
                endDate && {
                    lte: new Date(`${endDate}`)?.toISOString(),
                    gte: new Date(`${startDate}`)?.toISOString(),
                },

            name: {
                contains: searchQuery?.toString()?.toLowerCase(),
                mode: 'insensitive',
            },
        },
        include: {
            category: true,
            groupCharacter: {
                include: {
                    character: true,
                },
            },
            variants: {
                include: {
                    color: true,
                    size: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const categories = await db.category.findMany();

    return <ProductData products={products} categories={categories} />;
};

export default Page;
