import { add } from '@/slices/cart';
import { useAppDispatch } from '@/store/hook';
import { ExtandProduct } from '@/types/extend';
import { formartUSD } from '@/utils/formartUSD';
import { CloseOutlined, HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Tooltip, message } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Props = {
    product: ExtandProduct;
};

const ProductMerch = ({ product }: Props) => {
    let path = usePathname();

    let root = path === '/shop';

    const dispatch = useAppDispatch();

    const [haveOption, setHaveOption] = useState(false);
    const [size, setSize] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [optionName, setOptionName] = useState<string>('');
    const [defaultImage, setDefaultImage] = useState<string>('');
    const [price, setPrice] = useState(0);
    const [filterByColorAndSize, setFilterByColorAndSize] = useState<any>();
    const [inventory, setInventory] = useState<number | null>(null);
    const [variantId, setVariantId] = useState<string>('');

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
                        image: defaultImage || filterByColorAndSize.image,
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
            {product.type === 'variant' ? (
                <div className="relative z-20 group w-full">
                    <div className="relative flex overflow-hidden w-full">
                        <a
                            className={`flex flex-1 relative w-[121px] h-[121px] min-[375px]:w-[148px] min-[375px]:h-[148px] min-[425px]:w-[174px] min-[425px]:h-[174px] sm:w-[182px] sm:h-[182px] md:w-[207px] md:h-[207px] lg:w-[207px] lg:h-[207px] ${
                                root ? '' : 'xl:w-[283px] xl:h-[283px]'
                            }`}
                        >
                            <img
                                className="z-20 opacity-100 duration-[1500ms]  object-cover w-full h-full hover:opacity-0 top-0 left-0 right-0 bottom-0 absolute transition-all group-hover:scale-110"
                                src={`/uploads/${product?.images![0]}`}
                                alt=""
                            />

                            <img
                                className={`opacity-100  h-full w-full  object-cover duration-[1500ms] z-10 top-0 left-0 right-0 bottom-0 absolute transition-all group-hover:scale-110`}
                                src={`/uploads/${product?.images![1]}`}
                                alt=""
                            />
                        </a>

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

                                    {product?.colors?.length > 0 && product?.sizes?.length > 0 ? (
                                        <div className="w-full grid px-4 gap-y-2">
                                            <select
                                                onChange={(e) => setColor(e.target.value)}
                                                className="w-full shadow text-center text-nav rounded group px-2 py-2 outline-none"
                                            >
                                                <option value="">-- Vui lòng chọn --</option>
                                                {product?.colors &&
                                                    product?.colors?.map((color) => {
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
                                                    {product?.sizes?.map((size) => (
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
                                    ) : product?.sizes?.length > 0 ? (
                                        <div className="w-full px-4">
                                            <h3 className="text-center">Kích cỡ:</h3>

                                            <ul className="flex justify-center  flex-wrap gap-x-2 gap-y-2 mt-2">
                                                {product?.sizes?.map((size) => (
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
                                                    product?.variants?.map((variant) => {
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

                                    {/* Clothing type end */}

                                    {inventory && (
                                        <div className="space-x-1 mt-2">
                                            {inventory <= 0 ? (
                                                <span className="text-red-500">Hết hàng</span>
                                            ) : (
                                                <span>{inventory} sản phẩm</span>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleAddToCartWithOption}
                                        className="absolute bottom-0 w-full uppercase font-semibold text-white bg-primary lg:py-4 lg:text-base text-sm py-2"
                                    >
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="absolute z-30 flex flex-col top-2 right-2">
                            <Tooltip placement="left" title="Add to wish">
                                <button className="flex items-center">
                                    <div className="relative flex items-center justify-center p-3 transition-all translate-x-20 bg-white dark:text-white group-hover:translate-x-0">
                                        <HeartOutlined className="text-xl text-nav" />
                                    </div>
                                </button>
                            </Tooltip>
                            <Tooltip
                                placement="left"
                                title={`${product?.variants?.length > 0 ? 'Lựa chọn' : 'Thêm giỏ hàng'}`}
                            >
                                <button className="flex items-center" onClick={() => setHaveOption(true)}>
                                    <div className="relative flex items-center justify-center p-3 transition-all translate-x-20 bg-white dark:text-white group-hover:translate-x-0">
                                        <ShoppingCartOutlined className="text-xl text-nav" />
                                    </div>
                                </button>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="text-center mt-2 space-y-1">
                        <h1>
                            <Link
                                href={`/single/${product?.category?.id}/${product?.id}`}
                                className="mb-2 text-sm font-semibold text-content hover:text-sub"
                            >
                                {product?.name}
                            </Link>
                        </h1>

                        <div>
                            <p>
                                <Link href={`/shop/${product?.category?.id}`} className="text-sub">
                                    {product?.category?.name}
                                </Link>
                            </p>
                            <p className="text-primary font-semibold mt-1">
                                {formartUSD(product?.variants?.[0]?.price)}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative z-20 group w-full">
                    <div className="relative flex overflow-hidden w-full">
                        <a
                            className={`flex flex-1 relative w-[121px] h-[121px] min-[375px]:w-[148px] min-[375px]:h-[148px] min-[425px]:w-[174px] min-[425px]:h-[174px] sm:w-[182px] sm:h-[182px] md:w-[207px] md:h-[207px] lg:w-[207px] lg:h-[207px] ${
                                root ? '' : 'xl:w-[283px] xl:h-[283px]'
                            }`}
                        >
                            <img
                                className="z-20 opacity-100 duration-[1500ms]  object-cover w-full h-full hover:opacity-0 top-0 left-0 right-0 bottom-0 absolute transition-all group-hover:scale-110"
                                src={`/uploads/${product?.images![0]}`}
                                alt=""
                            />

                            <img
                                className={`opacity-100  h-full w-full  object-cover duration-[1500ms] z-10 top-0 left-0 right-0 bottom-0 absolute transition-all group-hover:scale-110`}
                                src={`/uploads/${product?.images![1]}`}
                                alt=""
                            />
                        </a>

                        <div className="absolute z-30 flex flex-col top-2 right-2">
                            <Tooltip placement="left" title="Add to wish">
                                <button className="flex items-center">
                                    <div className="relative flex items-center justify-center p-3 transition-all translate-x-20 bg-white dark:text-white group-hover:translate-x-0">
                                        <HeartOutlined className="text-xl text-nav" />
                                    </div>
                                </button>
                            </Tooltip>
                            <Tooltip
                                placement="left"
                                title={`${product?.variants?.length > 0 ? 'Lựa chọn' : 'Thêm giỏ hàng'}`}
                            >
                                <button className="flex items-center" onClick={handleAddToCart}>
                                    <div className="relative flex items-center justify-center p-3 transition-all translate-x-20 bg-white dark:text-white group-hover:translate-x-0">
                                        <ShoppingCartOutlined className="text-xl text-nav" />
                                    </div>
                                </button>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="text-center mt-2 space-y-1">
                        <h1>
                            <Link
                                href={`/single/${product?.category?.id}/${product?.id}`}
                                className="mb-2 text-sm font-semibold text-content hover:text-sub"
                            >
                                {product?.name}
                            </Link>
                        </h1>

                        <div>
                            <p>
                                <Link href={`/shop/${product?.category?.id}`} className="text-sub">
                                    {product?.category?.name}
                                </Link>
                            </p>
                            {product?.saleOff! > 0 ? (
                                <div className="flex justify-center gap-x-1">
                                    <p className="line-through text-sub font-semibold">{formartUSD(product?.price!)}</p>
                                    <p className="text-primary font-bold max-md:text-[12.6px]">
                                        {product?.saleOff! > 0 && formartUSD(product?.price! - sale!)}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-primary font-bold max-md:text-[12.6px]">
                                    {formartUSD(product?.price!)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductMerch;
