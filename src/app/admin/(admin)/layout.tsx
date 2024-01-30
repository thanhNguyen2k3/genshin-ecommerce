'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Layout, theme } from 'antd';
import Sidebar from '@/components/admin/sidebar/Sidebar';
import AdminHeader from '@/components/admin/header/AdminHeader';
import styled from 'styled-components';

const { Content } = Layout;

type Props = {
    children: ReactNode;
};

const StyleAdminLayout = styled(Layout)``;

const LayoutAdmin = ({ children }: Props) => {
    const [showChild, setShowChild] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    useEffect(() => {
        setShowChild(true);
    }, []);

    // useEffect(() => {
    //     if (status === 'loading' && !(data as any)?.user?.isAdmin) {
    //         router.push('/admin/login');
    //     } else if (
    //         (status === 'loading' && (data as any)?.user?.isAdmin) ||
    //         (status === 'loading' && (!data as any)?.user)
    //     ) {
    //         return;
    //     }
    // }, [router, data, status]);

    if (!showChild) {
        return null;
    }

    if (typeof window === 'undefined') {
        return <></>;
    } else {
        return (
            <StyleAdminLayout className="sticky bg-black">
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                <Layout>
                    <AdminHeader
                        colorBgContainer={colorBgContainer}
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                    />
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                        }}
                    >
                        <div className={`${collapsed ? 'ml-[80px]' : 'ml-[80px]'} transition-all`}>{children}</div>
                    </Content>
                </Layout>
            </StyleAdminLayout>
        );
    }
};

export default LayoutAdmin;
