'use client';

import BillBoard from '@/components/local/BillBoard';
import ButtonComponent from '@/components/local/Button';
import DividerFading from '@/components/ui/DividerFading';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { clear, decrease, increase, remove } from '@/slices/cart';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { formartUSD } from '@/utils/formartUSD';
import { CloseOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Props = {};

const Page = ({}: Props) => {
    const { cartItems } = useAppSelector((state) => state.cart);
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);
    const [deliveryMoney, setDeliveryMoney] = useState(25000);
    const [deliveryMethod, setDeliveryMethod] = useState(1);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [cartItems]);

    return (
        <>
            {loading ? (
                <div className="min-h-screen">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="max-w-full w-layout mx-auto">
                    <div className="grid lg:grid-cols-3 grid-cols-1 py-10 lg:px-0 lg:pr-2">
                        {!cartItems || cartItems?.length === 0 ? (
                            <div className="grid place-items-center grid-cols-2 col-span-3 pr-2">
                                <div>
                                    <img src="/nahida.webp" alt="" />
                                </div>
                                <div>
                                    <Alert
                                        message="Giỏ hàng của bạn đang trống"
                                        description="Rất vui khi quý khách mua hàng của chúng tôi"
                                        type="info"
                                        showIcon
                                    />
                                    <Link
                                        href={'/'}
                                        className="w-full block text-center py-4 px-2 uppercase bg-primary hover:bg-secondary !text-white mt-2 font-semibold"
                                    >
                                        Quay lại trang chủ
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="col-span-2 p-4 text-nav">
                                    <table className="font-medium lg:block md:block hidden table-auto">
                                        <thead className="text-base">
                                            <tr className="border-b">
                                                <th></th>
                                                <th></th>
                                                <th className="px-4 text-left uppercase font-semibold text-nav py-4">
                                                    Sản phẩm
                                                </th>
                                                <th className="px-2 uppercase font-semibold text-nav py-4">Giá</th>
                                                <th className="px-2 uppercase font-semibold text-nav py-4">Số</th>
                                                <th className="uppercase font-semibold text-nav py-4">Tổng</th>
                                            </tr>
                                        </thead>
                                        <tbody className="border-b-2 border-gray-300">
                                            {cartItems.map((item, index) => {
                                                return (
                                                    <tr
                                                        key={index}
                                                        className={`text-sm ${
                                                            cartItems.length > 1 && 'border-b border-gray-300'
                                                        }`}
                                                    >
                                                        <th>
                                                            <button
                                                                className="p-3"
                                                                onClick={() => dispatch(remove(index))}
                                                            >
                                                                <CloseOutlined />
                                                            </button>
                                                        </th>
                                                        <th>
                                                            <img
                                                                className="lg:min-w-[80px] md:min-w-[65px] lg:min-h-[80px] w-[65px] h-[65px]"
                                                                src={`/uploads/${item.images![0]}`}
                                                                alt=""
                                                            />
                                                        </th>
                                                        <th className="px-4 w-full py-8 text-left">
                                                            {item?.option ? (
                                                                <span className="font-semibold text-base">
                                                                    {item?.name}{' '}
                                                                    <strong className="text-black font-bold">
                                                                        {item?.option?.color &&
                                                                            `- ${item?.option?.color}`}{' '}
                                                                        {item?.option?.size &&
                                                                            `- ${item?.option?.size}`}{' '}
                                                                        {item?.option?.optionName &&
                                                                            `- ${item?.option?.optionName}`}
                                                                    </strong>
                                                                </span>
                                                            ) : (
                                                                <span>{item?.name}</span>
                                                            )}
                                                        </th>
                                                        <th className="px-2 py-8">{formartUSD(item.price)}</th>
                                                        <th className="px-2 py-8">
                                                            <label className="min-w-[80px] max-w-[80px] flex">
                                                                <button
                                                                    className="border border-b px-2 py-2"
                                                                    onClick={() => dispatch(decrease(index))}
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="flex items-center px-2 border-t border-b">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    className="border px-2 py-2"
                                                                    onClick={() => dispatch(increase(index))}
                                                                >
                                                                    +
                                                                </button>
                                                            </label>
                                                        </th>
                                                        <th className="px-2 py-8">
                                                            <p className="text-primary text-base">
                                                                {formartUSD(item.price * item.quantity)}
                                                            </p>
                                                        </th>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>

                                    {cartItems.map((item, index) => (
                                        <div key={index}>
                                            <div className="lg:hidden md:hidden flex font-medium gap-x-3 border-b border-gray-400 py-2">
                                                <img
                                                    className="col-span-1 max-w-[100px] max-h-[100px]"
                                                    src={`/uploads/${item.images![0]}`}
                                                    alt=""
                                                />
                                                <div className="col-span-2 flex flex-col justify-between flex-1 text-sm">
                                                    <div className="flex justify-between items-center">
                                                        {item?.option ? (
                                                            <span>
                                                                {item?.name}{' '}
                                                                <strong className="text-black">
                                                                    {item?.option?.color && `- ${item?.option?.color}`}{' '}
                                                                    {item?.option?.size && `- ${item?.option?.size}`}{' '}
                                                                    {item?.option?.optionName &&
                                                                        `- ${item?.option?.optionName}`}
                                                                </strong>
                                                            </span>
                                                        ) : (
                                                            <span>{item?.name}</span>
                                                        )}
                                                        <button className="p-1" onClick={() => dispatch(remove(index))}>
                                                            <CloseOutlined />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between border-b border-gray-100 py-2">
                                                        <span>Giá</span>
                                                        <span className="">{formartUSD(item.price)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between border-b border-gray-100 py-2">
                                                        <span>Số lượng</span>
                                                        <div>
                                                            <div className="min-w-[80px] max-w-[80px] flex">
                                                                <button
                                                                    className="border-2 px-2 min-w-[30px] rounded-tl rounded-bl"
                                                                    onClick={() => dispatch(decrease(index))}
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="flex items-center py-1 px-2 border-t-2 border-b-2">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    className="border-2 px-2 min-w-[30px] rounded-tr rounded-br"
                                                                    onClick={() => dispatch(increase(index))}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between py-2">
                                                        <span>Tổng giá</span>
                                                        <span className="text-primary">
                                                            {formartUSD(item.quantity * item.price)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Apply Coupon */}
                                    <br />
                                    <div className="lg:flex md:flex space-y-4 lg:space-y-0 block flex-row-reverse justify-between items-center">
                                        <button className="bg-gray-200 opacity-80 hover:opacity-100 transition-all shadow text-sub px-3 py-2 uppercase">
                                            Cập nhật giỏ hàng
                                        </button>

                                        <button
                                            onClick={() => dispatch(clear())}
                                            className="bg-gray-200 ml-2 opacity-80 hover:opacity-100 transition-all shadow text-sub px-3 py-2 uppercase"
                                        >
                                            Xóa giỏ hàng
                                        </button>
                                        <div className="border-dashed border lg:border-0 md:border-0 p-6 flex border-gray-300">
                                            <input
                                                type="text"
                                                className="border w-2/3 lg:w-auto md:w-auto outline-none px-2 py-2"
                                                placeholder="Mã giảm giá"
                                            />
                                            <button className="ml-2 font-semibold bg-primary w-1/3 lg:w-auto md:w-auto px-2 py-2 text-white">
                                                ÁP MÃ GIẢM GIÁ
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-1 px-4 lg:px-0">
                                    <div className="border-2 border-gray-200 rounded space-y-6 p-5 font-semibold text-sm text-nav">
                                        <h1 className="uppercase text-xl">TỔNG GIỎ HÀNG</h1>

                                        <div className="flex flex-col justify-between gap-y-6">
                                            <BillBoard
                                                deliveryMoney={deliveryMoney}
                                                setDeliveryMoney={setDeliveryMoney}
                                                deliveryMethod={deliveryMethod}
                                                setDeliveryMethod={setDeliveryMethod}
                                            />

                                            <ButtonComponent to={'/shopping-cart/checkout'}>
                                                TIẾN HÀNH KIỂM TRA
                                            </ButtonComponent>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Page;
