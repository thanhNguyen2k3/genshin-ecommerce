import FormColor from '@/components/admin/form/color/FormColor';
import { db } from '@/lib/db';

const Page = async () => {
    const colors = await db.color.findMany();

    return <FormColor colors={colors} />;
};

export default Page;
