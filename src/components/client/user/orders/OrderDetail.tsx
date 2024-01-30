'use client';

import ButtonComponent from '@/components/local/Button';
import instance from '@/lib/axios';
import { StatusEnum } from '@/types/enum';
import { formartUSD } from '@/utils/formartUSD';
import { Modal, message } from 'antd';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';

type Props = {
    order: any;
};
const OrderDetail = ({ order }: Props) => {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState<ReactNode>(
        <span className="text-red-500">Đơn hàng sau khi thanh toán sẽ không được hủy</span>,
    );

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async () => {
        try {
            setModalText('Đang hủy');
            setConfirmLoading(true);
            setTimeout(() => {
                setOpen(false);
                setConfirmLoading(false);
            }, 2000);

            await instance
                .patch(`/api/pl/cancell-order/${order.id}`, {
                    status: StatusEnum.ORDER_CANCELLED,
                })
                .then(() => router.refresh());
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <div className="overflow-x-auto">
            <div className="mt-2 mb-4">
                <ButtonComponent
                    onClick={showModal}
                    disabled={
                        order.status >= StatusEnum.ORDER_CONFIRM ||
                        order.payMethod === 2 ||
                        order.status === StatusEnum.ORDER_CANCELLED
                    }
                >
                    {order.payMethod === 2 ? 'Đã thanh toán' : 'Hủy đơn hàng'}
                </ButtonComponent>
            </div>
            <table className="border min-w-[500px]">
                <thead>
                    <tr>
                        <th></th>
                        <th className="text-left">Sản phẩm</th>
                        <th className="line-clamp-1 min-w-[100px] text-center">Số lượng</th>
                        <th className="min-w-[100px] text-center">Giá</th>
                    </tr>
                </thead>
                <tbody>
                    {order.orderItems.map((item: any) => {
                        const color = item?.variant?.color ? ' - ' + item.variant.color.name : '';
                        const size = item?.variant?.size ? ' - ' + item.variant.size.value : '';
                        const option = item?.variant?.optionName ? ' - ' + item.variant.optionName : '';

                        let orderName = (
                            <p>
                                {item?.product?.name} <span className="font-bold">{color! + size! + option!}</span>
                            </p>
                        );

                        return (
                            <tr className="border" key={item.id}>
                                <td className="p-2">
                                    <img
                                        src={`/uploads/${item?.variant?.image || item?.product?.images![0]}`}
                                        className="min-w-[50px] min-h-[50px]"
                                        alt=""
                                    />
                                </td>
                                <td className="p-2 w-full">{orderName}</td>
                                <td className="p-2 text-center">{item.quantity}</td>
                                <td className="p-2 text-center">{formartUSD(item.price * item.quantity)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <Modal
                title="Bạn có muốn hủy đơn hàng này"
                open={open}
                onOk={handleOk}
                okButtonProps={{ type: 'default' }}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <p>{modalText}</p>
            </Modal>
        </div>
    );
};

export default OrderDetail;
