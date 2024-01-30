import CharacterCardItem from '@/components/component/CharacterCardItem';
import AlertWarning from '@/components/ui/AlertWarning';

import { db } from '@/lib/db';

type DynamicParams = {
    searchParams: { [key: string]: string | string[] | undefined };
};

const Page = async ({ searchParams }: DynamicParams) => {
    const regionId = searchParams['regionId'] || undefined;

    const characters = await db.character.findMany({
        where: {
            region: {
                id: regionId?.toString(),
            },
        },
        include: {
            region: true,
            vision: true,
            weapon: true,
        },
    });

    return (
        <>
            {characters.length === 0 ? (
                <div className="mt-4 w-layout mx-auto">
                    <AlertWarning message="Không tìm thấy nhân vật nào" />
                </div>
            ) : (
                <div className="grid  mt-4 grid-cols-3 lg:grid-cols-5 md:grid-cols-4 gap-1.5">
                    {characters.map((character) => (
                        <CharacterCardItem key={character.id} character={character} />
                    ))}
                </div>
            )}
        </>
    );
};

export default Page;
