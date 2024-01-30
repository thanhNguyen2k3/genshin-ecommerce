import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);

        const regionId = searchParams.get('regionId') || undefined;
        const weaponId = searchParams.get('weaponId') || undefined;
        const visionId = searchParams.get('visionId') || undefined;

        const characters = await db.character.findMany({
            where: {
                regionId,
                weaponId,
                visionId,
            },
            include: {
                region: true,
                vision: true,
                weapon: true,
            },
        });

        return NextResponse.json(characters, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify(error.message), { status: 400 });
    }
};
