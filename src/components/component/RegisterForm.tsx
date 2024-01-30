'use client';

import ButtonComponent from '@/components/local/Button';
import InputField from '@/components/local/InputField';
import instance from '@/lib/axios';
import { Form, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {};

const RegisterForm = ({}: Props) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (values: any) => {
        setLoading(true);
        instance
            .post('/api/pl/user', {
                ...values,
            })
            .then((res) => {
                message.success(res.data.message);
            })
            .then(() => {
                router.push('/login');
            })
            .catch(
                ({
                    response: {
                        data: { message: error },
                    },
                }) => {
                    message.error(error);
                },
            )
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="absolute w-[400px] bg-white/40 p-4">
            <div className="mb-4">
                <Link href={'/'}>
                    <img src="/logo.webp" alt="" />
                </Link>
            </div>
            <Form layout="vertical" onFinish={onSubmit}>
                <InputField
                    label={<span className="text-gray-200">Tên đăng nhập</span>}
                    name={'username'}
                    rules={[{ required: true, message: 'Bắt buộc' }]}
                />
                <InputField
                    label={<span className="text-gray-200">Email</span>}
                    name={'email'}
                    rules={[{ required: true, message: 'Bắt buộc' }]}
                />
                <InputField
                    isPassword
                    label={<span className="text-gray-200">Mật khẩu</span>}
                    name={'password'}
                    rules={[{ required: true, message: 'Bắt buộc' }]}
                />

                <div className="mt-6">
                    <ButtonComponent htmlType="submit" loading={loading}>
                        Đăng ký
                    </ButtonComponent>
                </div>

                <div className="mt-2">
                    <span className="text-white mr-2">Nếu bạn đã có tài khoản?</span>
                    <Link href={'/login'} className="text-white">
                        Đăng nhập?
                    </Link>
                </div>
            </Form>
        </div>
    );
};

export default RegisterForm;
