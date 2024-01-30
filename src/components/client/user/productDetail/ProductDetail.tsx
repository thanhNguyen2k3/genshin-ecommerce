'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, Thumbs } from 'swiper/modules';
import { ExtandProduct } from '@/types/extend';
import { formartUSD } from '@/utils/formartUSD';
import { Divider, Tabs, Tooltip, message } from 'antd';
import Link from 'next/link';
import { HeartOutlined } from '@ant-design/icons';
import {
    BiLogoFacebook,
    BiLogoGmail,
    BiLogoPinterestAlt,
    BiLogoTelegram,
    BiLogoTwitter,
    BiLogoWhatsapp,
} from 'react-icons/bi';
import { useAppDispatch } from '@/store/hook';
import { add } from '@/slices/cart';
import styled from 'styled-components';
import DividerFading from '@/components/ui/DividerFading';
import { usePathname, useRouter } from 'next/navigation';

type Props = {
    product: ExtandProduct;
    productHots?: ExtandProduct[];
};

const { TabPane } = Tabs;

const networks = [
    {
        id: 1,
        icon: <BiLogoFacebook />,
        link: '',
    },
    {
        id: 2,
        icon: <BiLogoTwitter />,
        link: '',
    },
    {
        id: 3,
        icon: <BiLogoGmail />,
        link: '',
    },
    {
        id: 4,
        icon: <BiLogoPinterestAlt />,
        link: '',
    },
    {
        id: 5,
        icon: <BiLogoWhatsapp />,
        link: '',
    },
    {
        id: 6,
        icon: <BiLogoTelegram />,
        link: '',
    },
];

const StyleSwiperColumnLeft = styled(Swiper)`
    .swiper-wrapper {
        display: grid;
        grid-row-gap: 10px;

        .swiper-slide {
            width: 100% !important;
        }
    }
`;

const StyleSwiperColumnRight = styled(Swiper)`
    .swiper-button-next {
        color: #333;
    }

    .swiper-button-prev {
        color: #333;
    }
`;

const StyleDescription = styled.div`
    margin-top: 32px;
    padding: 0px 16px;

    h2 {
        font-size: 24px;
        font-weight: 600;
    }

    h4 {
        font-size: 20px;
        font-weight: 500;
    }

    h6 {
        font-weight: 600;
        font-size: 13px;
    }

    ul li {
        font-size: 14px;
        list-style-type: circle;
        margin-left: 16px;
    }

    ol li {
        font-size: 14px;
        list-style-type: decimal;
        margin-left: 16px;
    }

    iframe {
        width: 100%;
        height: 400px;
    }
`;

const StyleTabs = styled(Tabs)`
    .ant-tabs-nav-wrap {
        justify-content: center;

        .ant-tabs-ink-bar {
            background-color: #6eb89f;
            padding: 1px 0;
        }
    }

    .ant-tabs-tab-btn {
        color: #222 !important;

        &:hover {
            color: #000;
        }
    }

    .ant-tabs-tab-active {
        .ant-tabs-tab-btn {
            color: #000 !important;
        }
    }
`;

