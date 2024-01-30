'use client';

import styled from 'styled-components';

const StyleBackGround = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        position: relative;
        z-index: 0;
        width: 100%;
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 1;
    }
`;

const Page = () => {
    return (
        <StyleBackGround>
            <img src="/intro.webp" alt="" />

            <div className="absolute z-10 text-center text-white">
                <h1 className="text-lg">Một game nhập vai hành động có thế giới mở theo phong cách anime.</h1>
                <p className="text-sm">
                    Trong Genshin Impact, bắt đầu cuộc hành trình xuyên qua một thế giới giả tưởng tên là Teyvat.
                </p>
            </div>
        </StyleBackGround>
    );
};

export default Page;
