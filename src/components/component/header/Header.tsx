'use client';

import Image from 'next/image';
import Link from 'next/link';
import DrawerMobileMenu from '../mobile/DrawerMobileMenu';
import DrawerCart from '../modal/cart/DrawerCart';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { CloudDownloadOutlined, FolderFilled, HeartOutlined, ShopFilled } from '@ant-design/icons';
import { useWindowOffsetHeight } from '@/hooks/useWindowDimensions';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import styled from 'styled-components';
import Wrapper from '@/components/local/Wrapper';
import SearchMenu from '../search/SearchMenu';

const items: MenuProps['items'] = [
    {
        key: 'all-news',
        label: (
            <Link className="font-normal hover:!text-primary text-content text-sm" href={'/'}>
                All News
            </Link>
        ),
    },
    {
        key: 'game',
        label: (
            <Link className="font-normal hover:!text-primary text-content text-sm" href={'/'}>
                Latest Game Merchandise
            </Link>
        ),
    },
    {
        key: 'wish',
        label: (
            <Link className="font-normal hover:!text-primary text-content text-sm" href={'/'}>
                Wish Banner
            </Link>
        ),
    },
    {
        key: 'code',
        label: (
            <Link className="font-normal hover:!text-primary text-content text-sm" href={'/'}>
                Promotion Code
            </Link>
        ),
    },
];

const characters: MenuProps['items'] = [
    {
        key: 'All Characters',
        label: (
            <Link href={'/characters'} className="hover:!text-primary">
                Tất cả nhân vật
            </Link>
        ),
        icon: <FolderFilled className="!text-lg text-nav" />,
    },
    {
        key: 'Mondstadt',
        label: (
            <Link href={'/'} className="hover:!text-primary">
                Mondstadt
            </Link>
        ),
        icon: <FolderFilled className="!text-lg text-nav" />,
    },
    {
        key: 'Liyue',
        label: (
            <Link href={'/'} className="hover:!text-primary">
                Liyue
            </Link>
        ),
        icon: <FolderFilled className="!text-lg text-nav" />,
    },
    {
        key: 'Inazuma',
        label: (
            <Link href={'/'} className="hover:!text-primary">
                Inazuma
            </Link>
        ),
        icon: <FolderFilled className="!text-lg text-nav" />,
    },
    {
        key: 'Sumeru',
        label: (
            <Link href={'/'} className="hover:!text-primary">
                Sumeru
            </Link>
        ),
        icon: <FolderFilled className="!text-lg text-nav" />,
    },
    {
        key: 'Fontaine',
        label: (
            <Link href={'/'} className="hover:!text-primary">
                Fontaine
            </Link>
        ),
        icon: <FolderFilled className="!text-lg text-nav" />,
    },
    {
        key: 'Traveler',
        label: (
            <Link href={'/'} className="hover:!text-primary">
                Traveler
            </Link>
        ),
    },
    {
        key: 'Paimon',
        label: (
            <Link href={'/'} className="hover:!text-primary">
                Paimon
            </Link>
        ),
    },
    {
        key: 'Eleven Fatui Harbingers',
        label: (
            <Link href={'/'} className="hover:!text-primary">
                Eleven Fatui Harbingers
            </Link>
        ),
    },
];

