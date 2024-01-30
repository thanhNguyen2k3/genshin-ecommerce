'use client';

import ProductItem from '@/components/component/productItem/ProductItem';
import AlertWarning from '@/components/ui/AlertWarning';
import { ExtandProduct } from '@/types/extend';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

type Props = {
    products: ExtandProduct[];
    loading: boolean;
};

const ContainerPage = ({ products, loading }: Props) => {
    return (
        <>
            {loading ? (
                <div className="flex w-full h-full justify-center items-center">
                    <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24, color: '#333' }} spin />} />
                </div>
            ) : (
                <div className="mt-6">
                    {products.length === 0 ? (
                        <AlertWarning message="Không tìm thấy sản phẩm nào phù hợp với lựa chọn của bạn." />
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            {products.map((product) => (
                                <ProductItem key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ContainerPage;
