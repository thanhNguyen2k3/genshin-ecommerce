import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        const { username, password } = body;

        const user = await db.user.findFirst({
            where: {
                username,
                password,
            },
        });

        if (!user) {
            return NextResponse.json({ message: 'Thông tin đăng nhập không hợp lệ' }, { status: 401 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify(error.message), { status: 400 });
    }
};
