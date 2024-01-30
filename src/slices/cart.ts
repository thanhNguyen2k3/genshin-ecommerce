import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Product } from '@prisma/client';
import { message } from 'antd';
import { ExtandProduct } from '@/types/extend';

type CartProps = {
    cartItems: any[];
};

type PickUp = Pick<
    ExtandProduct,
    | 'name'
    | 'images'
    | 'price'
    | 'id'
    | 'quantity'
    | 'saleOff'
    | 'categoryId'
    | 'description'
    | 'category'
    | 'shortDes'
    | 'active'
    | 'variants'
    | 'type'
>;

const initialState: CartProps = {
    cartItems: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        add: (
            state,
            action: PayloadAction<
                PickUp & {
                    option?: {
                        size?: string;
                        color?: string;
                        optionName?: string;
                    } | null;
                    image?: string;
                    price?: number;
                    variantId?: string;
                }
            >,
        ) => {
            const newProduct = action.payload;

            const itemIndex = state.cartItems.findIndex((item) => item?.variantId === newProduct?.variantId);

            const existingProduct = state.cartItems.find((item) => item.id === newProduct.id);

            const option = newProduct.option;

            if (newProduct.active === false) {
                message.warning('Sản phẩm hiện tại đã ngừng hoạt động.Vui lòng chọn sản phẩm khác');
            } else {
                if (!option || option === null || option === undefined) {
                    if (existingProduct) {
                        existingProduct.quantity++;
                        message.success(`Đã thêm ${newProduct.name} vào giỏ hàng`);
                    } else {
                        state.cartItems.push({
                            ...newProduct,
                            image: newProduct?.image,
                            quantity: newProduct.quantity || 1,
                            price: newProduct?.price,
                            option: null,
                            variantId: null,
                        });
                        message.success(`Đã thêm ${newProduct.name} vào giỏ hàng`);
                    }
                } else {
                    if (itemIndex < 0) {
                        state.cartItems.push({
                            ...newProduct,
                            image: newProduct?.image,
                            option: newProduct?.option,
                            quantity: newProduct.quantity || 1,
                            price: newProduct?.price,
                            variantId: newProduct?.variantId,
                        });
                        message.success(`Đã thêm ${newProduct.name} vào giỏ hàng`);
                    } else {
                        state.cartItems[itemIndex].quantity++;
                        message.success(`Đã thêm ${newProduct.name} vào giỏ hàng`);
                    }
                }
            }
        },
        increase: (state, action: PayloadAction<number>) => {
            const currentProduct = state.cartItems.find((_item, index) => index === action.payload);
            currentProduct.quantity++;
        },
        decrease: (state, action: PayloadAction<number>) => {
            const currentProduct = state.cartItems.find((_item, index) => index === action.payload);
            currentProduct.quantity--;

            if (currentProduct.quantity < 1) {
                state.cartItems = state.cartItems.filter((_item, index) => index !== action.payload);
                currentProduct.quantity = 1;

                message.info(`${currentProduct.name} đã được loại bỏ`);
            }
        },
        clear: (state) => {
            state.cartItems = [];

            message.info(`Giỏ hàng đã được làm trống`);
        },
        remove: (state, action: PayloadAction<number>) => {
            state.cartItems = state.cartItems.filter((_item, index) => index !== action.payload);

            message.info(`Đã xóa sản phẩm khỏi giỏ hàng`);
        },
        update: (state, action) => {
            state.cartItems = action.payload;
            message.info(`Giỏ hàng đã được cập nhật`);
        },
    },
});

export const { add, increase, decrease, clear, remove, update } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
