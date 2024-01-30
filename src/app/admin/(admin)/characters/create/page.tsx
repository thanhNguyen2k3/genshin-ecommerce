import FormCharacter from '@/components/admin/form/characters/Create';
import { db } from '@/lib/db';

const Page = async () => {
    const visions = await db.vision.findMany();
    const weapons = await db.weapon.findMany();
    const regions = await db.region.findMany();

    return <FormCharacter visions={visions} weapons={weapons} regions={regions} />;
};

export default Page;
