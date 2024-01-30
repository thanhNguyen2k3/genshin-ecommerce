'use client';

import { Category, Character } from '@prisma/client';
import { Select } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import styled from 'styled-components';

type Props = {
    categories: Category[];
    characters: Character[];
};

const { Option } = Select;

const StyledSelect = styled(Select)`
    min-width: 160px;
    height: 100%;
    background-color: #e5e7eb;
    padding: 4px 0;

    .ant-select-selector {
        background-color: #e5e7eb !important;
        border: none !important;
        border-radius: 0;
        text-align: center;
    }
`;

const NavigationShop = ({ categories, characters }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // const

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams],
    );

    const onChange = (value: string) => {
        router.push(`${pathname}?${createQueryString('categoryId', value)}`);
    };

    const onFilterByCharacter = (value: string) => {
        router.push(`${pathname}?${createQueryString('characterId', value)}`);
    };

    const sortChange = (value: string) => {
        router.push(`${pathname}?${createQueryString('orderby', value)}`);
    };

    return (
        <div className="mt-6 flex justify-between">
            <div className="gap-x-2 items-center xl:hidden flex">
                <StyledSelect onChange={onChange} defaultValue={''}>
                    <Option value="">Tất cả danh mục</Option>
                    {categories?.map((cate) => (
                        <Option key={cate.id} value={cate?.id}>
                            {cate.name}
                        </Option>
                    ))}
                </StyledSelect>
                <StyledSelect onChange={onFilterByCharacter} defaultValue={''}>
                    <Option value="">Tất cả nhân vật nhân vật</Option>
                    {characters?.map((character) => (
                        <Option key={character.id} value={character?.id}>
                            {character.name.toLocaleUpperCase()}
                        </Option>
                    ))}
                </StyledSelect>
                <button className={`bg-gray-200 py-2 px-4`} onClick={() => (window.location.href = '/shop')}>
                    Clear
                </button>
            </div>

            <StyledSelect onChange={sortChange} defaultValue={'latest'} className="float-right">
                <Option value="latest">Mới nhất</Option>
                <Option value="popularity">Phổ biến nhất</Option>
                <Option value="price">Giá: cao tới thấp</Option>
                <Option value="price-asc">Giá: thấp tới cao</Option>
            </StyledSelect>
        </div>
    );
};

export default NavigationShop;
