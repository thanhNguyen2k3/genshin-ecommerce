import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);

        const categoryId = searchParams.get('categoryId') || undefined;

        const existingProduct = await db.product.findMany({
            where: {
                deleted: false,
                category: {
                    id: categoryId,
                },
            },
            include: {
                category: true,
                groupCharacter: true,
                variants: {
                    include: {
                        color: true,
                        size: true,
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
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!existingProduct) return NextResponse.json({ message: 'Không tìm thấy sản phẩm nào' }, { status: 201 });

        return NextResponse.json(existingProduct, { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify((error as any).message), { status: 400 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        const {
            name,
            shortDes,
            description,
            price,
            saleOff,
            type,
            categoryId,
            images,
            inStock,
            characterIds,
            variants,
            sizes,
            colors,
            active,
        } = body;

        if (!images || images.length === 0) {
            return NextResponse.json({ message: 'Ảnh là bắt buộc' });
        }

        const product = await db.product.create({
            data: {
                name,
                description,
                shortDes,
                price,
                categoryId,
                saleOff,
                images,
                inStock,
                type,
                active,
                variants: {
                    createMany: {
                        data: variants?.map((variant: any) => ({
                            colorId: variant.colorId || null,
                            sizeId: variant.sizeId || null,
                            optionName: variant.optionName || null,
                            inventory: variant.inventory,
                            price: variant.price,
                            image: variant.image,
                        })),
                    },
                },
                groupCharacter: {
                    create: characterIds.map((id: string) => ({
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
            },
            include: {
                groupCharacter: true,
                variants: true,
                sizes: true,
                colors: true,
            },
        });

        return NextResponse.json(product, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify(error.message), { status: 400 });
    }
};
