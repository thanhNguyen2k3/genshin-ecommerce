import SlideShow from '@/components/component/slides/SlideShow';
import ProductCarousel from '@/components/component/productCarouse/ProductCarousel';
import React from 'react';
import Image from 'next/image';
import Heading from '@/components/ui/Heading';
import ProductGoodies from '@/components/component/goodies/ProductGoodies';
import BrowerCatalog from '@/components/component/catalog/BrowerCatalog';
import { db } from '@/lib/db';
import Wrapper from '@/components/local/Wrapper';
import { ExtandProduct } from '@/types/extend';

type Props = {};

const Page = async ({}: Props) => {
    const products = await db.product.findMany({
        where: {
            deleted: false,
        },
        include: {
            category: true,
            variants: {
                include: {
                    color: true,
                    size: true,
                },
            },
            sizes: {
                include: {
                    size: true,
                },
            },
            colors: {
                include: {
                    color: true,
                },
            },
        },
        take: 16,
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div className="relative">
            <div className="relative pb-6">
                <div className={`bg-header absolute top-0 left-0 bottom-0 right-0 z-0`}></div>
                <SlideShow />
            </div>

            {/* Content start */}

            {/* About start */}
            <Wrapper>
                <div className="lg:flex block">
                    <div className="lg:w-2/3 w-full lg:p-6">
                        <p className="text-sub lg:text-xl md:text-lg text-sm text-center tracking-wide">
                            <strong className="font-semibold">Genshin Impact</strong> và{' '}
                            <strong className="font-semibold">Honkai: Star Rail</strong> là những trò chơi điện tử phổ
                            biến do miHoYo phát triển và đã thu hút được lượng người hâm mộ khá lớn trên toàn cầu kể từ
                            khi phát hành lần lượt vào năm 2020 và 2023. Có nhiều loại hàng hóa Genshin Impact khác
                            nhau, bao gồm Quần áo, Phụ kiện, Thú nhồi bông, Mô hình, Máy tính & Thiết bị kỹ thuật số,
                            Sách nghệ thuật, Album CD OST và thậm chí một số sản phẩm và đồ sưu tầm Phiên bản giới hạn,
                            v.v. Mặt khác, Honkai: Star Rail, nhờ sự khởi đầu mạnh mẽ và sự nổi tiếng của mình, đang
                            phát triển dòng sản phẩm hàng hóa để đáp ứng nhu cầu của người hâm mộ.
                        </p>

                        <div className="flex gap-x-4 p-4 shadow-lg mt-4">
                            <Image
                                src="/green-card.webp"
                                className="object-top object-contain"
                                width={30}
                                height={30}
                                alt=""
                            />

                            <div>
                                <h2 className="font-medium text-lg mb-2">Disclaimer</h2>

                                <p className="text-sm text-sub lg:text-xl md:text-lg">
                                    Tất cả thông tin về hàng hóa chính thức được liệt kê trong cửa hàng trực tuyến này
                                    là tài sản của miHoYo & Hoyoverse (Cogniosphere). Genshin.Global KHÔNG phải là đại
                                    diện của các công ty và không hề giả vờ là một kênh chính thức. Tại đây
                                    Genshin.Global đóng vai trò là người trung gian giúp mua các sản phẩm chính thức mà
                                    bạn mong muốn thông qua các kênh chính thức và quản lý việc xuất khẩu và vận chuyển
                                    cho bạn.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/3 w-full px-7 py-6">
                        <header className="text-xs font-normal">Advertisement</header>
                    </div>
                </div>
            </Wrapper>
            {/* About end */}

            {/* Product carousel start */}

            <ProductCarousel products={products as ExtandProduct[]} />

            {/* Product carousel end */}

            {/* Teyvat Goodies start */}
            <div className="max-w-full w-layout mx-auto">
                <Heading title="Xem thêm" />

                <ProductGoodies products={products as ExtandProduct[]} />
            </div>
            {/* Teyvat Goodies end */}

            {/* Catalog start */}

            <div className="max-w-full w-layout mx-auto">
                <Heading title="Xem thêm GENSHIN IMPACT PLUSHIES" />
                <BrowerCatalog />
            </div>

            {/* Catalog end */}

            {/* Content end */}
        </div>
    );
};

export default Page;
