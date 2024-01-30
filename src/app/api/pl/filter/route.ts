import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type Params = {};

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);

        const characterId = searchParams.get('filter_character') || undefined;

        const products = await db.product.findMany({
            where: {
                groupCharacter: {
                    some: {
                        characterId: characterId?.toString(),
                    },
                },
            },
            include: {
                category: true,
                options: true,
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
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const count = await db.product.count({
            where: {
                groupCharacter: {
                    some: {
                        characterId: characterId?.toString(),
                    },
                },
            },
        });
    } catch (error: any) {
        return new NextResponse(JSON.stringify(error.message), { status: 400 });
    }
};