const ProductDetail = ({ product, productHots }: Props) => {
    const dispatch = useAppDispatch();
    const pathName = usePathname();

    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);

    // Viriant
    const [size, setSize] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [optionName, setOptionName] = useState<string>('');
    const [defaultImage, setDefaultImage] = useState<string>('');
    const [price, setPrice] = useState(0);
    const [filterByColorAndSize, setFilterByColorAndSize] = useState<any>();
    const [variantId, setVariantId] = useState<string>('');
    const [priceSwap, setPriceSwap] = useState(product.variants[0]?.price);
    const [inventory, setInventory] = useState<null | number>(null);

    const checkOptionName = product?.variants?.find((variant) => variant?.optionName);
    const sale = product?.price! - (product?.price! * product?.saleOff!) / 100;

    useEffect(() => {
        if (product?.sizes?.length! > 0 && product?.colors?.length! > 0) {
            const filter = product?.variants.find(
                (variant) => variant.color?.name! === color && variant.size?.value! === size,
            );

            setFilterByColorAndSize(filter);
            setInventory(filter?.inventory!);
        } else if (product?.sizes?.length! > 0) {
            const filter = product?.variants.find((variant) => variant.size?.value! === size);

            setFilterByColorAndSize(filter);
            setInventory(filter?.inventory!);
        }
    }, [size, color]);

    const myDate = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000);
    const initDate = product?.createdAt?.getTime().toString();

    // Add to cart

    const handleAddToCartWithOption = (e: any) => {
        e.preventDefault();
        if (product.type === 'variant') {
            if (product?.sizes?.length! > 0 && product?.colors?.length! > 0) {
                if (size === '' || color === '') {
                    message.info('Hãy hoàn tất lựa chọn của bạn');
                } else {
                    setSize('');
                    setColor('');
                    setOptionName('');
                    setDefaultImage('');
                    window.location.href = pathName;
                    return dispatch(
                        add({
                            ...product!,
                            quantity: quantity,
                            option: {
                                color: color! || null!,
                                size: size! || null!,
                                optionName: optionName! || null!,
                            },
                            image: defaultImage || filterByColorAndSize?.image,
                            price: price || filterByColorAndSize.price,
                            variantId: variantId || filterByColorAndSize.id,
                        }),
                    );
                }
            } else if (product?.sizes?.length! > 0 && product?.colors?.length === 0) {
                if (size === '') {
                    message.info('Hãy hoàn tất lựa chọn của bạn');
                } else {
                    setSize('');
                    setColor('');
                    setOptionName('');
                    setDefaultImage('');
                    window.location.href = pathName;
                    return dispatch(
                        add({
                            ...product!,
                            quantity: quantity,
                            option: {
                                color: color! || null!,
                                size: size! || null!,
                                optionName: optionName! || null!,
                            },
                            image: defaultImage || filterByColorAndSize?.image,
                            price: price || filterByColorAndSize?.price,
                            variantId: variantId || filterByColorAndSize?.id,
                        }),
                    );
                }
            } else {
                if (optionName === '') {
                    message.info('Hãy hoàn tất lựa chọn của bạn');
                } else {
                    setSize('');
                    setColor('');
                    setOptionName('');
                    setDefaultImage('');
                    window.location.href = pathName;
                    return dispatch(
                        add({
                            ...product!,
                            quantity: quantity,
                            option: {
                                color: color! || null!,
                                size: size! || null!,
                                optionName: optionName! || null!,
                            },
                            image: defaultImage || filterByColorAndSize?.image,
                            price: price || filterByColorAndSize.price,
                            variantId: variantId || filterByColorAndSize.id,
                        }),
                    );
                }
            }
        } else {
            if (product?.saleOff! > 0) {
                dispatch(
                    add({ ...product!, quantity: quantity, image: product?.images[0], price: product?.price! - sale! }),
                );
                window.location.href = pathName;
            } else {
                dispatch(add({ ...product!, quantity: quantity, image: product?.images[0], price: product?.price! }));
                window.location.href = pathName;
            }
        }
    };

    return (
        <div className="bg-gray-50">
            <form className="grid lg:grid-cols-7 grid-cols-1 gap-x-6 px-4 gap-y-4" onSubmit={handleAddToCartWithOption}>
                <div className="col-span-3">
                    <div className="flex flex-row-reverse">
                        <StyleSwiperColumnRight
                            navigation={true}
                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="mySwiper2 lg:w-full w-[1000px]"
                        >
                            {product.images.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <img className="w-full h-full object-cover" src={`/uploads/${img}`} />
                                </SwiperSlide>
                            ))}
                        </StyleSwiperColumnRight>

                        <StyleSwiperColumnLeft
                            style={{ width: '20%', marginRight: 20 }}
                            onSwiper={setThumbsSwiper}
                            spaceBetween={10}
                            slidesPerView={3}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="swiper-small-custom mySwiper lg:!grid !hidden"
                        >
                            {product.images.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <img className="w-full h-full object-cover" src={`/uploads/${img}`} />
                                </SwiperSlide>
                            ))}
                        </StyleSwiperColumnLeft>
                    </div>
                </div>
                <div className="col-span-3 text-center font-semibold space-y-4">
                    <h1 className="text-3xl capitalize">{product.name}</h1>
                    {product.type === 'variant' ? (
                        <p className="text-primary text-xl">
                            <span>{formartUSD(priceSwap)}</span>
                        </p>
                    ) : (
                        <p className="text-primary text-xl">
                            <span>{formartUSD(sale)}</span>
                            {product?.saleOff && product?.saleOff > 0 && (
                                <span className="text-gray-300 line-through ml-2">{formartUSD(product?.price!)}</span>
                            )}
                        </p>
                    )}
                    <p className="text-sm">{product.category?.name}</p>
                    <p className="font-normal">{product.shortDes}</p>
                    <p>
                        Thông tin khác từ cùng một bộ:{' '}
                        <Link href={`/single/${product.category?.id}/${product.id}`} className="text-third font-normal">
                            {product.name}
                        </Link>
                    </p>
                    <div className="flex justify-center w-full">
                        <span className="border border-b border-nav/40 w-6"></span>
                    </div>

                    <p className="text-hot">
                        Ngày xuất cảnh dự kiến: {new Date(myDate + initDate)?.toLocaleDateString()}
                    </p>

                    <p className="font-normal text-xs text-left">
                        Vui lòng đọc <span className="text-[#ff00ff]">Điều khoản & Điều kiện</span> đặt hàng trước/đặt
                        hàng trước trước khi đặt hàng. Đặt hàng trước/đặt lại theo nghĩa đen là ký kết "hợp đồng" với
                        Genshin.Global, với tư cách là người bán có trách nhiệm, chúng tôi có nghĩa vụ đảm bảo bạn biết
                        các điều khoản.
                    </p>

                    {/* Type product start */}
                    {product.type === 'variant' ? (
                        <>
                            {product?.colors?.length > 0 && (
                                <div>
                                    {/* Type color */}
                                    <h1>Chọn màu:</h1>
                                    <ul className="flex justify-center  flex-wrap gap-x-2 gap-y-2 mt-2">
                                        {product.colors.map((col) => (
                                            <li key={col.id} className="">
                                                <input
                                                    className="peer sr-only"
                                                    type="radio"
                                                    onChange={(e) => setColor(e.target.value)}
                                                    value={col.color.name}
                                                    name="color"
                                                    id={`color-${col.id}`}
                                                    required={true}
                                                />

                                                <Tooltip title={`${col.color.name}`}>
                                                    <label
                                                        htmlFor={`color-${col.id}`}
                                                        className="cursor-pointer block rounded-full w-[30px] h-[30px] border border-gray-300 hover:border-gray-300 transition-all peer-checked:ring-2 peer-checked:ring-primary"
                                                        style={{ backgroundColor: col.color.value }}
                                                    ></label>
                                                </Tooltip>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {product?.sizes?.length > 0 && (
                                <div>
                                    <h3 className="text-center">Kích cỡ:</h3>

                                    <ul className="flex justify-center  flex-wrap gap-x-2 gap-y-2 mt-2">
                                        {product.sizes.map((size) => (
                                            <li key={size.id} className="">
                                                <input
                                                    className="peer sr-only"
                                                    type="radio"
                                                    onChange={(e) => setSize(e.target.value)}
                                                    value={size.size.value}
                                                    name="size"
                                                    id={`size-${size.id}`}
                                                    required={true}
                                                />
                                                <label
                                                    className="flex w-[45px] py-0.5 text-sm justify-center cursor-pointer border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-primary transition-all duration-500 ease-in-out"
                                                    htmlFor={`size-${size.id}`}
                                                >
                                                    {size?.size?.value}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {checkOptionName && (
                                <div>
                                    <h1 className="mb-2">Lựa chọn:</h1>
                                    <select
                                        onChange={(e) => {
                                            const split = e.target.value.split(',');
                                            setOptionName(split[0]);
                                            setDefaultImage(split[1]);
                                            setPrice(Number(split[2]));
                                            setVariantId(split[3]);
                                            setPriceSwap(Number(split[2]));
                                            setInventory(Number(split[4]));
                                        }}
                                        required={true}
                                        className="shadow text-center text-nav rounded group px-2 py-2 outline-none"
                                    >
                                        <option value="">-- Vui lòng chọn --</option>
                                        {product?.variants &&
                                            product?.variants.map((variant) => {
                                                return (
                                                    <option
                                                        key={variant.id}
                                                        value={[
                                                            variant?.optionName!,
                                                            variant?.image!,
                                                            variant?.price?.toString(),
                                                            variant.id,
                                                            variant?.inventory?.toString(),
                                                        ]}
                                                    >
                                                        {variant?.optionName}
                                                    </option>
                                                );
                                            })}
                                    </select>
                                </div>
                            )}
                        </>
                    ) : (
                        <div></div>
                    )}
                    {inventory && (
                        <div className="space-x-1">
                            {inventory <= 0 ? (
                                <span className="text-red-500">Hết hàng</span>
                            ) : (
                                <span>{inventory} sản phẩm</span>
                            )}
                        </div>
                    )}

                    {/* Type product end */}

                    <div className="flex justify-center gap-x-4 py-3">
                        <div>
                            <button
                                type="button"
                                className="border border-b px-2 py-2"
                                onClick={() => setQuantity(quantity - 1)}
                            >
                                -
                            </button>
                            <input
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                type="number"
                                className="outline-none py-2 px-2 w-14 border text-center"
                                min={1}
                            />
                            <button
                                type="button"
                                className="border px-2 py-2"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                        <button type="submit" className="px-4 bg-primary py-2 text-white">
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                    <button className="hover:text-nav">
                        <i>
                            <HeartOutlined />
                        </i>{' '}
                        Thêm vào danh sách yêu thích{' '}
                    </button>

                    <Divider style={{ backgroundColor: 'whitesmoke' }} />

                    <div className="space-y-2">
                        <p className="font-normal tracking-wider">
                            <span className="font-semibold">Thể loại: </span>
                            {product.category?.name}
                        </p>
                        <p className="font-normal tracking-wider">
                            <span className="font-semibold">Tags: </span>
                            {product.name}
                        </p>
                        <div className="font-normal tracking-wider flex items-center gap-x-2 justify-center">
                            <span className="font-semibold">Share: </span>
                            {networks.map((network) => (
                                <Link href={'/'} className="text-nav text-base" key={network.id}>
                                    {network.icon}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-span-1 border-l px-2 lg:block hidden">
                    <h1 className="mb-2 text-hot font-semibold">HOT products</h1>
                    {productHots?.map((prohot) => (
                        <div key={prohot.id}>
                            <div className="flex gap-x-1">
                                <img
                                    src={`/uploads/${prohot?.images?.[0]}`}
                                    alt=""
                                    className="w-[65px] h-[65px] block"
                                />
                                <div className="space-y-1">
                                    <Link
                                        href={`single/${prohot.category?.id}/${prohot.id}`}
                                        className="text-sm text-gray-800 font-semibold"
                                    >
                                        {prohot?.name.slice(0, 30)}...
                                    </Link>
                                    <p className="text-primary font-semibold">
                                        {prohot?.type === 'variant'
                                            ? formartUSD(prohot?.variants?.[0]?.price)
                                            : formartUSD(prohot?.price!)}{' '}
                                    </p>
                                </div>
                            </div>

                            <DividerFading fading />
                        </div>
                    ))}
                </div>
            </form>
            <br />
            <br />
            <DividerFading fading />

            <div className="max-w-full w-layout mx-auto mb-8">
                <StyleTabs defaultActiveKey="1">
                    <TabPane tab={<h1 className="uppercase font-semibold text-base">Mô tả chi tiết</h1>} key={'1'}>
                        <StyleDescription
                            className="space-y-1"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        ></StyleDescription>
                    </TabPane>
                    <TabPane key={'2'} tab={<h1 className="uppercase font-semibold text-base">Thông tin thêm</h1>}>
                        <div className="w-[650px] mx-auto">
                            <div className="flex justify-between">
                                <span className="text-sm font-semibold">Thương hiệu</span>
                                <span>miHoYo, Honkai: Star Rail</span>
                            </div>
                            <br />
                            <hr />
                            <br />
                            {product?.groupCharacter?.length! > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-sm font-semibold">Nhân vật</span>
                                    <span>
                                        {product.groupCharacter
                                            ?.map((group) => group.character.name)
                                            .join(', ')
                                            .toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <br />
                            {/* {product.options.length > 0 && (
                                <>
                                    <hr />
                                    <br />
                                    <div className="flex justify-between">
                                        <span className="text-sm font-semibold">Lựa chọn</span>
                                        <span>{product.options.map((item) => item.extraName).join(', ')}</span>
                                    </div>
                                </>
                            )} */}
                        </div>
                    </TabPane>
                    <TabPane
                        key={'3'}
                        tab={<h1 className="uppercase font-semibold text-base">VẬN CHUYỂN & GIAO HÀNG</h1>}
                    >
                        <div className="text-center space-y-2 mt-2">
                            <img src="/emoji-sucrose-ok.webp" className="mx-auto" alt="" />
                            <h2 className="text-base font-semibold">Hey Traveler!</h2>
                            <p>Chúng tôi gửi hàng đến nhiều quốc gia/khu vực ở các châu lục khác nhau!</p>
                        </div>
                    </TabPane>
                </StyleTabs>
            </div>
        </div>
    );
};

export default ProductDetail;
