import VisonData from '@/components/client/admin/VisonData';
import { db } from '@/lib/db';

const Page = async () => {
    const visions = await db.vision.findMany();

    return <VisonData visions={visions} />;
};

export default Page;
