'use client';

import AlertError from '@/components/ui/AlertError';
import instance from '@/lib/axios';
import { clear } from '@/slices/cart';
import { useAppDispatch } from '@/store/hook';
import { message } from 'antd';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

type Props = {
    params: {
        id: string;
    };
};

const StyleBackground = styled.div`
    background-image: url('/gallery/thanks.gif');
    padding-top: 60%;
    background-size: 100%;
    object-fit: cover;
    position: relative;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyleInline = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.623);
    max-width: 100%;
    padding: 20px 60px;
    max-height: calc(100% - 60px);
`;

const Page = ({ params: { id } }: Props) => {
    const params = useSearchParams();
    const router = useRouter();
    const { data } = useSession();
    const dispatch = useAppDispatch();

    const code = params.get('vnp_ResponseCode');

    const shouldLog = useRef(true);

    // useEffect(() => {
    //     if (shouldLog.current) {
    //         shouldLog.current = false;

    //         if (!id || Number(code) !== Number('00') || (id && Number(code) !== Number('00'))) {
    //             notFound();
    //         }
    //     }
    // }, []);

    useEffect(() => {
        if (!params.get('vnp_ResponseCode')) {
            return;
        } else {
            if (shouldLog.current) {
                shouldLog.current = false;

                if (Number(code) === Number('00')) {
                    const makeRequest = async () => {
                        await instance
                            .patch(`/api/pl/vnpay/${id}`, {
                                isPaid: Boolean(true),
                            })
                            .then(async () => {
                                await instance.post(`/api/pl/send-email/${id}`, {}).then(() => {
                                    dispatch(clear());
                                    setTimeout(() => {
                                        router.push('/');
                                    }, 5000);
                                });
                            });
                    };
                    makeRequest();

                    message.success('Thanh toán thành công');
                } else {
                    message.error('Thanh toán thất bại').then(() => router.push('/shopping-cart/checkout'));
                }
            }
        }
    }, []);

    return (
        <StyleBackground>
            {Number(code) === Number('00') ? (
                <StyleInline>
                    <h1 className="text-white uppercase text-center text-2xl">Cảm ơn nhà lữ hành đã ủng hộ 🥰</h1>
                </StyleInline>
            ) : (
                <StyleInline>
                    <AlertError message="Thanh toán không thành công" />
                </StyleInline>
            )}
        </StyleBackground>
    );
};

export default Page;
