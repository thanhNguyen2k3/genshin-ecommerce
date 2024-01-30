import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { formartUSD } from '@/utils/formartUSD';
import { noderMail } from '@/utils/nodemailer';

type Params = {
    params: {
        id: string;
    };
};

export const POST = async (_req: NextRequest, { params: { id } }: Params) => {
    try {
        const order = await db.order.findUnique({
            where: { id },
            include: {
                orderItems: {
                    include: {
                        product: true,
                        variant: {
                            include: {
                                color: true,
                                size: true,
                            },
                        },
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json({ messgae: 'Order not found' }, { status: 400 });
        }

        const totalAmount = order.orderItems.reduce((sum, item) => {
            return sum + item?.price! * item?.quantity!;
        }, 0);

        let html = `
        <main
        style="border: 1px solid #eee; padding: 10px 10px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; max-width: 600px; margin: 0 auto; overflow-x: auto; min-width: 600px;">
        <div style="text-align: center;">
            <h3 style="font-size: 18px; font-weight: 600;">Hóa đơn từ Shop Genshin Global</h3>
            <p>Mã hóa đơn: #${order.id}</p>
            <h5 style="font-size: 16px; font-weight: 500;">Đến khách hàng: <strong>${order.fullName}</strong></h5>
        </div>

        <div style="display: grid !important; grid-template-columns: repeat(3, minmax(0, 1fr)) !important;">
            <div><span style="text-transform: uppercase; color: gray; font-weight: 400; display: block;">Tổng
                    giá:</span><span
                    style="font-weight: 600; margin-top: 6px; display: block; font-size: 15px;">${formartUSD(
                        order.total,
                    )}</span>
            </div>
            <div><span style="text-transform: uppercase; color: gray; font-weight: 400; display: block;">NGÀY
                    TẠO:</span><span
                    style="font-weight: 600; margin-top: 6px; display: block; font-size: 15px;">${order.createdAt.toLocaleDateString()}</span>
            </div>
            <div><span style="text-transform: uppercase; color: gray; font-weight: 400; display: block;">PHƯƠNG THỨC
                    THANH TOÁN:</span><span
                    style="font-weight: 600; margin-top: 6px; display: block; font-size: 15px;">${
                        order.payMethod === 1 ? 'Trả sau' : 'Đã thanh toán'
                    }</span>
            </div>
        </div>
        <br>
        <div><span style="text-transform: uppercase; color: gray; font-weight: 400; display: block;">PHƯƠNG THỨC
                ĐỊA CHỈ:</span><span style="font-weight: 600; margin-top: 6px; display: block; font-size: 15px;">${
                    order.detailAddress
                }</span>
        </div>
        <div>
            <h4 style="font-weight: 400">ĐƠN HÀNG</h4>

            <ul style="border: 1px solid #ccc; border-radius: 3px; padding: 0;background-color: #eee;">
                ${order.orderItems
                    .map((orderItem) => {
                        const color = orderItem?.variant?.color ? `- ${orderItem.variant?.color?.name}` : '';
                        const size = orderItem?.variant?.size ? `- ${orderItem.variant?.size?.value}` : '';
                        const option = orderItem?.variant?.optionName ? `- ${orderItem.variant?.optionName}` : '';

                        let concat = `${orderItem.product?.name} <strong>${color + size + option}</strong>`;

                        return `<li style="list-style-type: none; padding: 10px 12px; border-bottom: 1px solid #ccc;">
                        <div style="display: flex !important; justify-content: space-between !important;"> 
                            <span style={{ display: 'block', fontSize: '13px', fontWeight: 'normal' }}>
                            </span>${concat}<span> <span style="margin-left:4px">x</span> <strong>${
                            orderItem.quantity
                        }</strong></span><span style="margin-left:20px;">${formartUSD(
                            orderItem?.price * orderItem?.quantity,
                        )}</span></div>
                    </li>`;
                    })
                    .join('')}
            </ul>
        </div>
        <div>
            <h4 style="font-weight: 400">TÓM TẮT</h4>

            <ul style="border: 1px solid #ccc; border-radius: 3px; padding: 0;background-color: #eee;">
                <li style="list-style-type: none; padding: 10px 12px; border-bottom: 1px solid #ccc;">
                    <div style="display: flex !important; justify-content: space-between !important;"><span>Phương thức giao
                            hàng</span><span style="margin-left:20px;">${
                                order.deliveryMethod === 1 ? 'Tiêu chuẩn' : 'Nhanh'
                            }</span></div>
                </li>
                <li style="list-style-type: none; padding: 10px 12px; border-bottom: 1px solid #ccc;">
                    <div style="display: flex !important; justify-content: space-between !important;"><span>Phí thanh
                            toán</span><span style="margin-left:20px;">${formartUSD(totalAmount)}</span></div>
                </li>
                <li style="list-style-type: none; padding: 10px 12px; border-bottom: 1px solid #ccc;">
                    <div style="display: flex !important; justify-content: space-between !important;"><span>Phí giao
                            hàng</span><span style="margin-left:20px;">${
                                order.deliveryMethod === 0
                                    ? 'Miễn phí'
                                    : order.deliveryMethod === 1
                                    ? formartUSD(25000)
                                    : formartUSD(40000)
                            }</span></div>
                </li>
                <li style="list-style-type: none; padding: 10px 12px;">
                    <div style="display: flex !important; justify-content: space-between !important;"><span>Tổng chi
                            phí</span><span style="margin-left:20px;">${formartUSD(order.total)}</span></div>
                </li>
            </ul>
        </div>
    </main>
        `;

        await noderMail({
            to: order.email,
            html,
        });

        return NextResponse.json({ message: 'success' }, { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify(error.message), { status: 400 });
    }
};
