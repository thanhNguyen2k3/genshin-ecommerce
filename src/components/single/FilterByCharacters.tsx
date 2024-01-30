'use client';

import { Character } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type Props = {
    characters: Character[];
};

const FilterByCharacters = ({ characters }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams],
    );

    return (
        <div>
            <div className="xl:block hidden">
                <h1 className="text-base font-semibold mt-8 mb-4 uppercase">Tìm kiếm theo nhân vật</h1>

                <div>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-1 overflow-y-auto max-h-[223px]">
                        {characters.map((character) => (
                            <p
                                onClick={() =>
                                    router.push(`${pathname}?${createQueryString('characterId', character.id)}`)
                                }
                                key={character.id}
                                className="text-sm uppercase cursor-pointer"
                            >
                                {character.name}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterByCharacters;
