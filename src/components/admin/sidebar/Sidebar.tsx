'use client';
import { BoldOutlined, FolderOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import {
    MdDashboard,
    MdAddBox,
    MdCategory,
    MdShop,
    MdAutoDelete,
    MdRestoreFromTrash,
    MdLogout,
    MdTimeline,
    MdCreateNewFolder,
    MdPerson,
} from 'react-icons/md';
import { IoColorPaletteSharp, IoOptionsOutline } from 'react-icons/io5';
import { VscTextSize } from 'react-icons/vsc';
import { IoMdOptions } from 'react-icons/io';
import { RiCharacterRecognitionFill } from 'react-icons/ri';

import { Layout, Menu, Button } from 'antd';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styled from 'styled-components';

const { Sider } = Layout;

type Props = {
    collapsed: boolean;
    setCollapsed: Dispatch<SetStateAction<boolean>>;
};

const StyleSidebar = styled(Sider)`
    overflow-y: auto;
    background-color: #000 !important;
    position: fixed !important;
    z-index: 1;

    .ant-menu-item-selected {
        background-color: #6eb89f;
        border-radius: 0;
        margin: 0;
        width: 100%;
    }

    .ant-layout-sider-children {
        height: 100vh;
        background-color: #000 !important;
    }
`;

const Sidebar = ({ collapsed, setCollapsed }: Props) => {
    let path = usePathname();
    const router = useRouter();

    const [current, setCurrent] = useState(
        path === '/admin/dashboard' || path === '/admin/dashboard' ? '/admin/dashboard' : path,
    );

    useEffect(() => {
        if (path) {
            if (current !== path) {
                setCurrent(path);
            }
        }
    }, [path, current]);

    const handleClick = (e: any) => {
        setCurrent(e.key);
    };

    return (
        <div>
            <StyleSidebar
                trigger={null}
                collapsible
                onCollapse={(value) => setCollapsed(value)}
                collapsed={collapsed}
                theme={`dark`}
                className={`bg-black`}
            >
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                        position: 'absolute',
                        zIndex: 99,
                        right: -60,
                    }}
                />
                <div onMouseOver={() => setCollapsed(false)} onMouseLeave={() => setCollapsed(true)}>
                    <div className="flex justify-center bg-black px-4 py-2 m-0 text-sm whitespace-nowrap  text-slate-700">
                        <img src={'../emoji-sucrose-ok.webp'} className="w-full shadow " alt="" />
                    </div>
                    <Menu
                        onClick={handleClick}
                        theme="dark"
                        mode="inline"
                        className="antd-menu-custom bg-black"
                        selectedKeys={[current]}
                        items={[
                            {
                                key: 'dashboard',
                                icon: <MdDashboard />,
                                label: <Link href={'/admin/dashboard'}>Quản lý</Link>,
                            },
                            {
                                key: 'user',
                                icon: <MdPerson />,
                                label: <Link href={'/admin/user'}>Người dùng</Link>,
                            },
                            {
                                key: 'products',
                                icon: <MdAddBox />,
                                label: <Link href={'/admin/products'}>Sản phẩm</Link>,
                                children: [
                                    {
                                        key: 'create/product',
                                        icon: <MdCreateNewFolder />,
                                        label: <Link href={'/admin/products/create'}>Thêm</Link>,
                                    },
                                ],
                            },
                            {
                                key: 'variants',
                                icon: <IoOptionsOutline />,
                                label: <label>Biến thể</label>,
                                children: [
                                    {
                                        key: 'variants/colors',
                                        icon: <IoColorPaletteSharp />,
                                        label: <Link href={'/admin/variants/colors'}>Màu sắc</Link>,
                                    },
                                    {
                                        key: 'variants/sizes',
                                        icon: <VscTextSize />,
                                        label: <Link href={'/admin/variants/sizes'}>Kích cỡ</Link>,
                                    },
                                ],
                            },
                            {
                                key: 'options',
                                icon: <IoMdOptions />,
                                label: <label>Mở rộng</label>,
                                children: [
                                    {
                                        key: 'category',
                                        icon: <MdCategory />,
                                        label: <Link href={'/admin/options/categories'}>Danh mục</Link>,
                                    },
                                    {
                                        key: 'brand',
                                        icon: <BoldOutlined />,
                                        label: <Link href={'/admin/options/brands'}>Thương hiệu</Link>,
                                    },
                                ],
                            },
                            {
                                key: 'characters',
                                icon: <RiCharacterRecognitionFill />,
                                label: <Link href={'/admin/characters'}>Nhân vật</Link>,
                                children: [
                                    {
                                        key: 'create/characters',
                                        icon: <FolderOutlined />,
                                        label: <Link href={'/admin/characters/create'}>Thêm</Link>,
                                    },
                                    {
                                        key: 'characters/regions',
                                        icon: <FolderOutlined />,
                                        label: <Link href={'/admin/characters/regions'}>Regions</Link>,
                                    },
                                    {
                                        key: 'characters/visions',
                                        icon: <FolderOutlined />,
                                        label: <Link href={'/admin/characters/visions'}>Visions</Link>,
                                    },
                                    {
                                        key: 'characters/weapons',
                                        icon: <FolderOutlined />,
                                        label: <Link href={'/admin/characters/weapons'}>Weapons</Link>,
                                    },
                                ],
                            },
                            {
                                key: 'orders',
                                icon: <MdShop />,
                                label: <Link href={'/admin/orders'}>Đặt hàng</Link>,
                                children: [
                                    {
                                        key: 'order/timeline',
                                        icon: <MdTimeline />,
                                        label: <Link href={'/admin/time-lines'}>Time Line</Link>,
                                    },
                                ],
                            },
                            {
                                key: 'trash/product',
                                icon: <MdAutoDelete />,
                                label: <Link href={'/admin/trash/product'}>Thùng rác</Link>,
                            },
                            {
                                key: 'trash/order',
                                icon: <MdRestoreFromTrash />,
                                label: <Link href={'/admin/trash/order'}>Đơn hàng đã xóa</Link>,
                            },
                            {
                                key: 'admin/logout',
                                icon: <MdLogout />,
                                label: (
                                    <button
                                        onClick={() => {
                                            signOut();
                                            router.push('/');
                                        }}
                                    >
                                        Đăng xuất
                                    </button>
                                ),
                            },
                        ]}
                    />
                </div>
            </StyleSidebar>
        </div>
    );
};

export default Sidebar;
