import RegionData from '@/components/client/admin/RegionData';
import { db } from '@/lib/db';

const Page = async () => {
    const regions = await db.region.findMany();

    return <RegionData regions={regions} />;
};

export default Page;
