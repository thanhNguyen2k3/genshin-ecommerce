import FormSize from '@/components/admin/form/size/FormSize';
import { db } from '@/lib/db';

const Page = async () => {
    const sizes = await db.size.findMany();
    return <FormSize sizes={sizes} />;
};

export default Page;
