import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { fullName, detailAddress, phoneNumber, email } = body;
        const session = await getAuthSession();

        if (!session) {
            return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 401 });
        }

        const existEmail = await db.user.findFirst({
            where: {
                email,
            },
        });

        if (!existEmail) {
            return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 401 });
        }

        await db.user.update({
            where: {
                email,
            },
            data: {
                fullName,
                detailAddress,
                phoneNumber,
            },
        });

        return NextResponse.json({ message: 'Cập nhật thành công' }, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};
