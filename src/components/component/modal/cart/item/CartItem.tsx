import { remove } from '@/slices/cart';
import { useAppDispatch } from '@/store/hook';
import { ExtandProduct } from '@/types/extend';
import { formartUSD } from '@/utils/formartUSD';
import { CloseOutlined } from '@ant-design/icons';
import { Option } from '@prisma/client';
import { Image } from 'antd';
import Link from 'next/link';

type Props = {
    cartItem: ExtandProduct & {
        image?: string;
        price?: number;
        option?: {
            color?: string;
            size?: string;
            optionName?: string;
        };
    };
    index: number;
};

const CartItem = ({ cartItem, index }: Props) => {
    const dispatch = useAppDispatch();

    const onRemoveCartItem = (i: number) => {
        dispatch(remove(i));
    };

    return (
        <div className="relative flex gap-x-3 px-3 pt-2">
            <img src={`/uploads/${cartItem?.image}`} className="!w-[65px] !h-[65px]" alt="image" loading="lazy" />

            <div>
                <Link
                    href={`/single/${cartItem?.category?.id}/${cartItem?.id}`}
                    className="hover:opacity-80 hover:text-content text-sm font-semibold"
                >
                    {cartItem?.option ? (
                        <span>
                            {cartItem?.name} {cartItem?.option?.color && `- ${cartItem?.option?.color}`}{' '}
                            {cartItem?.option?.size && `- ${cartItem?.option?.size}`}{' '}
                            {cartItem?.option?.optionName && `- ${cartItem?.option?.optionName}`}
                        </span>
                    ) : (
                        <span>{cartItem?.name}</span>
                    )}
                </Link>
                <div className="flex gap-x-2 items-center">
                    <span className="text-gray-600 text-xs">x{cartItem?.quantity}</span>
                    <span className="font-bold text-primary">{formartUSD(cartItem?.price!)}</span>
                </div>
            </div>

            <button className="absolute right-1 top-1" onClick={() => onRemoveCartItem(index)}>
                <CloseOutlined />
            </button>
        </div>
    );
};

export default CartItem;
