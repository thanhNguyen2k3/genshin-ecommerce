import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { render } from '@react-email/render';
import VerifyEmail from '@/components/component/VerifyEmail';
import { noderMail } from '@/utils/nodemailer';

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        const { username, email, password } = body;

        const existingUser = await db.user.findUnique({
            where: {
                email,
                username,
            },
        });

        if (existingUser) {
            return NextResponse.json({ message: 'Tên đăng nhập hoặc email đã tồn tại' }, { status: 400 });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await db.user.create({
            data: {
                username,
                email,
                password: hashPassword,
            },
        });

        const token = await db.token.create({
            data: {
                userId: user.id,
            },
        });

        const emailHtml = render(
            // VerifyEmail({
            //     username: user.username!,
            //     verifyLink: `${process.env.NEXT_URL!}/verify-email?userId=${token.userId}`,
            // }),
            <VerifyEmail
                username={user.username!}
                verifyLink={`${process.env.NEXT_URL!}/verify-email?userId=${token.userId}`}
            />,
        );

        await noderMail({
            to: email,
            html: emailHtml,
        });

        setTimeout(async () => {
            await db.token.deleteMany({
                where: { userId: token.userId },
            });
        }, 60 * 60);

        return NextResponse.json({ message: 'Đăng ký thành công,vui lòng thực email của bạn' }, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
};
