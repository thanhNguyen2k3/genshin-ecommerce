import { Option, Product } from '@prisma/client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type ProductApiInput = {
    name: string;
    shortDes: string;
    description: string;
    price: number;
    saleOff: number;
    categoryId: string;
    options: {
        extraName: string;
        extraPrice: number;
    };
};

interface ExtendProduct extends Product {
    options: Option;
}

const productApi = createApi({
    reducerPath: 'product',
    tagTypes: ['Product'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_URL}/api`,
    }),
    endpoints: (builder) => ({
        getProducts: builder.query<ExtendProduct[], void>({
            query: () => '/pr/product',
            providesTags: ['Product'],
        }),
        getProductById: builder.query<ExtendProduct, string>({
            query: (id) => `/pr/product/${id}`,
            providesTags: ['Product'],
        }),
        createProduct: builder.mutation<ProductApiInput, ProductApiInput>({
            query: (data) => ({
                url: '/pr/product',
                body: data,
                method: 'POST',
            }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation<ProductApiInput, Product>({
            query: (data) => ({
                url: `/pr/product/${data.id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
    }),
});

export const { useCreateProductMutation, useUpdateProductMutation } = productApi;
export default productApi;
