import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
    params: {
        id: string;
    };
};

export const PATCH = async (req: NextRequest, { params: { id } }: Params) => {
    try {
        const body = await req.json();

        const { name, thumbnail, regionId, weaponId, visionId } = body;

        const character = await db.character.update({
            where: {
                id,
            },
            data: {
                name,
                thumbnail,
                regionId,
                weaponId,
                visionId,
            },
        });

        return NextResponse.json(character, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify(error.message), { status: 400 });
    }
};