const worlds: MenuProps['items'] = [
    {
        key: 'regions',
        label: <button className="text-content hover:text-primary">Vùng đất</button>,
        children: [
            {
                key: 'monst',
                label: <Link href={'/'}>Mondstadt</Link>,
            },
            {
                key: 'Liyue',
                label: <Link href={'/'}>Liyue</Link>,
            },
            {
                key: 'Inazuma',
                label: <Link href={'/'}>Inazuma</Link>,
            },
            {
                key: 'Sumeru',
                label: <Link href={'/'}>Sumeru</Link>,
            },
            {
                key: 'Fontaine',
                label: <Link href={'/'}>Fontaine</Link>,
            },
        ],
    },
    {
        key: '',
        label: <button className="text-content hover:text-primary">Vũ khí</button>,
        children: [
            {
                key: 'Bows',
                label: <Link href={'/'}>Cung</Link>,
            },
            {
                key: 'Catalysts',
                label: <Link href={'/'}>Pháp khí</Link>,
            },
            {
                key: 'Claymores',
                label: <Link href={'/'}>Đại kiếm</Link>,
            },
            {
                key: 'Polearms',
                label: <Link href={'/'}>Vũ khí cán dài</Link>,
            },
            {
                key: 'Swords',
                label: <Link href={'/'}>Kiếm đơn</Link>,
            },
        ],
    },
];

const fanArts: MenuProps['items'] = [
    {
        label: <Link href={'/'}>Fanart Illustrators</Link>,
        key: 'fan art',
        icon: <HeartOutlined className="!text-lg" />,
    },
    {
        label: <Link href={'/'}>Official Wallpapers</Link>,
        key: 'wallpaper',
        icon: <CloudDownloadOutlined className="!text-lg" />,
    },
    {
        label: <Link href={'/'}>Gallery: Official Art</Link>,
        key: 'Official',
    },
    {
        label: <Link href={'/'}>Gallery: All Artworks</Link>,
        key: 'Artworks',
    },
];

const about: MenuProps['items'] = [
    {
        label: <Link href={'/'}>Genshin Impact</Link>,
        key: 'gi',
        icon: <HeartOutlined />,
    },
    {
        label: <Link href={'/'}>Manga</Link>,
        key: 'manga',
        icon: <CloudDownloadOutlined />,
    },
    {
        label: <Link href={'/'}>Genius Invokation Trading Card Game (TCG)</Link>,
        key: 'tcg',
    },
    {
        label: <Link href={'/'}>Game Versions</Link>,
        key: 'gv',
    },
];

const AUTHENTICATED_ITEMS: MenuProps['items'] = [
    {
        key: 'dashboard',
        label: <Link href={'/my-account/dashboard'}>Bảng điều khiển</Link>,
    },
    {
        key: 'orders',
        label: <Link href={'/my-account/orders'}>Đơn hàng của bạn</Link>,
    },
    {
        key: 'details',
        label: <Link href={'/my-account/details'}>Chi tiết tài khoản</Link>,
    },
    {
        key: 'wishlist',
        label: <Link href={'/my-account/dashboard'}>Yêu thích</Link>,
    },
    {
        key: 'logout',
        label: <button onClick={() => signOut()}>Đăng xuất</button>,
    },
];

const StyleDropdown = styled(Dropdown)`
    .ant-dropdown-menu .ant-dropdown-menu-item {
        &:hover {
            background-color: transparent;
        }
    }
`;

