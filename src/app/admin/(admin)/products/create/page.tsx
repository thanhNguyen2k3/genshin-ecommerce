import CreateProduct from '@/components/admin/form/product/Create';
import { db } from '@/lib/db';

const Page = async () => {
    const categories = await db.category.findMany();
    const characters = await db.character.findMany();
    const colors = await db.color.findMany();
    const sizes = await db.size.findMany();

    const regions = await db.region.findMany();
    const weapons = await db.weapon.findMany();
    const visions = await db.vision.findMany();

    return (
        <CreateProduct
            categories={categories}
            characters={characters}
            regions={regions}
            weapons={weapons}
            visions={visions}
            colors={colors}
            sizes={sizes}
        />
    );
};

export default Page;
