'use client';

import ButtonComponent from '@/components/local/Button';
import InputField from '@/components/local/InputField';
import instance from '@/lib/axios';
import { CameraOutlined } from '@ant-design/icons';
import { Region, Vision, Weapon } from '@prisma/client';
import { Form, Select, message } from 'antd';
import { useRouter } from 'next/navigation';
import React, { SyntheticEvent, useEffect, useState } from 'react';

type Props = {
    visions: Vision[];
    weapons: Weapon[];
    regions: Region[];
};

const { Option } = Select;

const FormCharacter = ({ regions, visions, weapons }: Props) => {
    const router = useRouter();
    const [form] = Form.useForm();

    const [thumbnail, setThumbnail] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');

    const onChange = async (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;

        const file = target.files![0];

        const formData = new FormData();
        formData.append('file', file);

        try {
            await instance.post('/api/pr/uploads', formData).then((res) => {
                setThumbnail(res.data.url);
            });
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const onSubmit = async (values: any) => {
        try {
            setLoading(true);

            await instance
                .post('/api/pr/character', {
                    thumbnail,
                    ...values,
                })
                .then(() => {
                    router.refresh();
                    setThumbnail('');
                    form.resetFields();
                    message.success('Tạo nhân vật thành công');
                });
        } catch (error) {
            setLoading(false);
            message.error('Tạo nhân vật thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:gap-x-4 lg:grid-cols-3 gap-y-4">
            <div className="border-dashed col-span-1 relative border border-gray-500 bg-black">
                <div className="px-4 py-4 text-white">
                    <div className="border border-dashed p-3 border-gray-500 ">
                        {thumbnail?.length === 0 ? (
                            <img src="/furina.webp" className="w-full h-full opacity-0" alt="" />
                        ) : (
                            <img src={`/uploads/${thumbnail}`} className="w-full h-full" alt="" />
                        )}
                    </div>

                    <div className="space-y-1 mt-2">
                        <div className="flex justify-between px-4">
                            <p className="space-x-2">
                                <span className="inline-block">Nhân vật: </span>
                                <span className="text-base font-semibold">{name}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <label className="block bottom-0 py-2 left-0 transition-all right-0 bg-gray-800/60 hover:bg-gray-800/80 cursor-pointer">
                    <div className="text-white text-center">
                        <CameraOutlined className="text-2xl" />
                        <p>Thêm ảnh</p>
                    </div>
                    <input type="file" className="opacity-0 absolute" onChange={onChange} />
                </label>
            </div>

            <Form form={form} className="col-span-2" onFinish={onSubmit}>
                <InputField name={'name'} placeholder="Tên nhân vật" onChange={(e) => setName(e.target.value)} />

                <Form.Item name={'regionId'}>
                    <Select defaultValue={''}>
                        <Option value={''}>-- Chọn vùng --</Option>
                        {regions.map((region) => (
                            <Option key={region.id} value={region.id}>
                                {region.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name={'weaponId'}>
                    <Select defaultValue={''}>
                        <Option value={''}>-- Chọn vũ khí --</Option>
                        {weapons.map((weapon) => (
                            <Option key={weapon.id} value={weapon.id}>
                                {weapon.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name={'visionId'}>
                    <Select defaultValue={''}>
                        <Option value={''}>-- Chọn vision --</Option>
                        {visions.map((vision) => (
                            <Option key={vision.id} value={vision.id}>
                                {vision.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <ButtonComponent htmlType="submit" loading={loading} disabled={thumbnail?.length === 0}>
                    Lưu nhân vật
                </ButtonComponent>
            </Form>
        </div>
    );
};

export default FormCharacter;
