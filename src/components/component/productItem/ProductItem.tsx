'use client';

import { add } from '@/slices/cart';
import { useAppDispatch } from '@/store/hook';
import { ExtandProduct } from '@/types/extend';
import { formartUSD } from '@/utils/formartUSD';
import { CloseOutlined, HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { message } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

type Props = {
    product?: ExtandProduct;
};

const StyleButtonShop = styled.div`
    position: relative;
    z-index: 1;
    background-color: #6eb89f;
    width: 100%;
    grid-column: span 3 / span 5;
    overflow: hidden;
    max-height: 36px;
    color: #fff;
    gap: 6px;
    place-items: center;

    button {
        text-transform: uppercase;
        display: block;
        min-height: 36px;
        max-height: 36px;
        width: 100%;
        transition: all ease-in 0.2s;
        font-weight: 600;
        span {
            color: #fff;
        }
    }

    &:hover {
        .button-transition {
            margin-top: -36px;
            transition: all ease-in 0.2s;
        }
    }
`;

const StyleSubCription = styled.div`
    position: absolute;
    visibility: hidden;
    z-index: -1;
    left: 0;
    right: 0;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.3);
    height: auto;
    background-color: #fff;
    padding: 6px 6px;
`;

const StyleCardItem = styled.div`
    .style-subcription {
        opacity: 0;
        transition: all ease-in 0.1s;
    }

    &:hover {
        .style-subcription {
            visibility: visible;
            opacity: 1;
        }
    }
`;

const ProductItem = ({ product }: Props) => {
    const dispatch = useAppDispatch();

    const [haveOption, setHaveOption] = useState(false);

    const [size, setSize] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [optionName, setOptionName] = useState<string>('');
    const [defaultImage, setDefaultImage] = useState<string>('');
    const [price, setPrice] = useState(0);
    const [filterByColorAndSize, setFilterByColorAndSize] = useState<any>();
    const [variantId, setVariantId] = useState<string>('');
    const [inventory, setInventory] = useState<number | null>(null);

    let sale: any = product?.saleOff! > 0 && (product?.price! * product?.saleOff!) / 100;

    useEffect(() => {
        const checkOption = product?.variants?.find((variant) => variant?.optionName);

        if (product?.sizes?.length! > 0 && product?.colors?.length! > 0) {
            const filter = product?.variants.find(
                (variant) => variant.color?.name! === color && variant.size?.value! === size,
            );

            setFilterByColorAndSize(filter);
            setInventory(filter?.inventory!);
        } else if (product?.sizes?.length! > 0) {
            const filter = product?.variants?.find((variant) => variant.size?.value! === size);

            setFilterByColorAndSize(filter);
            setInventory(filter?.inventory!);
        } else if (checkOption) {
            const filter = product?.variants?.find((variant) => variant.optionName! === optionName);
            setFilterByColorAndSize(filter);
            setInventory(filter?.inventory!);
        }
    }, [size, color, optionName]);

    const handleSelect = () => {
        setHaveOption(true);
    };

    const handleAddToCart = () => {
        if (product?.inStock! <= 0) {
            return message.warning('Sản phẩm hiện tại đã hết vui lòng chọn sản phẩm khác');
        }

        if (product?.saleOff! > 0) {
            dispatch(add({ ...product!, quantity: 1, image: product?.images[0], price: product?.price! - sale! }));
        } else {
            dispatch(add({ ...product!, quantity: 1, image: product?.images[0], price: product?.price! }));
        }
    };

    const handleAddToCartWithOption = () => {
        const checkInventory = product?.variants?.find((variant) => variant.inventory <= 0);

        if (checkInventory) {
            return message.warning('Sản phẩm hiện tại đã hết vui lòng chọn sản phẩm khác');
        }

        if (!filterByColorAndSize) {
            return message.error('Có vẻ như mặt hàng này không tồn tại.Bạn hãy chọn loại khác nha');
        }

        if (product?.sizes?.length! > 0 && product?.colors?.length! > 0) {
            if (size === '' || color === '') {
                message.info('Hãy hoàn tất lựa chọn của bạn');
            } else {
                setSize('');
                setColor('');
                setOptionName('');
                setDefaultImage('');
                handleClose();
                return dispatch(
                    add({
                        ...product!,
                        quantity: 1,
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
        } else if (product?.sizes?.length! > 0 && product?.colors?.length === 0) {
            if (size === '') {
                message.info('Hãy hoàn tất lựa chọn của bạn');
            } else {
                setSize('');
                setColor('');
                setOptionName('');
                setDefaultImage('');
                handleClose();
                return dispatch(
                    add({
                        ...product!,
                        quantity: 1,
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
                handleClose();
                return dispatch(
                    add({
                        ...product!,
                        quantity: 1,
                        option: {
                            color: color! || null!,
                            size: size! || null!,
                            optionName: optionName! || null!,
                        },
                        image: defaultImage || filterByColorAndSize.image,
                        price: price || filterByColorAndSize.price,
                        variantId: variantId || filterByColorAndSize.id,
                    }),
                );
            }
        }
    };

    const handleClose = () => {
        setHaveOption(false);
    };

    return (
        <>
            {product?.type === 'variant' ? (
                <StyleCardItem className="group hover:z-[49] relative hover:shadow-2xl bg-white transition-all duration-300">
                    <div className="relative">
                        {product?.selled! >= 10 && (
                            <span className="absolute font-semibold left-2 top-2 text-white bg-hot rounded-full w-[50px] h-[50px] flex justify-center items-center">
                                HOT
                            </span>
                        )}

                        <img
                            src={`/uploads/${product?.images[0]}`}
                            alt=""
                            className="w-full h-full max-h-[283px] object-cover"
                        />

                        {haveOption && (
                            <div>
                                <div
                                    className={`absolute flex-col  top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white/90 z-50`}
                                >
                                    <button className="absolute top-2 right-2 hover:opacity-70" onClick={handleClose}>
                                        <CloseOutlined />
                                        <span className="ml-1">Đóng</span>
                                    </button>

                                    {/* Clothing type start */}

                                    {product.colors.length > 0 && product.sizes.length > 0 ? (
                                        <div className="w-full grid px-4 gap-y-2">
                                            <select
                                                onChange={(e) => setColor(e.target.value)}
                                                className="w-full shadow text-center text-nav rounded group px-2 py-2 outline-none"
                                            >
                                                <option value="">-- Vui lòng chọn --</option>
                                                {product?.colors &&
                                                    product?.colors.map((color) => {
                                                        return (
                                                            <option key={color.id} value={color.color.name}>
                                                                {color.color.name}
                                                            </option>
                                                        );
                                                    })}
                                            </select>

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
                                        </div>
                                    ) : product.sizes.length > 0 ? (
                                        <div className="w-full px-4">
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
                                    ) : (
                                        <div className="w-full px-4">
                                            <select
                                                onChange={(e) => {
                                                    const split = e.target.value.split(',');

                                                    setOptionName(split[0]);
                                                    setDefaultImage(split[1]);
                                                    setPrice(Number(split[2]));
                                                    setVariantId(split[3]);
                                                    setInventory(Number(split[4]));
                                                }}
                                                className="w-full shadow text-center text-nav rounded group px-2 py-2 outline-none"
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
                                                                    variant?.id,
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

                                    {inventory && (
                                        <div className="space-x-1 mt-2">
                                            {inventory <= 0 ? (
                                                <span className="text-red-500">Hết hàng</span>
                                            ) : (
                                                <span>{inventory} sản phẩm</span>
                                            )}
                                        </div>
                                    )}
                                    {/* Clothing type end */}

                                    <button
                                        onClick={handleAddToCartWithOption}
                                        className="absolute bottom-0 w-full uppercase font-semibold text-white bg-primary lg:py-4 lg:text-base text-sm py-2"
                                    >
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="px-3 text-center py-2 space-y-1">
                        <Link
                            href={`/single/${product?.category?.id}/${product?.id}`}
                            className="font-semibold text-base text-content max-md:text-[12.6px]"
                        >
                            {product?.name}
                        </Link>

                        <p className="text-sub text-sm max-md:text-[11px]">{product?.category?.name}</p>

                        <p className="text-primary font-bold max-md:text-[12.6px]">
                            {formartUSD(product?.variants![0].price)}
                        </p>

                        <StyleSubCription className="style-subcription">
                            <p className="text-sub text-sm font-normal max-md:text-xs">
                                <span className="font-semibold max-md:text-xs">
                                    Official Genshin Impact Merchandise
                                </span>{' '}
                                {product?.shortDes}
                            </p>
                            <div className="relative grid grid-cols-5 place-items-center justify-between px-4 py-2 ">
                                <button className="col-span-1 py-2 flex justify-start">
                                    <HeartOutlined className="text-xl text-nav " />
                                </button>

                                <StyleButtonShop>
                                    {product?.variants?.length! > 0 && (
                                        <button className="button-transition lg:text-sm text-xs">Lựa chọn</button>
                                    )}
                                    <button onClick={handleSelect}>
                                        <ShoppingCartOutlined className="text-2xl text-black" />
                                    </button>
                                </StyleButtonShop>
                            </div>
                        </StyleSubCription>
                    </div>
                </StyleCardItem>
            ) : (
                <StyleCardItem className="group hover:z-[49] relative hover:shadow-2xl bg-white transition-all duration-300">
                    <div className="relative">
                        {product?.saleOff! > 0 && (
                            <span className="absolute font-semibold left-2 top-2 text-white bg-hot rounded-full w-[50px] h-[50px] flex justify-center items-center">
                                HOT
                            </span>
                        )}

                        <img
                            src={`/uploads/${product?.images[0]}`}
                            alt=""
                            className="w-full h-full max-h-[283px] object-cover"
                        />
                    </div>
                    <div className="px-3 text-center py-2 space-y-1">
                        <Link
                            href={`/single/${product?.category?.id}/${product?.id}`}
                            className="font-semibold text-base text-content max-md:text-[12.6px]"
                        >
                            {product?.name}
                        </Link>

                        <p className="text-sub text-sm max-md:text-[11px]">{product?.category?.name}</p>

                        {product?.saleOff! > 0 ? (
                            <div className="flex justify-center gap-x-1">
                                <p className="line-through text-sub font-semibold">{formartUSD(product?.price!)}</p>
                                <p className="text-primary font-bold max-md:text-[12.6px]">
                                    {product?.saleOff! > 0 && formartUSD(product?.price! - sale!)}
                                </p>
                            </div>
                        ) : (
                            <p className="text-primary font-bold max-md:text-[12.6px]">{formartUSD(product?.price!)}</p>
                        )}

                        <StyleSubCription className="style-subcription">
                            <p className="text-sub text-sm font-normal max-md:text-xs">
                                <span className="font-semibold max-md:text-xs">
                                    Official Genshin Impact Merchandise
                                </span>{' '}
                                {product?.shortDes}
                            </p>
                            <div className="relative grid grid-cols-5 place-items-center justify-between px-4 py-2 ">
                                <button className="col-span-1 py-2 flex justify-start">
                                    <HeartOutlined className="text-xl text-nav " />
                                </button>

                                <StyleButtonShop>
                                    {product?.variants!.length! > 0 && (
                                        <button className="button-transition lg:text-sm text-xs">Lựa chọn</button>
                                    )}
                                    <button onClick={handleAddToCart}>
                                        <ShoppingCartOutlined className="text-2xl text-black" />
                                    </button>
                                </StyleButtonShop>
                            </div>
                        </StyleSubCription>
                    </div>
                </StyleCardItem>
            )}
        </>
    );
};

export default ProductItem;
