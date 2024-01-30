import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
    params: {
        id: string;
    };
};

export const GET = async (_req: NextRequest, { params: { id } }: Params) => {
    try {
        const existUser = await db.user.findFirst({
            where: {
                id,
            },
            include: {
                sessions: true,
            },
        });

        if (!existUser) {
            return NextResponse.json({ message: 'Người dùng không tồn tại' }, { status: 401 });
        }

        return NextResponse.json(existUser);
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};

export const PATCH = async (req: NextRequest, { params: { id } }: Params) => {
    try {
        const body = await req.json();

        const { inActive } = body;

        const existUser = await db.user.findFirst({
            where: {
                id,
            },
        });

        if (!existUser) {
            return NextResponse.json({ message: 'Người dùng không tồn tại' }, { status: 401 });
        }

        await db.user.update({
            where: {
                id,
            },
            data: {
                inActive,
            },
        });

        return NextResponse.json({ message: 'Cập nhật thành công' }, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};
