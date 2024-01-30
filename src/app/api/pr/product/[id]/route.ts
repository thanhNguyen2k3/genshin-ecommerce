import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
    params: {
        id: string;
    };
};

export const GET = async (_req: NextRequest, { params: { id } }: Params) => {
    try {
        const existingProduct = await db.product.findFirst({
            where: {
                id,
            },
            include: {
                category: true,
                colors: {
                    include: {
                        color: true,
                    },
                },
                sizes: {
                    include: {
                        size: true,
                    },
                },
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
                variants: {
                    include: {
                        color: true,
                        size: true,
                    },
                },
            },
        });

        if (!existingProduct) return NextResponse.json({ message: 'Không tìm thấy sản phẩm' }, { status: 201 });

        return NextResponse.json(existingProduct, { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify((error as any).message), { status: 400 });
    }
};

export const PATCH = async (req: NextRequest, { params: { id } }: Params) => {
    try {
        const body = await req.json();

        const {
            name,
            shortDes,
            description,
            price,
            saleOff,
            categoryId,
            inStock,
            images,
            characterIds,
            active,
            variants,
            type,
            colors,
            sizes,
        } = body;

        const existingProduct = await db.product.findFirst({
            where: {
                id,
            },
        });

        if (!existingProduct) return NextResponse.json({ message: 'Product not found' }, { status: 400 });

        const addVariants = variants?.filter((variant: any) => !variant.id);
        const existVariants = variants?.filter((variant: any) => variant?.id);

        // for (const variant of variants) {
        //     await db.variant.update({
        //         where: {
        //             id: variant.id,
        //         },
        //         data: {
        //             colorId: variant?.colorId || null,
        //             sizeId: variant?.sizeId || null,
        //             optionName: variant?.optionName || null,
        //             inventory: variant.inventory,
        //             price: variant.price,
        //             image: variant.image,
        //         },
        //     });
        // }

        await db.product.update({
            where: {
                id,
            },
            data: {
                name,
                description,
                shortDes,
                price,
                categoryId,
                saleOff,
                inStock,
                images,
                active,
                type,
                groupCharacter: {
                    deleteMany: {},
                },
                sizes: {
                    deleteMany: {},
                },
                colors: {
                    deleteMany: {},
                },
            },
        });

        const newProduct = await db.product.update({
            where: {
                id,
            },
            data: {
                groupCharacter: {
                    create: characterIds?.map((id: string) => ({
                        character: {
                            connect: {
                                id,
                            },
                        },
                    })),
                },
                colors: {
                    create: colors?.map((colorId: string) => ({
                        color: {
                            connect: {
                                id: colorId,
                            },
                        },
                    })),
                },
                sizes: {
                    create: sizes?.map((sizeId: string) => ({
                        size: {
                            connect: {
                                id: sizeId,
                            },
                        },
                    })),
                },
                variants: {
                    update: existVariants?.map((variant: any) => ({
                        where: {
                            id: variant.id,
                        },
                        data: {
                            colorId: variant?.colorId || null,
                            sizeId: variant?.sizeId || null,
                            optionName: variant?.optionName || null,
                            inventory: variant.inventory,
                            price: variant.price,
                            image: variant.image,
                        },
                    })),
                    createMany: {
                        data: addVariants?.map((variant: any) => ({
                            colorId: variant?.colorId || null,
                            sizeId: variant?.sizeId || null,
                            optionName: variant?.optionName || null,
                            inventory: variant.inventory,
                            price: variant.price,
                            image: variant.image,
                        })),
                    },
                },
            },
            include: {
                category: true,
                colors: {
                    include: {
                        color: true,
                    },
                },
                sizes: {
                    include: {
                        size: true,
                    },
                },
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
                variants: {
                    include: {
                        color: true,
                        size: true,
                    },
                },
            },
        });

        // if (variants?.length > 0) {
        //     for (const variant of variants) {
        //         await db.variant.create({
        //             data: {
        //                 colorId: variant?.colorId || null,
        //                 sizeId: variant?.sizeId || null,
        //                 optionName: variant?.optionName || null,
        //                 inventory: variant.inventory,
        //                 price: variant.price,
        //                 image: variant.image,
        //             },
        //         });
        //     }
        // }

        return NextResponse.json({ product: newProduct }, { status: 200 });
    } catch (error: any) {
        console.log(error.message);

        return new NextResponse(JSON.stringify(error.message), { status: 400 });
    }
};
