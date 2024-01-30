'use client';

import { ShoppingCartOutlined } from '@ant-design/icons';
import { Alert, Divider, Drawer } from 'antd';
import { useEffect, useState } from 'react';
import CartItem from './item/CartItem';
import { useAppSelector } from '@/store/hook';
import Link from 'next/link';
import { totalAmount } from '@/utils/reduceTotal';
import { formartUSD } from '@/utils/formartUSD';
import styled from 'styled-components';

type Props = {};

const StyleModal = styled(Drawer)`
    .ant-drawer-body {
        padding: 0;
    }
`;

const DrawerCart = ({}: Props) => {
    const { cartItems } = useAppSelector((state) => state.cart);
    const [quantity, setQuantity] = useState(0);

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setQuantity(cartItems?.length);
    }, [cartItems]);

    // console.log(cartItems);

    return (
        <div className="    ">
            <button className="flex items-center relative h-full active:opacity-80" onClick={showDrawer}>
                <ShoppingCartOutlined className="text-xl lg:text-xl" />
                <span className="absolute -top-2 -right-2 bg-primary text-white w-4 h-4 rounded-full flex items-center justify-center">
                    {quantity}
                </span>
            </button>

            <StyleModal
                style={{ zIndex: 99999 }}
                title="Giỏ hàng"
                placement="right"
                width={300}
                onClose={onClose}
                open={open}
                footer={
                    <div className="space-y-3 text-base font-semibold">
                        <div className="flex justify-between">
                            <h1>Tổng phụ:</h1>
                            <span className="text-primary">{formartUSD(totalAmount(cartItems))}</span>
                        </div>
                        <Link href={'/shopping-cart'} onClick={onClose}>
                            <button className="uppercase mt-2 text-sm w-full px-2 shadow-lg py-2 hover:opacity-90 h-full transition-all">
                                Xem giỏ hàng
                            </button>
                        </Link>
                        <Link href={'/shopping-cart/checkout'} onClick={onClose}>
                            <button className="uppercase text-sm w-full mt-2 px-2 shadow-lg py-2 h-full bg-primary text-white hover:bg-secondary transition-all">
                                Thanh toán
                            </button>
                        </Link>
                    </div>
                }
            >
                {cartItems?.length === 0 ? (
                    <div>
                        <img src="/nahida.webp" alt="" />

                        <Alert message="Cảnh báo" description="Giỏ hàng trống!" type="warning" showIcon />
                    </div>
                ) : (
                    <ul className="flex flex-col gap-y-2">
                        {cartItems?.map((item, index) => {
                            return (
                                <li key={index}>
                                    <CartItem index={index} cartItem={item} />
                                    {cartItems.length > 1 && <Divider className="my-3" />}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </StyleModal>
        </div>
    );
};

export default DrawerCart;
