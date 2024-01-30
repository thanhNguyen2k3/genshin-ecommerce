import ProductDetail from '@/components/client/user/productDetail/ProductDetail';
import ProductCarousel from '@/components/component/productCarouse/ProductCarousel';
import Wrapper from '@/components/local/Wrapper';
import AlertWarning from '@/components/ui/AlertWarning';
import { db } from '@/lib/db';
import { ExtandProduct } from '@/types/extend';
import { Alert, Breadcrumb } from 'antd';

type Params = {
    params: {
        categoryId: string;
        id: string;
    };
};

const Page = async ({ params: { id, categoryId } }: Params) => {
    const existingProduct = await db.product.findFirst({
        where: {
            id,
        },
        include: {
            category: true,
            groupCharacter: {
                include: {
                    character: {
                        include: {
                            region: true,
                            vision: true,
                            weapon: true,
                        },
                    },
                },
            },
            colors: {
                include: {
                    color: true,
                },
            },
            sizes: {
                include: {
                    size: true,
                },
            },
            variants: {
                include: {
                    color: true,
                    size: true,
                },
            },
        },
    });

    const productHots = await db.product.findMany({
        where: {
            selled: {
                gt: 1,
            },
        },
        orderBy: {
            selled: 'desc',
        },
        include: {
            category: true,
            groupCharacter: {
                include: {
                    character: {
                        include: {
                            region: true,
                            vision: true,
                            weapon: true,
                        },
                    },
                },
            },
            colors: {
                include: {
                    color: true,
                },
            },
            sizes: {
                include: {
                    size: true,
                },
            },
            variants: {
                include: {
                    color: true,
                    size: true,
                },
            },
        },
        take: 4,
    });

    const relatedProduct = await db.product.findMany({
        where: {
            category: {
                id: categoryId,
            },
            id: {
                not: id,
            },
            deleted: false,
        },
        include: {
            category: true,
            groupCharacter: {
                include: {
                    character: {
                        include: {
                            region: true,
                            vision: true,
                            weapon: true,
                        },
                    },
                },
            },
            colors: {
                include: {
                    color: true,
                },
            },
            sizes: {
                include: {
                    size: true,
                },
            },
            variants: {
                include: {
                    color: true,
                    size: true,
                },
            },
        },
        orderBy: {
            createdAt: 'asc',
        },
    });

    return (
        <>
            {!existingProduct ? (
                <Wrapper>
                    <Alert
                        message="Sản phẩm này hiện không tồn tại"
                        description="Vui lòng quay lại trang chủ để tìm kiếm sản phẩm khác mà bạn muốn."
                        type="error"
                        showIcon
                    />
                </Wrapper>
            ) : (
                <>
                    <div className="mx-auto w-layout max-w-full py-2 px-4">
                        <Breadcrumb
                            items={[
                                {
                                    title: 'Shop',
                                    href: '/',
                                },
                                {
                                    title: existingProduct.category?.name,
                                    href: `/shop?categoryId=${existingProduct.category?.id}`,
                                },
                                {
                                    title: existingProduct.name,
                                },
                            ]}
                        />
                    </div>
                    <ProductDetail
                        productHots={productHots as ExtandProduct[]}
                        product={existingProduct as ExtandProduct}
                    />
                    {relatedProduct.length !== 0 ? (
                        <div className="px-4 lg:px-0">
                            <ProductCarousel heading="Sản phẩm liên quan" products={relatedProduct as any} />
                        </div>
                    ) : (
                        <div className="px-4 lg:px-0">
                            <AlertWarning message="Không tìm thấy sản phẩm nào liên quan" />
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Page;
