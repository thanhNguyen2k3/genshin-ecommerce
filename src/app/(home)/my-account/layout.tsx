'use client';

import Wrapper from '@/components/local/Wrapper';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

type Props = {
    children: ReactNode;
};

const links = [
    {
        id: 'dashboard',
        to: 'dashboard',
        title: 'Quản lý',
    },
    {
        id: 'orders',
        to: 'orders',
        title: 'Đơn hàng',
    },
    {
        id: 'address',
        to: 'address',
        title: 'Địa chỉ',
    },
    {
        id: 'pay-method',
        to: 'pay-method',
        title: 'Phương thức thanh toán',
    },
    {
        id: 'details',
        to: 'details',
        title: 'Tài khoản',
    },
    {
        id: 'wishlist',
        to: 'wishlist',
        title: 'Yêu thích',
    },
    {
        id: 'logout',
        to: null,
        title: 'Đăng xuất',
    },
];

const layout = ({ children }: Props) => {
    const { status } = useSession();

    let path = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') return router.push('/');
    }, [status]);

    return (
        <>
            {status === 'loading' ? (
                <LoadingSpinner />
            ) : (
                <Wrapper>
                    <div className="bg-gray-100 text-sm p-4">
                        <h1 className="font-semibold">Lời nhắc nhở thân thiện:</h1>
                        <p>
                            Vui lòng không nhập địa chỉ PO Box/APO làm địa chỉ giao hàng theo yêu cầu của nhà cung cấp
                            dịch vụ hậu cần của chúng tôi.
                        </p>
                        <p>Đơn hàng không thể bị hủy sau khi đã thanh toán.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-0 lg:gap-x-6 gap-y-4 mt-6 lg:grid-cols-4">
                        <div className="border-r px-2 col-span-1">
                            <h1 className="px-2 text-xl font-semibold border-b py-2">TÀI KHOẢN CỦA TÔI</h1>

                            <ul>
                                {links.map((link) => (
                                    <li
                                        key={link.id}
                                        className={`${
                                            path === `/my-account/${link?.to}` ? 'bg-gray-100' : ''
                                        } hover:bg-gray-100`}
                                    >
                                        <Link
                                            onClick={() => link?.to === null && signOut()}
                                            className="block !text-black text-sm font-semibold px-2 py-2"
                                            href={link.to === null ? '' : `/my-account/${link?.to}`}
                                        >
                                            {link.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="col-span-3 lg:px-0 px-4">{children}</div>
                    </div>
                </Wrapper>
            )}
        </>
    );
};

export default layout;
