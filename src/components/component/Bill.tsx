'use client';

import { formartUSD } from '@/utils/formartUSD';
import DividerFading from '../ui/DividerFading';
import { useAppSelector } from '@/store/hook';
import BillBoard from '../local/BillBoard';
import styled from 'styled-components';
import { message } from 'antd';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ButtonComponent from '../local/Button';
import instance from '@/lib/axios';
import { useSession } from 'next-auth/react';

type Props = {};

const StyleBill = styled.div`
    position: absolute;
    left: 0;
    width: 100%;
    height: 10px;
    background-color: transparent;
    background-image: radial-gradient(farthest-side, transparent 6px, #f7f7f7 0);
    background-size: 15px 15px;
`;

const Bill = ({}: Props) => {
    const { status, data } = useSession();

    const { cartItems } = useAppSelector((state) => state.cart);

    const [value, setValue] = useState(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleCheckout = async () => {
        if (status === 'unauthenticated') {
            message.error('Vui lòng đăng nhập để thanh toán');
        } else
            try {
                setIsLoading(true);
                const response = await instance.post('/api/pl/checkout', {
                    productIds: cartItems,
                });

                window.location = response.data.url;
            } catch (error: any) {
                setIsLoading(true);
                message.error(error.message);
            } finally {
                setIsLoading(false);
            }
    };

    const handleCheckoutVNPay = async () => {
        try {
            setIsLoading(true);
            const response = await instance.post('/api/pl/vnpay', {
                orderId: Math.random(),
                language: '',
                orderType: 1,
                orderDescription: 'vnpay',
                amount: 100 * 100,
                bankCode: '',
            });

            window.location = response.data.url;

            console.log(response.data);
        } catch (error: any) {
            setIsLoading(true);
            message.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 px-4 py-4 relative lg:px-7 lg:py-7">
            <div>
                <StyleBill style={{ top: '-10px', backgroundPosition: '-3px -5px, 0 0' }} />
                <h1 className="text-center font-medium text-xl mb-7">ĐƠN HÀNG CỦA BẠN</h1>
                <div className=" bg-white px-7 py-7">
                    <div className="flex justify-between">
                        <span>SẢN PHẨM</span>
                        <span>TỔNG</span>
                    </div>
                    <DividerFading fading />

                    {cartItems.map((item, index) => (
                        <div key={index}>
                            <div className="flex justify-between px-2 py-1">
                                <span className="break-words text-sm w-[calc(100%-100px)]">
                                    [Đặt hàng trước] {item.name}
                                    <strong className="ml-2">× {item.quantity}</strong>
                                </span>

                                <span className="text-gray-500">{formartUSD(item.price * item.quantity)}</span>
                            </div>
                            <DividerFading />
                        </div>
                    ))}

                    <BillBoard />
                </div>
                <br />
                <div>
                    <label className="hover:cursor-pointer">
                        <input
                            name="pay"
                            className="mt-4"
                            onChange={(e) => setValue(Number(e.target.value))}
                            value={1}
                            type="radio"
                            defaultChecked
                        />
                        <span className="ml-2">Thanh toán bàng thẻ ngân hàng quốc tế</span>
                    </label>
                    <AnimatePresence>
                        {value === 1 && (
                            <motion.div
                                animate={{ height: 50, opacity: 1, overflow: 'hidden' }}
                                initial={{ height: 0 }}
                                exit={{ height: 0 }}
                            >
                                <div className="bg-white mt-2 py-2 px-4 h-[40px] flex items-center">
                                    <span className="mr-2">Thanh toán bằng</span>
                                    <img src="/stripe.png" alt="" className="w-[50px]" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div>
                    <label className="hover:cursor-pointer">
                        <input
                            name="pay"
                            className="mt-4"
                            onChange={(e) => setValue(Number(e.target.value))}
                            value={2}
                            type="radio"
                        />
                        <span className="ml-2">Thanh toán bằng VNPAY</span>
                    </label>

                    <AnimatePresence>
                        {value === 2 && (
                            <motion.div
                                animate={{ height: 50, opacity: 1, overflow: 'hidden' }}
                                initial={{ height: 0 }}
                                exit={{ height: 0 }}
                            >
                                <div className="bg-white mt-2 py-2 px-4 h-[40px] flex items-center">
                                    <span className="mr-2">Thanh toán bằng</span>
                                    <img src="/vnpay.webp" alt="" className="w-[70px]" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div>
                    <br />
                    <DividerFading fading />
                    <br />
                    <p className="text-sm text-nav">
                        Thông tin thẻ tín dụng sẽ được xử lý bằng cổng thanh toán an toàn do bạn lựa chọn và sẽ không
                        được lưu trữ trong hệ thống trang web của chúng tôi. Dữ liệu cá nhân của bạn sẽ được sử dụng để
                        xử lý đơn đặt hàng, hỗ trợ trải nghiệm của bạn trên trang web này và cho các mục đích khác được
                        mô tả trong <strong className="text-[#48b8e5] font-semibold">chính sách bảo mật</strong> của
                        chúng tôi.
                    </p>

                    <br />

                    <DividerFading fading />

                    <div className="text-sm text-nav">
                        <label>
                            <input type="checkbox" required />
                            <span className="ml-2">
                                Tôi hiểu và đồng ý rằng đơn hàng không thể bị hủy sau khi thanh toán xong. Tôi cũng đã
                                đọc và đồng ý với các điều khoản và điều kiện của trang web *
                            </span>
                        </label>
                    </div>

                    <br />

                    {value === 1 && (
                        <ButtonComponent loading={isLoading} onClick={handleCheckout}>
                            Thanh toán
                            <img src="/stripe.png" alt="" className="w-[50px] ml-2 h-[20px] object-cover" />
                        </ButtonComponent>
                    )}
                    {value == 2 && (
                        <ButtonComponent htmlType="button" loading={isLoading} onClick={handleCheckoutVNPay}>
                            Thanh toán
                            <img src="/vnpay.webp" alt="" className="w-[50px] ml-2 h-[20px] object-cover" />
                        </ButtonComponent>
                    )}
                </div>
            </div>

            <StyleBill style={{ bottom: '-10px', backgroundPosition: '-3px 2px, 0 0' }} />
        </div>
    );
};

export default Bill;
