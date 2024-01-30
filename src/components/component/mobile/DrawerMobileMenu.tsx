import {
    FolderOutlined,
    MenuOutlined,
    SearchOutlined,
    ShopOutlined,
    LoadingOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import { Drawer, Menu, MenuProps, Tabs, TabsProps } from 'antd';
import Link from 'next/link';
import { FormEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import instance from '@/lib/axios';
import { useDebounce } from '@/hooks/useDebounce';
import { ExtandProduct } from '@/types/extend';
import { formartUSD } from '@/utils/formartUSD';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Category, Region } from '@prisma/client';

type Props = {};

const { TabPane } = Tabs;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: any[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const StyleDrawer = styled(Drawer)`
    .ant-drawer-header {
        padding: 0;
    }

    .ant-drawer-body {
        padding: 0;
    }

    .ant-drawer-header-title {
        .ant-drawer-close {
            display: none;
        }
    }
`;

const StyleTabs = styled(Tabs)`
    .ant-tabs-nav {
        &::before {
            border-color: transparent;
        }
    }

    .ant-tabs-nav-wrap {
        flex: 1 !important;
        width: 100%;
        .ant-tabs-nav-list {
            width: 100%;
            flex: 1;

            .ant-tabs-tab {
                width: 50%;

                .ant-tabs-tab-btn {
                    color: #fff;
                    text-align: center;
                    width: 100%;
                }
            }

            .ant-tabs-ink-bar {
                background-color: #6eb89f;
            }
        }
    }
`;

const StyleSubMenu = styled(Menu)`
    background-color: #000;

    .ant-menu-submenu-arrow {
        color: #fff;
    }

    .ant-menu-item-selected {
        background-color: #000 !important;
    }

    .ant-menu-item-selected .ant-menu-title-content {
        color: #000;
    }
    .ant-menu {
        .ant-menu-submenu .ant-menu-submenu-inline .ant-menu-submenu-open {
            &:focus-visible {
                border-color: #000 !important;
            }
        }

        .ant-menu-item {
            padding-left: 24px !important;
        }

        .ant-menu-item-icon {
            color: #fff;
            font-size: 20px;
        }

        .ant-menu-item-selected {
            background-color: transparent;
        }
    }
`;

const DrawerMobileMenu = ({}: Props) => {
    const { data: authData } = useSession();

    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [input, setInput] = useState<string>('');
    const [data, setData] = useState<ExtandProduct[]>([]);
    const [showData, setShowData] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [tab, setTab] = useState<string>('1');

    const debounce = useDebounce(input, 1000);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const shouldLog = useRef(true);

    const makeRequest = async () => {
        try {
            setLoading(true);

            if (input === '') {
                setData([]);
            } else {
                const res = await instance.get(`/api/pl/search?q=${encodeURIComponent(input)}`);
                setData(res.data);
            }
        } catch (error) {
            setLoading(true);
        } finally {
            setLoading(false);
        }
    };

    const makeRequestCharacter = async () => {
        instance
            .get('/api/pl/region')
            .then((res) => setRegions(res.data))
            .catch((err) => err);
    };

    const handleChange = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        setInput(target.value);
    };

    const handleClear = () => {
        setInput('');
        setData([]);
        inputRef.current?.focus();
    };

    // Effected

    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
        } else {
            if (debounce?.length === 0) {
                setShowData(false);
                setData([]);
            } else {
                setShowData(true);
                makeRequest();
            }
        }
    }, [debounce]);

    useEffect(() => {
        const makeRequest = async () => {
            await instance.get('/api/pl/category').then((res) => setCategories(res.data));
        };

        if (shouldLog.current) {
            shouldLog.current = false;
        } else {
            makeRequest();
            makeRequestCharacter();
        }
    }, []);

    // Handle

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.push(`/shop?q=${input}`);
        setOpen(false);
    };

    const items: MenuProps['items'] = [
        getItem(
            <Link className="text-sm py-4 !text-white font-semibold uppercase block hover:text-white" href={'/'}>
                TIN TỨC VÀ SỰ KIỆN
            </Link>,
            'sub1',
            null,
            [
                getItem(
                    <Link className="text-sm py-4 !text-white font-normal block hover:text-white" href={'/'}>
                        News
                    </Link>,
                    'g1',
                ),
                getItem(
                    <Link className="text-sm py-4 !text-white font-normal block hover:text-white" href={'/'}>
                        Latest Game Merchandise
                    </Link>,
                    'g2',
                ),
                getItem(
                    <Link className="text-sm py-4 !text-white font-normal block hover:text-white" href={'/'}>
                        Wish Banner
                    </Link>,
                    'g3',
                ),
                getItem(
                    <Link className="text-sm py-4 !text-white font-normal block hover:text-white" href={'/'}>
                        Promotion Code
                    </Link>,
                    'g4',
                ),
            ],
        ),

        getItem(
            <Link className="text-sm py-4 !text-white uppercase font-semibold block hover:text-white" href={'/shop'}>
                Cửa Hàng
            </Link>,
            'sub2',
            <ShopOutlined className="!text-lg !text-white" />,
        ),

        getItem(
            <Link
                className="text-sm py-4 !text-white uppercase font-semibold block hover:text-white"
                href={'/characters'}
            >
                Nhân Vật
            </Link>,
            'sub3',
            null,
            [
                ...regions?.map((region) => {
                    return getItem(
                        <Link
                            className="text-sm py-4 !text-white font-normal block hover:text-white"
                            href={`/characters?regionId=${region.id}`}
                        >
                            {region.name}
                        </Link>,
                        `${region.id}`,
                        <FolderOutlined />,
                    );
                }),
            ],
        ),

        getItem(
            !authData ? (
                <Link className="text-sm py-4 !text-white font-normal block uppercase hover:text-white" href={'/login'}>
                    Đăng nhập
                </Link>
            ) : (
                <Link
                    className="text-sm py-4 !text-white font-normal block uppercase hover:text-white"
                    href={'/my-account/dashboard'}
                >
                    Tài khoản
                </Link>
            ),
            'my-account',
            null,
            !authData
                ? undefined
                : [
                      {
                          key: 'dashboard',
                          label: (
                              <Link className="!text-white" href={'/my-account/dashboard'}>
                                  Bảng điều khiển
                              </Link>
                          ),
                      },
                      {
                          key: 'orders',
                          label: (
                              <Link className="!text-white" href={'/my-account/orders'}>
                                  Đơn hàng
                              </Link>
                          ),
                      },
                      {
                          key: 'details',
                          label: (
                              <Link className="!text-white" href={'/my-account/details'}>
                                  Tài khoản
                              </Link>
                          ),
                      },
                      {
                          key: 'address',
                          label: (
                              <Link className="!text-white" href={'/my-account/address'}>
                                  Địa chỉ
                              </Link>
                          ),
                      },
                      {
                          key: 'wishlist',
                          label: (
                              <Link className="!text-white" href={'/my-account/dashboard'}>
                                  Yêu thích
                              </Link>
                          ),
                      },
                      {
                          key: 'logout',
                          label: (
                              <button className="text-white" onClick={() => signOut()}>
                                  Logout
                              </button>
                          ),
                      },
                  ],
        ),
    ];

    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: (
                <h1 className="text-center text-sm uppercase hover:text-content transition-all duration-75 w-full">
                    Menu
                </h1>
            ),
            children: (
                <StyleSubMenu
                    // className="ant-menu-mobile-custom"
                    mode="inline"
                    theme="dark"
                    items={items}
                ></StyleSubMenu>
            ),
        },
        {
            key: '2',
            label: (
                <h1 className="text-center text-sm uppercase hover:text-content transition-all duration-75 w-full">
                    Danh mục
                </h1>
            ),
            children: (
                <ul>
                    {categories.length > 0 &&
                        categories?.map((cate) => (
                            <Link
                                key={cate.id}
                                className="!text-white uppercase block py-2 px-4 font-semibold"
                                href={`/shop?categoryId=${cate.id}`}
                                onClick={onClose}
                            >
                                {cate.name}
                            </Link>
                        ))}
                </ul>
            ),
        },
    ];

    const onChange = (key: string) => {
        setTab(key);
    };

    return (
        <div>
            <button className="flex active:opacity-80" onClick={showDrawer}>
                <MenuOutlined className="text-lg" />
            </button>

            <StyleDrawer
                style={{ backgroundColor: 'black', padding: 0, zIndex: 9999, position: 'relative' }}
                placement="left"
                width={300}
                title={
                    <div className="w-full relative flex items-center h-[70px]">
                        <form onSubmit={handleSubmit} action={`/shop?q=${input}`}>
                            <div className="flex items-center">
                                <label className="flex items-center pl-4 pr-8">
                                    <input
                                        onChange={handleChange}
                                        value={input}
                                        placeholder="Tìm kiếm sản phẩm"
                                        required
                                        className="w-full bg-transparent outline-none text-nav text-base"
                                    />
                                    {input?.length > 0 && (
                                        <button className="absolute right-11" type="button" onClick={handleClear}>
                                            <CloseCircleOutlined className="text-base text-nav" />
                                        </button>
                                    )}
                                </label>
                                <button type="submit" className="absolute text-nav right-0 p-3">
                                    {loading ? (
                                        <LoadingOutlined className="text-lg" />
                                    ) : (
                                        <SearchOutlined className="text-lg" />
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="bg-white left-0 right-0 absolute z-10 grid grid-cols-1 top-full max-h-[375px] overflow-y-auto">
                            {showData &&
                                data?.length > 0 &&
                                data.map((product) => {
                                    const sale = product?.price! - (product?.price! * product?.saleOff!) / 100;

                                    if (product.type === 'variant') {
                                        return (
                                            <div key={product.id} className="pt-4 pb-4 px-4 border-b border-gray-200">
                                                <div className="flex gap-x-2 text-xs">
                                                    <img
                                                        width={45}
                                                        height={45}
                                                        src={`/uploads/${product?.images?.[0]}`}
                                                        alt="product"
                                                    />
                                                    <div>
                                                        <Link
                                                            href={`/single/${product?.category?.id}/${product?.id}`}
                                                            onClick={onClose}
                                                            className="font-semibold line-clamp-2 mr-1"
                                                        >
                                                            {product.name}
                                                        </Link>
                                                        <p className="font-semibold mt-1">
                                                            <span className="text-primary">
                                                                {formartUSD(product?.variants?.[0].price!)}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={product.id} className="pt-4 pb-4 px-4 border-b border-gray-200">
                                                <div className="flex gap-x-2 text-xs">
                                                    <img
                                                        width={45}
                                                        height={45}
                                                        src={`/uploads/${product.images![0]}`}
                                                        alt="product"
                                                    />
                                                    <div>
                                                        <Link
                                                            href={`/single/${product?.category?.id}/${product?.id}`}
                                                            onClick={onClose}
                                                            className="font-semibold line-clamp-2 mr-1"
                                                        >
                                                            {product.name}
                                                        </Link>
                                                        <p className="font-semibold mt-1">
                                                            {product.saleOff ? (
                                                                <>
                                                                    <span className="text-primary">
                                                                        {formartUSD(sale)}
                                                                    </span>
                                                                    <span className="line-through text-gray-400 ml-1">
                                                                        {formartUSD(product?.price!)}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="text-primary">
                                                                    {formartUSD(product?.price!)}
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
                        </div>
                    </div>
                }
                open={open}
                onClose={onClose}
            >
                <StyleTabs
                    onChange={onChange}
                    destroyInactiveTabPane={true}
                    defaultActiveKey="1"
                    accessKey={tab}
                    tabBarStyle={{ display: 'flex', justifyContent: 'center' }}
                    items={tabs}
                />
            </StyleDrawer>
        </div>
    );
};

export default DrawerMobileMenu;
