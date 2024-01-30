'use client';

import { Divider } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import {
    BiLogoFacebook,
    BiLogoTwitter,
    BiLogoGmail,
    BiLogoPinterestAlt,
    BiLogoWhatsapp,
    BiLogoTelegram,
    BiCopyright,
} from 'react-icons/bi';

const networks = [
    {
        id: 1,
        icon: <BiLogoFacebook />,
        link: '/',
        css: 'bg-[#365493]',
    },
    {
        id: 2,
        icon: <BiLogoTwitter />,
        link: '/',
        css: 'bg-[#3CF]',
    },
    {
        id: 3,
        icon: <BiLogoGmail />,
        link: '/',
        css: 'bg-[#F89A1E]',
    },
    {
        id: 4,
        icon: <BiLogoPinterestAlt />,
        link: '',
        css: 'bg-[#CB2027]',
    },
    {
        id: 5,
        icon: <BiLogoWhatsapp />,
        link: '/',
        css: 'bg-[#1EBEA5]',
    },
    {
        id: 6,
        icon: <BiLogoTelegram />,
        link: '/',
        css: 'bg-[#37AEE2]',
    },
];

const payments = [
    '/payment/paypal.svg',
    '/payment/stripe.svg',
    '/payment/visa.svg',
    '/payment/master-card.svg',
    '/payment/apple-pay.svg',
    '/payment/gg-pay.svg',
];

const recents = [
    {
        id: 1,
        thumbnail: '/post1.webp',
        title: 'Genshin Impact và Juneyao Air: Sự hợp tác ngoạn mục cất cánh',
        time: 'November 5, 2023',
        divider: true,
    },
    {
        id: 2,
        thumbnail: '/post2.webp',
        title: 'Quán cà phê Genshin ở Seoul: Thiên đường dành cho những người hâm mộ Genshin Impact',
        time: 'November 4, 2023',
        divider: true,
    },
    {
        id: 3,
        thumbnail: '/post3.webp',
        title: 'Phiên bản 4.2 Preview Tóm tắt chương trình đặc biệt',
        time: 'November 4, 2023',
        divider: false,
    },
];

const FooterFn = () => {
    return (
        <div>
            <div className="w-layout mx-auto max-w-full">
                <div className="p-4 lg:grid lg:grid-cols-3 flex flex-col-reverse md:grid md:grid-cols-3 max-w-[1000px] place-items-center">
                    <div className="h-[400px] col-span-2">
                        <img src="/footer.webp" className="w-full h-full object-contain object-center" />
                    </div>

                    <div className="space-y-5 col-span-1">
                        <h1 className="lg:text-3xl text-xl font-semibold">
                            Bạn có thích trang web này không? Chia sẻ với bạn bè của bạn!
                        </h1>
                        <div className="flex gap-x-2">
                            {networks.map((network) => (
                                <Link
                                    className={`${network.css} flex justify-center items-center rounded-full !text-white text-base w-[30px] h-[30px]`}
                                    key={network.id}
                                    href={`${network.link}`}
                                >
                                    {network.icon}
                                </Link>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <p className="text-nav">Vui lòng đăng ký nhận bản tin của chúng tôi tại đây:</p>
                            <form>
                                <div className="grid grid-cols-3 gap-x-2">
                                    <input
                                        type="text"
                                        required
                                        className="border p-2 w-full border-gray-300 rounded outline-none col-span-2"
                                        placeholder="Vui lòng nhập địa chỉ email của bạn"
                                    />
                                    <button
                                        className="uppercase w-full font-semibold bg-primary hover:bg-[#5e8e74] col-span-1 px-2 py-1 transition-all text-white"
                                        type="submit"
                                    >
                                        Đăng ký
                                    </button>
                                </div>
                            </form>
                            <p className="text-nav">
                                Sẽ được sử dụng theo <strong>Chính sách quyền riêng tư</strong> của chúng tôi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-black w-full text-gray-300 py-10 px-4">
                <div className="grid grid-cols-1 place-items-center md:grid-cols-4 lg:grid-cols-4 gap-x-6 mx-auto max-w-full w-layout">
                    <div className="col-span-1">
                        <img src="/footer-logo.webp" alt="" />
                        <p className="my-3">Genshin Impact Global Fansite</p>
                        <p className="text-[12px] font-semibold">
                            Đây là một fansite dành riêng cho Genshin Impact. Tất cả dữ liệu và nội dung từ trò chơi
                            hoặc bất kỳ kênh chính thức nào khác đều là tài sản của nhà phát triển trò chơi Hoyoverse
                            (hoặc miHoYo). Trong khi đó những nhận xét, đề xuất, hướng dẫn và đánh giá được cung cấp
                            trên trang web này là quan điểm cá nhân của đội ngũ biên tập viên đứng sau. Chúng chỉ nhằm
                            mục đích cung cấp thông tin và không đại diện cho quan điểm của Hoyoverse.
                        </p>

                        <a href="/" className="underline my-4 inline-block font-semibold !text-white uppercase">
                            THÊM VỀ GENSHIN.GLOBAL
                        </a>

                        <div className="flex gap-x-2">
                            {networks.slice(0, 4).map((item) => (
                                <a
                                    href="/"
                                    key={item.id}
                                    className="!text-white text-base flex items-center justify-center bg-[#ffffff4d] w-[30px] h-[30px]"
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-1 space-y-3">
                        <p>Disclaimer</p>
                        <p>Privacy Policy</p>
                        <p>Terms & Policies</p>
                        <p>Shopping Guide</p>
                        <p>FAQ</p>
                        <p>Contact Us</p>
                    </div>

                    <div className="col-span-2">
                        <Divider style={{ backgroundColor: '#333', width: '100%' }} />
                        <h3 className="text-white font-semibold text-base mb-4">BÀI ĐĂNG GẦN ĐÂY</h3>
                        {recents.map((item) => (
                            <div key={item.id}>
                                <div className="flex items-center gap-x-2">
                                    <Image src={item.thumbnail} width={60} height={60} alt="" />
                                    <div className="space-y-2">
                                        <a href="/" className="text-white text-sm font-medium hover:text-gray-300">
                                            {item.title}
                                        </a>
                                        <p className="text-nav">{item.time}</p>
                                    </div>
                                </div>
                                {item.divider && <Divider style={{ backgroundColor: '#333', width: '100%' }} />}
                            </div>
                        ))}
                    </div>
                </div>

                <Divider style={{ backgroundColor: '#333', width: '100%' }} />

                <div className="grid place-content-between lg:grid-cols-2 gap-y-3 md:grid-cols-2 grid-cols-1 lg:place-items-start place-items-center mx-auto max-w-full w-layout">
                    <div className="flex items-center text-xs">
                        <span className="text-white">GENSHIN.GLOBAL</span>
                        <span className="text-gray-300 flex items-center">
                            <i>
                                <BiCopyright />
                            </i>{' '}
                            2023
                        </span>
                    </div>

                    <div className="flex items-center gap-x-3">
                        <p className="text-xs font-semibold">SECURE PAYMENT BY</p>

                        <div className="flex flex-wrap">
                            {payments.map((item) => (
                                <Image key={item} height={32} width={60} src={item} alt="" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FooterFn;
