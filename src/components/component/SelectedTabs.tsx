'use client';

import { Vision } from '@prisma/client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styled from 'styled-components';

type Props = {
    visions?: Vision[];
};

const StyledTabs = styled.ul`
    text-align: center;

    li {
        display: inline-block;
        padding: 0 10px;

        a {
            position: relative;
            display: block;
            color: #fff;
            text-transform: uppercase;
            font-size: 16px;
            font-weight: 500;

            &:hover {
                color: #545454;
            }

            &::before {
                content: '';
                position: absolute;
                width: 0;
                height: 3px;
                border-radius: 1px;
                bottom: 0;
                background-color: #6eb89f;
                transition: all ease-in 0.2s;
            }

            &:hover::before {
                width: 100%;
            }
        }
    }
`;

const SelectedTabs = ({ visions }: Props) => {
    const params = useParams();

    return (
        <StyledTabs>
            <li>
                <Link href="/characters">All</Link>
            </li>
            {visions?.map((vision) => (
                <li key={vision.id}>
                    <Link
                        href={`/characters/${vision.id}`}
                        className={`${params.visionId === vision.id ? 'before:!w-full' : ''}`}
                    >
                        {vision.name}
                    </Link>
                </li>
            ))}
        </StyledTabs>
    );
};

export default SelectedTabs;
