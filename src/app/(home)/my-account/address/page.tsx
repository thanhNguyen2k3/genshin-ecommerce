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
            fullName: data?.user?.fullName,
            phoneNumber: data?.user?.phoneNumber,
            detailAddress: data?.user?.detailAddress,
        });
    }, [form, data]);

    const onSubmit = (values: any) => {
        setLoading(true);
        instance
            .post('/api/pl/update-user', {
                ...values,
            })
            .then((res) => message.info(res.data.message))
            .then(() => window.location.reload())
            .catch((err: any) => message.error(err.message))
            .finally(() => setLoading(false));
    };

    return (
        <Form form={form} onFinish={onSubmit} layout="vertical" className="grid grid-cols-4">
            <InputField
                className="col-span-4"
                name={'email'}
                label="Email"
                disabled
                rules={[{ required: true, message: 'Bắt buộc' }]}
            />

            <InputField
                className="col-span-4"
                name={'fullName'}
                label="Tên đầy đủ"
                rules={[{ required: true, message: 'Bắt buộc' }]}
            />

            <InputField
                className="col-span-4"
                name={'phoneNumber'}
                label="Số điện thoại"
                rules={[
                    { required: true, message: 'Bắt buộc' },
                    { max: 11, message: 'Quá 11 ký tự' },
                ]}
            />

            <InputField
                className="col-span-4"
                name={'detailAddress'}
                label={'Chi tiết địa chỉ'}
                rules={[{ required: true, message: 'Bắt buộc' }]}
            />

            <ButtonComponent loading={loading} className="col-span-1 mt-2" htmlType="submit">
                Lưu thay đổi
            </ButtonComponent>
        </Form>
    );
};

export default Page;
