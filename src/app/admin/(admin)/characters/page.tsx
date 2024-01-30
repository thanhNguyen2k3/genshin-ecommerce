import CharacterData from '@/components/client/admin/CharacterData';
import { db } from '@/lib/db';

type DynamicParams = {
    searchParams: { [key: string]: string | string[] | undefined };
};

const Page = async ({ searchParams }: DynamicParams) => {
    const query = (searchParams['q'] as string) || undefined;
    const region = searchParams['regionId'] ?? '';

    const characters = await db.character.findMany({
        where: {
            name: {
                contains: query?.toLowerCase(),
                mode: 'insensitive',
            },
            region: {
                id: region?.toString() || undefined,
            },
        },
        include: {
            region: true,
            vision: true,
            weapon: true,
        },
        orderBy: {
            name: 'asc',
        },
    });

    const visions = await db.vision.findMany();
    const weapons = await db.weapon.findMany();
    const regions = await db.region.findMany();

    return <CharacterData regions={regions} weapons={weapons} visions={visions} characters={characters} />;
};

export default Page;
