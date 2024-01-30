import CancelledOrder from '@/components/component/CancelledOrder';
import { db } from '@/lib/db';
import { noderMail } from '@/utils/nodemailer';
import { resendEmail } from '@/utils/resendEmail';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
    params: {
        id: string;
    };
};

export const PATCH = async (req: NextRequest, { params: { id } }: Params) => {
    try {
        const body = await req.json();
        const { status } = body;

        const order = await db.order.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });

        let html = `
        <div
            style="font-family: Arial, Helvetica, sans-serif; box-shadow:0 0 6px rgba(0,0,0,0.3); max-width: 600px; padding: 10px 20px; margin: 0 auto;">
            <p style="text-align: right;">Date: ${order.updatedAt.toLocaleDateString()}</p>

            <a href="${process.env.NEXT_URL}">Từ: Shop Genshin Global</a>
            <p>Đến: ${order.fullName}</p>

            <h1 style="font-weight: 400;">Đơn hàng của bạn đã được hủy theo yêu cầu.</h1>
            <p>Cảm ơn quý khách đã ủng hộ.</p>
            </div>
        `;

        await noderMail({
            to: order.email,
            html,
        });

        await db.timeLine.create({
            data: {
                orderId: order.id,
                status: order.status,
            },
            include: {
                order: true,
            },
        });

        return NextResponse.json({ message: 'Hủy đơn hàng thành công' }, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify(error.message), { status: 400 });
    }
};
