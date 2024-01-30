import { ShopOutlined } from '@ant-design/icons';
import Link from 'next/link';
import CatalogItem from '../catalogItem/CatalogItem';
import { db } from '@/lib/db';

const BrowerCatalog = async () => {
    const categories = await db.category.findMany({
        include: {
            products: true,
        },
    });
    const [first, ...items] = categories;

    return (
        <div>
            <h1 className="font-semibold text-4xl text-nav text-center">Mua sắm hàng hóa Genshin Impact</h1>
            <p className="text-sub text-sm text-center mt-2">
                Kiểm tra danh mục sản phẩm đầy đủ của Genshin.Global hoặc chuyển sang một danh mục cụ thể:
            </p>

            <div className="text-center mt-6 mb-9">
                <Link
                    href={'/shop'}
                    className="!text-white gap-x-1 transition-all duration-200 inline-flex justify-center px-6 py-2 text-base font-semibold uppercase bg-primary hover:opacity-75"
                >
                    <span>
                        <ShopOutlined />
                    </span>
                    <span>Xem thêm</span>
                </Link>
            </div>

            {/* CATALOG */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {items?.length === 0 ? (
                    <h1 className="text-center">Không có loại hàng nào.</h1>
                ) : (
                    <>
                        <CatalogItem
                            data={first}
                            src={first?.thumbnail}
                            to={`/shop?categoryId=${first?.id}`}
                            className="col-span-2 row-span-2"
                        />

                        {items?.map((item) => (
                            <CatalogItem
                                key={item.id}
                                to={`/shop?categoryId=${item?.id}`}
                                src={item.thumbnail}
                                data={item}
                                className="col-span-1"
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default BrowerCatalog;
