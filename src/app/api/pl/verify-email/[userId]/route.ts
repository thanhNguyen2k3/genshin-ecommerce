import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
    params: {
        userId: string;
    };
};

export const PATCH = async (_req: NextRequest, { params: { userId } }: Params) => {
    try {
        const existingUser = await db.user.findFirst({
            where: {
                id: userId,
            },
        });

        if (!existingUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 400 });
        }

        await db.user.update({
            where: {
                id: userId,
            },
            data: {
                inActive: true,
            },
        });

        return NextResponse.json({ message: 'Đã kích hoạt tài khoản thành công' }, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify(error.message), { status: 400 });
    }
};
