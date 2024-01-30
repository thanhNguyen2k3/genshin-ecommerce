'use client';

import ContainerPage from '@/components/client/user/shop/ContainerPage';
import Wrapper from '@/components/local/Wrapper';
import BestSelling from '@/components/single/BestSelling';
import FilterByCharacters from '@/components/single/FilterByCharacters';
import NavigationShop from '@/components/single/NavigationShop';
import Sectors from '@/components/single/Sectors';
import BreadCumb from '@/components/ui/BreadCumb';
import Paginated from '@/components/ui/Paginated';
import instance from '@/lib/axios';
import { ExtandCharacter, ExtandProduct } from '@/types/extend';
import { Category, Product } from '@prisma/client';

import { ReactNode, useEffect, useState } from 'react';

type ExtandCategory = Category & {
    products: Product[];
};

type Props = {
    children: ReactNode;
    searchParams: { [key: string]: string | string[] | undefined };
};

const Layout = ({ searchParams }: Props) => {
    const [products, setProducts] = useState<ExtandProduct[]>([]);
    const [bestSelled, setBestSelled] = useState<ExtandProduct[]>([]);
    const [categories, setCategories] = useState<ExtandCategory[]>([]);
    const [characters, setCharacters] = useState<ExtandCharacter[]>([]);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState<null | number>(null);

    const categoryId = searchParams['categoryId'] ?? '';
    const characterId = searchParams['characterId'] ?? '';
    const orderBy = searchParams['orderby'] ?? '';
    const page = searchParams['page'] ?? '1';
    const query = searchParams['q'] ?? '';

    // filter

    const makeRequest = async () => {
        setLoading(true);
        await instance
            .get(
                `/api/pl/product?q=${query}&categoryId=${categoryId}&characterId=${characterId}&orderby=${orderBy}&page=${page}`,
            )
            .then((res) => {
                setProducts(res.data.products);
                setCount(res.data.count);
                setBestSelled(res.data.bestSelled);
            })
            .finally(() => setLoading(false));
    };

    const makeCategories = () => {
        instance.get('/api/pl/category').then((res) => {
            setCategories(res.data);
        });
    };

    const makeCharacters = () => {
        instance.get('/api/pl/character').then((res) => setCharacters(res.data));
    };

    useEffect(() => {
        makeRequest();
    }, [categoryId, characterId, orderBy, page, query]);

    useEffect(() => {
        makeCategories();
        makeCharacters();
    }, []);

    return (
        <>
            <BreadCumb />

            <Wrapper>
                <div className="grid grid-cols-1 gap-x-6 xl:grid-cols-4">
                    <div className="col-span-1">
                        <Sectors categoryId={categoryId} categories={categories} />
                        <FilterByCharacters characters={characters} />
                    </div>

                    <div className="col-span-3">
                        <div>
                            <h1 className="text-lg font-semibold text-center mb-3 mt-2 lg:mb-6 lg:text-2xl">
                                Shop Genshin Impact & Honkai: Star Rail Merch
                            </h1>
                            {bestSelled?.length > 0 && <BestSelling products={bestSelled} />}
                        </div>
                        <div>
                            <NavigationShop categories={categories} characters={characters} />
                        </div>

                        <ContainerPage products={products} loading={loading} />

                        {products?.length > 0 && <Paginated count={count!} />}
                    </div>
                </div>
            </Wrapper>
        </>
    );
};

export default Layout;
