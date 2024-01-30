'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import styled from 'styled-components';

type Props = {};

const slides = ['slide1.webp', 'slide2.webp', 'slide3.webp', 'slide4.webp', 'slide5.webp'];

const StyleSliderWrapper = styled(Swiper)`
    .swiper-pagination-bullet {
        border: 1px solid #fff;
    }
    .swiper-pagination-bullet-active {
        background: #333;
        border: 1px solid #333;
    }
`;

const SlideShow = ({}: Props) => {
    return (
        <div className="max-w-full mx-auto w-layout">
            <StyleSliderWrapper
                pagination={{
                    clickable: true,
                }}
                spaceBetween={30}
                modules={[Pagination]}
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide}>
                        <img src={`/${slide}`} className="w-full h-full" alt="slide" />
                    </SwiperSlide>
                ))}
            </StyleSliderWrapper>
        </div>
    );
};

export default SlideShow;
