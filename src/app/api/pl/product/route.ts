import { PER_PAGE } from '@/constant';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);

        const categoryId = searchParams.get('categoryId') || undefined;
        const characterId = searchParams.get('characterId') || undefined;
        const orderBy = searchParams.get('orderby') || undefined;
        const query = searchParams.get('q') || undefined;

        // {page}
        const page = searchParams.get('page') ?? '1';

        const currentPage = Math.max(Number(page), 1);
        //

        const existingProduct = await db.product.findMany({
            where: {
                name: {
                    contains: query?.toString()?.toLowerCase(),
                    mode: 'insensitive',
                },
                category: {
                    id: categoryId,
                },
                groupCharacter:
                    characterId === undefined
                        ? undefined
                        : {
                              some: {
                                  characterId: characterId!,
                              },
                          },
                selled: {
                    gt: orderBy === 'popularity' ? 1 : undefined,
                },
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
                variants: {
                    include: {
                        color: true,
                        size: true,
                    },
                },
            },
            orderBy: !orderBy
                ? { createdAt: 'desc' }
                : orderBy === 'popularity'
                ? { selled: 'desc' }
                : orderBy === 'latest'
                ? { createdAt: 'desc' }
                : orderBy === 'price'
                ? { price: 'desc' }
                : orderBy === 'price-asc'
                ? { price: 'asc' }
                : { createdAt: 'desc' },

            skip: (currentPage - 1) * PER_PAGE,
            take: PER_PAGE,
        });

        const selledProduct = await db.product.findMany({
            where: {
                selled: {
                    gt: 1,
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
                variants: {
                    include: {
                        color: true,
                        size: true,
                    },
                },
                groupCharacter: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 8,
        });

        const count = await db.product.count({
            where: {
                name: {
                    contains: query?.toString()?.toLowerCase(),
                    mode: 'insensitive',
                },
                category: {
                    id: categoryId,
                },
                groupCharacter:
                    characterId === undefined
                        ? undefined
                        : {
                              some: {
                                  characterId: characterId!,
                              },
                          },
                selled: {
                    gt: orderBy === 'popularity' ? 1 : undefined,
                },
            },
        });

        if (!existingProduct) return NextResponse.json({ message: 'Không tìm thấy sản phẩm nào' }, { status: 201 });

        return NextResponse.json(
            { products: existingProduct, count: count, bestSelled: selledProduct },
            { status: 200 },
        );
    } catch (error) {
        return new NextResponse(JSON.stringify((error as any).message), { status: 400 });
    }
};
