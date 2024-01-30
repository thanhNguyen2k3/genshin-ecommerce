import BrandData from '@/components/client/admin/BrandData';
import { db } from '@/lib/db';

const Page = async () => {
    const brands = await db.brand.findMany();

    return <BrandData brands={brands} />;
};

export default Page;
