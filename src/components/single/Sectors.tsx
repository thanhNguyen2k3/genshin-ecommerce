'use client';

import { Category, Product } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

type ExtandCategory = Category & {
    products: Product[];
};

type Props = {
    categories: ExtandCategory[];
    categoryId?: string | string[];
};

const Sectors = ({ categories, categoryId }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams],
    );

    return (
        <div>
            <div className="hidden xl:block">
                <div>
                    <Swiper className="z-10">
                        <SwiperSlide>
                            <img src="/banner1.webp" alt="" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="/banner2.webp" alt="" />
                        </SwiperSlide>
                    </Swiper>
                </div>

                <h1 className="text-base font-semibold mt-8 mb-4">DANH MỤC SẢN PHẨM</h1>

                <div>
                    <ul className="space-y-2 xl:block hidden">
                        <li className="relative cursor-pointer" onClick={() => router.push('/shop')}>
                            <p className="text-sm font-normal block group">
                                <span className="text-nav">Tất cả</span>
                            </p>
                        </li>
                        {categories?.map((cate) => (
                            <li
                                key={cate.id}
                                className="relative cursor-pointer"
                                onClick={() =>
                                    router.push(`${pathname}?${createQueryString('categoryId', cate.id)}`, {
                                        scroll: false,
                                    })
                                }
                            >
                                <p className="text-sm font-normal block group">
                                    <span className="text-nav">{cate.name}</span>
                                    <span
                                        className={`absolute right-0 w-7 h-5 inline-flex items-center justify-center border group-hover:text-white group-hover:bg-primary ${
                                            cate.id === categoryId && 'bg-primary text-white'
                                        } rounded-full`}
                                    >
                                        {cate.products.length}
                                    </span>
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sectors;
