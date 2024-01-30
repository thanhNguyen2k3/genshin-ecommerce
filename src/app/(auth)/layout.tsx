'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

type Props = {
    children: ReactNode;
};

const Layout = ({ children }: Props) => {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/');
        }
    }, [status, router]);

    return (
        <div className="relative w-screen h-screen">
            <div
                style={{ background: 'url(/bg-admin.jpg)' }}
                className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center"
            >
                {children}
            </div>
        </div>
    );
};

export default Layout;
