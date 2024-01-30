'use client';

import ButtonComponent from '@/components/local/Button';
import InputField from '@/components/local/InputField';
import instance from '@/lib/axios';
import { Form, message } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const Page = () => {
    const { data } = useSession();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            email: data?.user.email,
        });
    }, [form]);

    const onSubmit = (values: any) => {
        instance
            .post('/api/pl/change-password', {
                ...values,
            })
            .then((res) => message.info(res.data.message))
            .catch((err: any) => message.error(err.message))
            .finally(() => setLoading(false));
    };

    return (
        <Form form={form} onFinish={onSubmit} layout="vertical" className="grid grid-cols-4">
            <InputField
                className="col-span-4"
                name={'email'}
                label="Email"
                rules={[{ required: true, message: 'Bắt buộc' }]}
            />

            <InputField
                className="col-span-4"
                name={'password'}
                label="Mật khẩu mới"
                rules={[{ required: true, message: 'Bắt buộc' }]}
                isPassword
            />

            <ButtonComponent loading={loading} className="col-span-1 mt-2" htmlType="submit">
                Lưu thay đổi
            </ButtonComponent>
        </Form>
    );
};

export default Page;
