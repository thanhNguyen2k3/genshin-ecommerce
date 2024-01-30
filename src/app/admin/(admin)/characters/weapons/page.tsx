import WeaponData from '@/components/client/admin/WeaponData';
import { db } from '@/lib/db';

const Page = async () => {
    const weapons = await db.weapon.findMany();

    return <WeaponData weapons={weapons} />;
};

export default Page;
