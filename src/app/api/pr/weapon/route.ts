import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { name } = body;

        const weapon = await db.weapon.create({
            data: {
                name,
            },
        });

        return NextResponse.json(weapon, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};

export const GET = async () => {
    try {
        const weapons = await db.weapon.findMany();

        if (weapons.length === 0) return NextResponse.json({ message: 'Không tìm thấy vision nào' }, { status: 200 });

        return NextResponse.json(weapons, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};
