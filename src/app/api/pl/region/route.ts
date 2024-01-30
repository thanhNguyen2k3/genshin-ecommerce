import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async () => {
    try {
        const regions = await db.region.findMany();

        if (!regions) {
            return NextResponse.json({ message: 'Không tìm thấy vùng' }, { status: 200 });
        }

        return NextResponse.json(regions, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};
