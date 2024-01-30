'use client';

import { ExtandProduct } from '@/types/extend';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductMerch from '../component/productMerch/ProductMerch';
import { Autoplay, Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';
import styled from 'styled-components';

type Props = {
    products: ExtandProduct[];
};

const StyleSwiper = styled(Swiper)`
    padding: 10px;
    background-color: #fff;
`;

const BestSelling = ({ products }: Props) => {
    const isMediumScreen = useMediaQuery({
        query: '(max-width: 768px)',
    });

    const isSmallScreen = useMediaQuery({
        query: '(max-width: 640px)',
    });

    const [delay, setDelay] = useState(2500);

    return (
        <div className="bg-[#8758b6] px-4 pt-2 pb-6 w-full h-full">
            <h1 className="text-white text-xl font-semibold pb-2">BÁN CHẠY NHẤT</h1>

            <StyleSwiper
                onMouseOver={() => setDelay(delay * 60 * 1000)}
                slidesPerView={isSmallScreen ? 2 : isMediumScreen ? 3 : 4}
                spaceBetween={isSmallScreen ? 10 : isMediumScreen ? 15 : 20}
                autoplay={{
                    delay: delay,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                    stopOnLastSlide: false,
                }}
                cssMode={true}
                mousewheel={true}
                keyboard={true}
                modules={[Navigation, Mousewheel, Keyboard, Autoplay]}
                className=""
            >
                {products?.map((item, index) => (
                    <SwiperSlide key={index}>
                        <ProductMerch product={item} />
                    </SwiperSlide>
                ))}
            </StyleSwiper>
        </div>
    );
};

export default BestSelling;
