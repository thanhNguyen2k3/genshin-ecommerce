'use client';

import { AnimatePresence } from 'framer-motion';
import ProductItem from '../productItem/ProductItem';
import { ExtandProduct } from '@/types/extend';

type Props = {
    products: ExtandProduct[];
};

const ProductGoodies = ({ products }: Props) => {
    return (
        <div className="my-6">
            <h1 className="font-semibold text-4xl text-nav text-center">Quà Tặng Teyvat</h1>
            <p className="text-sub text-sm text-center mt-2 mb-6">
                Một số mặt hàng thực sự phổ biến và thú vị mà hầu hết khách du lịch Teyvat đều yêu thích!
            </p>

            <div className="grid grid-cols-4 gap-x-3 max-md:grid-cols-2">
                {products.map((product) => (
                    <ProductItem key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductGoodies;
