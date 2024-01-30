'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useMediaQuery } from 'react-responsive';
import { ExtandProduct } from '@/types/extend';
import styled from 'styled-components';
import ProductMerch from '../productMerch/ProductMerch';

type Props = {
    products: ExtandProduct[];
    heading?: string;
};

const StyleSliderWrapper = styled(Swiper)`
    .swiper-pagination-bullet {
        border: 1px solid #fff;
    }
    .swiper-pagination-bullet-active {
        background: #333;
        border: 1px solid #333;
    }
`;

const ProductCarousel = ({ products, heading }: Props) => {
    const isMediumScreen = useMediaQuery({
        query: '(max-width: 768px)',
    });

    const isSmallScreen = useMediaQuery({
        query: '(max-width: 640px)',
    });

    const media320 = useMediaQuery({
        query: '(max-width: 320px)',
    });

    const media375 = useMediaQuery({
        query: '(max-width: 375px)',
    });

    const media425 = useMediaQuery({
        query: '(max-width: 1024px)',
    });

    const media1024 = useMediaQuery({
        query: '(max-width: 425px)',
    });

    const pagination = {
        clickable: true,
        renderBullet: function (index: number, className: string) {
            return '<span class="' + className + '">' + '</span>';
        },
    };

    const [delay, setDelay] = useState(2500);

    return (
        <section className="mx-auto w-layout max-w-full">
            {heading ? (
                <h2 className="text-xl mb-4 py-2 uppercase font-semibold relative before:absolute before:w-[40px] before:h-[2px] before:bg-primary before:left-0 before:bottom-0">
                    {heading}
                </h2>
            ) : (
                <h1 className="font-semibold text-4xl text-nav mt-6 mb-10 text-center">Hàng mới nhất</h1>
            )}

            <StyleSliderWrapper
                onMouseOver={() => setDelay(delay * 60 * 1000)}
                slidesPerView={isSmallScreen ? 2 : isMediumScreen ? 3 : 4}
                spaceBetween={isSmallScreen ? 10 : isMediumScreen ? 15 : 20}
                pagination={pagination}
                autoplay={{
                    delay: delay,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                    stopOnLastSlide: false,
                }}
                modules={[Pagination, Autoplay]}
                className="h-[330px] lg:h-[436px]"
            >
                {products.map((item, index) => (
                    <SwiperSlide key={index}>
                        <ProductMerch product={item} />
                    </SwiperSlide>
                ))}
            </StyleSliderWrapper>
        </section>
    );
};

export default ProductCarousel;
