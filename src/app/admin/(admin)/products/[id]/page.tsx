import { db } from '@/lib/db';
import React from 'react';
import UpdateProduct from '@/components/admin/form/product/Update';
import { ExtandProduct } from '@/types/extend';

type Params = {
    params: {
        id: string;
    };
};

const Page = async ({ params: { id } }: Params) => {
    const existingProduct = await db.product.findUnique({
        where: {
            id,
        },
        include: {
            category: true,
            groupCharacter: {
                include: {
                    character: {
                        include: {
                            region: true,
                            vision: true,
                            weapon: true,
                        },
                    },
                },
            },
            sizes: {
                include: {
                    size: true,
                },
            },
            colors: {
                include: {
                    color: true,
                },
            },
            variants: {
                include: {
                    color: true,
                    size: true,
                },
            },
        },
    });

    const colors = await db.color.findMany();
    const sizes = await db.size.findMany();

    const regions = await db.region.findMany();
    const weapons = await db.weapon.findMany();
    const visions = await db.vision.findMany();
    const characters = await db.character.findMany();

    const categories = await db.category.findMany();

    return (
        <UpdateProduct
            colors={colors}
            sizes={sizes}
            product={existingProduct as ExtandProduct}
            categories={categories}
            regions={regions}
            weapons={weapons}
            visions={visions}
            characters={characters}
        />
    );
};

export default Page;
