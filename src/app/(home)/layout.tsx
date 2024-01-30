'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Layout } from 'antd';
import Header from '@/components/component/header/Header';
import FooterFn from '@/components/component/footer/FooterFn';
import { useWindowOffsetHeight } from '@/hooks/useWindowDimensions';
import { checkAuth } from '@/utils/checkAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import 'react-loading-skeleton/dist/skeleton.css';

type Props = {
    children: ReactNode;
};

const MainLayout = ({ children }: Props) => {
    const {} = checkAuth();

    const [showChild, setShowChild] = useState(false);
    useEffect(() => {
        setShowChild(true);
    }, []);

    const { offset } = useWindowOffsetHeight();

    if (!showChild) {
        return null;
    }

    if (typeof window === 'undefined') {
        return <></>;
    } else {
        return (
            <>
                <Layout className="bg-white">
                    {/* <ScrollAnimation /> */}
                    <Header />
                    <div className={`pb-5 lg:pb-20 ${offset > 90 && 'lg:mt-[90px] mt-[60px]'} relative z-[1]`}>
                        {children}
                    </div>
                    <FooterFn />
                </Layout>
            </>
        );
    }
};

export default MainLayout;
