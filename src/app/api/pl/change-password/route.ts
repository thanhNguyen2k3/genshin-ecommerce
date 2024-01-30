import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        const { email, password } = body;

        const existingEmail = await db.user.findFirst({
            where: {
                email,
            },
        });

        if (!existingEmail) return NextResponse.json({ message: 'Không tìm thấy email' }, { status: 201 });

        const hashPassword = await bcrypt.hash(password, 10);

        await db.user.update({
            where: { email },
            data: {
                password: hashPassword,
            },
        });

        return NextResponse.json({ message: 'Thay đổi mật khẩu thành công' }, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};
