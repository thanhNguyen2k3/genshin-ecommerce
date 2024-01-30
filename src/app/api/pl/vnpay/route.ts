import { NextRequest, NextResponse } from 'next/server';
import moment from 'moment';
import querystring from 'qs';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import { ExtandProduct } from '@/types/extend';
import { StatusEnum } from '@/types/enum';

type Params = {
    params: {
        vnp_ResponseCode: string;
        vnp_TmnCode: string;
    };
};

function sortObject(obj: any) {
    var sorted: any = {};
    var str = [];
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const OPTIONS = async () => {
    return NextResponse.json({}, { headers: corsHeaders });
};

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const session = await getAuthSession();

    // if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

    // VNP params
    const {
        orderId,
        amount,
        language,
        orderType,
        orderDescription,
        bankCode,
        address,
        products,
        fullName,
        phone,
        deliveryMethod,
        payMethod,
        detailAddress,
        email,
    } = body;

    const newOrder = await db.order.create({
        data: {
            userId: session?.user ? session.user.id : null,
            address,
            fullName,
            phone,
            total: amount,
            deliveryMethod,
            detailAddress,
            payMethod,
            email,
            isPaid: false,
            status: StatusEnum.ORDER_UNCONFIRM,
        },
        include: {
            orderItems: true,
        },
    });

    for (const item of products) {
        await db.orderItem.create({
            data: {
                productId: item?.id,
                orderId: newOrder.id,
                variantId: item?.variantId,
                price: item.price,
                quantity: item.quantity,
            },
        });
    }

    const requestHeaders = new Headers(req.headers);
    const ip = req.ip || '';

    try {
        let ipAddr = requestHeaders.set('x-forwarded-for', ip);

        const tmnCode = process.env.VNP_TMN_CODE!;
        const secretKey = process.env.VNP_SECRET!;
        let vnpUrl = process.env.VNP_URL!;

        const returnUrl = `${process.env.NEXT_URL!}/shopping-cart/checkout/${newOrder.id}`;
        // const returnUrl2 = `http://localhost:3000/shopping-cart/checkout?success=false`;

        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');

        const orderInfo = orderDescription;
        let locale = language;

        if (locale === null || locale === '') {
            locale = 'vn';
        }

        const currCode = 'VND';
        let vnp_Params: any = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac('sha512', secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        return NextResponse.json({ url: vnpUrl, orderPrismaId: newOrder.id });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }));
    }
};
