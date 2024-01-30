import OrderDetail from '@/components/client/user/orders/OrderDetail';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { StatusEnum } from '@/types/enum';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Collapse, CollapseProps } from 'antd';
import Link from 'next/link';

const {} = Collapse;

const Page = async () => {
    const session = await getAuthSession();

    const orders = await db.order.findMany({
        where: {
            userId: session?.user.id,
            isPaid: true,
        },
        include: {
            user: true,
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

    const items: CollapseProps['items'] = orders.map((order) => {
        const renderStatus = (status: number) => {
            if (status === StatusEnum.ORDER_UNCONFIRM) return <span className="">PENDING</span>;
            if (status === StatusEnum.ORDER_CONFIRM) return <span className="text-primary">CONFIRM</span>;
            if (status === StatusEnum.ORDER_SHIPPING) return <span className="text-primary">SHIPPING</span>;
            if (status === StatusEnum.ORDER_COMPLETE) return <span className="text-primary">COMPLETE</span>;
            if (status === StatusEnum.ORDER_CANCELLED) return <span className="text-red-500">CANCELLED</span>;
        };

        return {
            key: order.id,
            label: (
                <h1>
                    Đơn hàng - {order.createdAt.toLocaleDateString()} - {renderStatus(order.status)}
                </h1>
            ),
            children: <OrderDetail order={order} />,
        };
    });

    return (
        <div>
            {orders.length === 0 ? (
                <div className="bg-[#E0B252] px-4 py-4 text-white flex">
                    <InfoCircleOutlined className="text-lg mr-3" />
                    <p>
                        <span className="text-sm">Chưa có đơn đặt hàng nào được thực hiện.</span>
                        <Link href={'/'} className="text-base font-semibold">
                            TRANG CHỦ
                        </Link>
                    </p>
                </div>
            ) : (
                <Collapse items={items} bordered={false} defaultActiveKey={items[0].id} />
            )}
        </div>
    );
};

export default Page;
