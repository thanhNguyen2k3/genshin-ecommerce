'use client';

import Link from 'next/link';
import { Category, Product } from '@prisma/client';

type Props = {
    src: string;
    className?: string;
    to?: string;
    data?: Category & {
        products: Product[];
    };
};

const CatalogItem = ({ src, to, className, data }: Props) => {
    return (
        <Link href={to!} className={`relative inline-block group overflow-hidden ${className}`}>
            <img
                className="relative inline-block z-[1] lg:group-hover:scale-110 w-full h-auto transition-all duration-500"
                src={`/uploads/${src}`}
                alt=""
            />

            <div className="lg:absolute lg:mt-0 mt-4 mb-2 top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center">
                <div className="-z-10 lg:z-20 before:opacity-20 group-hover:before:opacity-100 before:absolute before:bg-black/30 before:top-0 before:left-0 before:right-0 before:bottom-0"></div>
                <h3 className="lg:text-xl font-medium lg:font-bold uppercase lg:text-white text-content relative z-20 max-w-[255px] text-center">
                    {data?.name}
                </h3>
                <p className="font-normal lg:text-white relative text-content z-20 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-2 duration-300 lg:group-hover:translate-y-0 transition-transform">
                    {data?.products?.length} sản phẩm
                </p>
            </div>
        </Link>
    );
};

export default CatalogItem;
