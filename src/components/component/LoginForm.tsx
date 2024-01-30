'use client';

import ButtonComponent from '@/components/local/Button';
import InputField from '@/components/local/InputField';
import { GoogleOutlined } from '@ant-design/icons';
import { Form, message } from 'antd';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {};

const LoginForm = ({}: Props) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (values: any) => {
        setLoading(true);
        signIn('credentials', {
            ...values,
            redirect: false,
        })
            .then((callback) => {
                if (callback?.ok) {
                    message.success('Đăng nhập thành công');
                    router.push('/');
                }

                if (callback?.error) {
                    setLoading(false);
                    message.error('Đăng nhập thất bại');
                }
            })
            .catch((error: any) => {
                message.error(error.message);
            })
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
                        Đăng nhập
                    </ButtonComponent>
                </div>

                <div className="mt-2">
                    <span className="text-white mr-2">Nếu bạn chưa có tài khoản?</span>
                    <Link href={'/register'} className="text-white">
                        Đăng ký?
                    </Link>
                </div>
                <Link href={'/forgot-password'} className="text-white">
                    Quên mật khẩu?
                </Link>
            </Form>

            <button
                onClick={() => signIn('google')}
                className="bg-gradient-to-r space-x-1 mt-2 from-[#4285f4] w-full py-2 px-2 rounded-sm text-white to-[#ea4335]"
            >
                <GoogleOutlined />
                <span>Đang nhập bằng Google</span>
            </button>
        </div>
    );
};

export default LoginForm;
