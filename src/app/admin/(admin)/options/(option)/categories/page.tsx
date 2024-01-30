import CategoriesData from '@/components/client/admin/CategoriesData';
import { db } from '@/lib/db';

const Page = async () => {
    const categories = await db.category.findMany();

    return <CategoriesData categories={categories} />;
};

export default Page;