const Header = () => {
    const headerHeight = 90;

    const { status, data } = useSession();

    const { offset } = useWindowOffsetHeight();

    const router = usePathname();
    let rootPathname = '/';

    return (
        <div className="relative">
            {router === rootPathname ||
            router === '/shopping-cart' ||
            router.startsWith('/shop') ||
            router.startsWith('/characters') ? (
                <div className={`bg-header absolute top-0 left-0 right-0 bottom-0`}></div>
            ) : null}
            <Wrapper className="px-0 mt-0 mb-0 bg-white z-[999]">
                {/* Tablet and Window Interface start */}

                <AnimatePresence>
                    <motion.div
                        className={`hidden mx-auto max-w-full ${
                            offset > 90 && '!fixed z-50 top-0 left-0 right-0 !h-[60px]'
                        } relative bg-white z-50 lg:flex justify-between items-center h-[90px] lg:h-[${headerHeight}px] shadow-sm`}
                    >
                        <div className="flex w-layout px-2 mx-auto max-w-full justify-between items-center bg-white">
                            <Link href={'/'}>
                                <Image src={'/logo.webp'} alt="logo" width={180} height={36} />
                            </Link>

                            {/* Nav start */}
                            {/* <Menu mode="horizontal" items={items} /> */}

                            <StyleDropdown className="styled-dropdown" menu={{ items }}>
                                <Link
                                    href={'/'}
                                    className="uppercase block leading-[46px] font-semibold !text-content text-sm hover:!text-primary hover:drop-shadow"
                                >
                                    TIN tức và sự kiện
                                </Link>
                            </StyleDropdown>

                            <StyleDropdown menu={{ items: characters }}>
                                <Link
                                    href={'/characters'}
                                    className="uppercase block leading-[46px] font-semibold !text-content text-sm hover:!text-primary hover:drop-shadow"
                                >
                                    Nhân vật
                                </Link>
                            </StyleDropdown>

                            <StyleDropdown menu={{ items: worlds }}>
                                <Link
                                    href={'/'}
                                    className="uppercase block leading-[46px] font-semibold !text-content text-sm hover:!text-primary hover:drop-shadow"
                                >
                                    Thế giới
                                </Link>
                            </StyleDropdown>

                            <StyleDropdown menu={{ items: fanArts }}>
                                <Link
                                    href={'/'}
                                    className="uppercase block leading-[46px] font-semibold !text-content text-sm hover:!text-primary hover:drop-shadow"
                                >
                                    Tranh vẽ
                                </Link>
                            </StyleDropdown>

                            <StyleDropdown menu={{ items: about }}>
                                <Link
                                    href={'/about'}
                                    className="uppercase block leading-[46px] font-semibold !text-content text-sm hover:!text-primary hover:drop-shadow"
                                >
                                    Về chúng tôi
                                </Link>
                            </StyleDropdown>

                            {/* Nav  end */}

                            {/* Action start */}

                            <ul className="flex items-center gap-x-4">
                                <li>
                                    <Link href={'/shop'} className="flex font-semibold text-primary gap-x-2">
                                        <span>
                                            <ShopFilled />
                                        </span>
                                        <span>SHOP</span>
                                    </Link>
                                </li>
                                <li>
                                    {status === 'authenticated' ? (
                                        <Dropdown placement="topRight" arrow menu={{ items: AUTHENTICATED_ITEMS }}>
                                            <Link href={'/my-account/dashboard'} className="">
                                                TÀI KHOẢN
                                            </Link>
                                        </Dropdown>
                                    ) : (
                                        <Link href={'/login'} className="">
                                            ĐĂNG NHẬP
                                        </Link>
                                    )}
                                </li>
                                <li>
                                    {/* Search start*/}

                                    <SearchMenu />

                                    {/* Search end*/}
                                </li>
                                <li className="relative">
                                    <Link href={'/my-favourite'}>
                                        <HeartOutlined className="text-content text-xl" />
                                        <span className="bg-primary -right-2 -top-2 rounded-full text-white absolute w-4 text-center leading-4 h-4">
                                            0
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <DrawerCart />
                                </li>
                            </ul>
                        </div>

                        {/* Action end */}
                    </motion.div>
                </AnimatePresence>

                {/* Mobile Interface start */}
                <AnimatePresence>
                    <motion.div
                        className={`flex ${
                            offset > headerHeight && '!fixed px-2'
                        } justify-between top-0 left-0 right-0 bg-white lg:hidden items-center h-[60px] shadow-sm`}
                    >
                        {/* Mobile Menu Drawer start */}
                        <DrawerMobileMenu />
                        {/* Mobile Menu Drawer end */}

                        <Link href={'/'}>
                            <Image src={'/logo.webp'} alt="logo" width={180} height={36} />
                        </Link>

                        <DrawerCart />
                    </motion.div>
                </AnimatePresence>
                {/* Mobile Interface end */}
            </Wrapper>
        </div>
    );
};

export default Header;
