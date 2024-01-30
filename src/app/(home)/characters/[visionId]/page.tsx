import CharacterCardItem from '@/components/component/CharacterCardItem';
import AlertWarning from '@/components/ui/AlertWarning';
import { db } from '@/lib/db';

type Params = {
    params: {
        visionId: string;
    };
};

const Page = async ({ params: { visionId } }: Params) => {
    const characters = await db.character.findMany({
        where: {
            visionId,
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
                <div className="py-10 w-layout max-w-full mx-auto">
                    <AlertWarning message="Không có thông tin về những nhân vật này" />
                </div>
            ) : (
                <div className="grid mt-4 grid-cols-3 lg:grid-cols-5 md:grid-cols-4 gap-1.5">
                    {characters.map((character) => (
                        <CharacterCardItem key={character.id} character={character} />
                    ))}
                </div>
            )}
        </>
    );
};

export default Page;
