'use client';

import { ArrowRightOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type Props = { children: ReactNode };

const Layout = ({ children }: Props) => {
    let path = usePathname();

    return (
        <>
            <div className="relative">
                <div className={`bg-header absolute top-0 left-0 right-0 bottom-0`}></div>
                <div className="lg:h-[120px] h-[60px] flex items-center justify-center relative">
                    <Breadcrumb
                        style={{
                            color: 'whitesmoke',
                        }}
                        separator={<ArrowRightOutlined className="text-white text-xl flex h-full items-center" />}
                    >
                        <Breadcrumb.Item
                            className={`uppercase text-xl text-white cursor-default font-semibold hover:!text-nav`}
                        >
                            <span className="line-clamp-1 text-center">{path.slice(1)}</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            {children}
        </>
    );
};

export default Layout;
