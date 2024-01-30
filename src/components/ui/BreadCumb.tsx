'use client';

import { ArrowRightOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { useParams, usePathname } from 'next/navigation';
type Props = {
    label?: string;
};
const BreadCumb = ({ label }: Props) => {
    let path = usePathname();

    return (
        <div className="relative">
            <div className={`bg-header absolute top-0 left-0 right-0 bottom-0`}></div>
            <div className="lg:h-[120px] flex-col h-[60px] flex items-center justify-center relative overflow-hidden">
                <h1 className="text-white mb-2 text-xl inline-block leading-4 items- font-semibold">SHOP</h1>
                <Breadcrumb
                    style={{
                        color: 'whitesmoke',
                        fontSize: 16,
                    }}
                    separator={<ArrowRightOutlined className="text-white text-xl flex h-full items-center" />}
                >
                    <Breadcrumb.Item
                        className={`uppercase text-base lg:text-3xl text-white cursor-default font-semibold hover:!text-nav`}
                    >
                        {label}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
        </div>
    );
};

export default BreadCumb;
