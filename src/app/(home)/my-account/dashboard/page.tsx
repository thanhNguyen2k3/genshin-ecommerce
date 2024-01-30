'use client';

import {
    CreditCardOutlined,
    EnvironmentOutlined,
    FileProtectOutlined,
    HeartOutlined,
    PoweroffOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const links = [
    {
        id: 'orders',
        to: 'orders',
        title: 'Đơn hàng',
        icon: <FileProtectOutlined />,
    },
    {
        id: 'address',
        to: 'address',
        title: 'Địa chỉ',
        icon: <EnvironmentOutlined />,
    },
    {
        id: 'pay-method',
        to: 'pay-method',
        title: 'Phương thức thanh toán',
        icon: <CreditCardOutlined />,
    },
    {
        id: 'details',
        to: 'details',
        title: 'Tài khoản',
        icon: <UserOutlined />,
    },
    {
        id: 'wishlist',
        to: 'wishlist',
        title: 'Yêu thích',
        icon: <HeartOutlined />,
    },
    {
        id: 'logout',
        to: null,
        title: 'Đăng xuất',
        icon: <PoweroffOutlined />,
    },
];

const Page = () => {
    const { data } = useSession();

    return (
        <div>
            <h1>
                Xin chào <strong>{data?.user.email}</strong> (không phải {data?.user.email}?){' '}
                <button className="text-primary" onClick={() => signOut()}>
                    Đăng xuất
                </button>
            </h1>

            <p className="my-4">
                Từ bảng điều khiển tài khoản của mình, bạn có thể xem các đơn đặt hàng gần đây, quản lý địa chỉ giao
                hàng và thanh toán cũng như chỉnh sửa mật khẩu và chi tiết tài khoản của mình.
            </p>

            <div className="grid grid-cols-3 gap-4">
                {links.map((link) => (
                    <Link
                        key={link.id}
                        href={link.to === null ? '' : `/my-account/${link?.to}`}
                        onClick={() => link.to === null && signOut()}
                        className="text-center border-2 border-gray-200 px-2 py-4 hover:bg-gray-50"
                    >
                        <span className="text-5xl text-gray-300">{link.icon}</span>
                        <p>{link.title}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Page;
