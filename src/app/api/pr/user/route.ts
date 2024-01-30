import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async () => {
    try {
        const users = await db.user.findMany({
            include: {
                sessions: true,
            },
        });

        if (!users || users.length === 0) {
            return NextResponse.json({ message: 'Không tìm thấy dữ liệu' }, { status: 200 });
        }

        return NextResponse.json(users, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};
