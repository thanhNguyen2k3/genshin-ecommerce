'use client';

import { ExtandCharacter } from '@/types/extend';
import Link from 'next/link';
import styled from 'styled-components';

type Props = {
    character?: ExtandCharacter;
};

const StyledCard = styled.div`
    position: relative;
    overflow: hidden;
    z-index: 2;
    img {
        width: 100%;
    }
`;

const StyleLinkImage = styled(Link)`
    &::before {
        content: '';
        position: absolute;
        background-color: rgba(0, 0, 0, 0.3);
        opacity: 0;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        transition: all ease-in-out 0.3s;
        z-index: 1;
    }

    img {
        width: 100%;
        transition: all ease-out 1s;
        z-index: 0;
    }

    &:hover img {
        transform: scale(1.2);
    }

    &:hover::before {
        opacity: 1;
    }
`;

const CharacterCardItem = ({ character }: Props) => {
    return (
        <StyledCard>
            <StyleLinkImage href={`/shop/?characterId=${character?.id}&page=1`} className="z-[3] relative">
                <img src={`/uploads/${character?.thumbnail}`} alt="" />
            </StyleLinkImage>

            <div className="text-center relative z-10 bg-black uppercase py-2">
                <p className="text-nav text-xs">CATALYST,CRYO</p>
                <Link href={''} className="!text-white text-base font-semibold">
                    {character?.name}
                </Link>
            </div>
        </StyledCard>
    );
};

export default CharacterCardItem;
