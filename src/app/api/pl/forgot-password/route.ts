import ForgotPasswordEmail from '@/components/component/ForgotPasswordEmail';
import { db } from '@/lib/db';
import { noderMail } from '@/utils/nodemailer';
import { render } from '@react-email/render';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        const { email } = body;

        const existingEmail = await db.user.findFirst({
            where: {
                email,
            },
        });

        if (!existingEmail) {
            return NextResponse.json({ message: 'Không tìm thấy email' }, { status: 201 });
        }

        const randomPassword = Math.random().toString(36).slice(-8);

        const emailHtml = render(
            ForgotPasswordEmail({
                newPassword: randomPassword,
            }),
        );

        await noderMail({
            to: email,
            html: emailHtml,
        });

        const hashPassword = await bcrypt.hash(randomPassword, 10);

        await db.user.update({
            where: {
                email,
            },
            data: {
                password: hashPassword,
            },
        });

        return NextResponse.json({ message: 'Gửi email thành công' });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }));
    }
};
