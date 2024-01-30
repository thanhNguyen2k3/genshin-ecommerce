'use client';

import { Form, message } from 'antd';
import InputField from '../local/InputField';
import Link from 'next/link';
import ButtonComponent from '../local/Button';
import { useState } from 'react';
import instance from '@/lib/axios';

const ForgotPassword = () => {
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);

    const onSubmit = (values: any) => {
        setLoading(true);
        instance
            .post('/api/pl/forgot-password', { ...values })
            .then((res) => {
                message.warning(res.data.message);
                form.resetFields();
            })
            .catch(() => message.error('Gửi email không thành công'))
            .finally(() => setLoading(false));
    };

    return (
        <div className="absolute w-[400px] bg-white/40 p-4">
            <div className="mb-4">
                <Link href={'/'}>
                    <img src="/logo.webp" alt="" />
                </Link>
            </div>

            <Form layout="vertical" onFinish={onSubmit}>
                <InputField required={true} name={'email'} label={'Địa chỉ Email'} />
                <div className="mt-6">
                    <ButtonComponent htmlType="submit" loading={loading}>
                        Gửi
                    </ButtonComponent>
                </div>
            </Form>

            <Link href={'/login'} className="text-white text-center mt-2">
                Quay lại.
            </Link>
        </div>
    );
};

export default ForgotPassword;
