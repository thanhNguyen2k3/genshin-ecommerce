'use client';

import { Category } from '@prisma/client';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Button, Form, Image, Input, Modal, message } from 'antd';
import styled from 'styled-components';
import { ExclamationCircleFilled } from '@ant-design/icons';
import InputField from '@/components/local/InputField';
import instance from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
const { confirm } = Modal;

type Props = {
    categories: Category[];
};

const StyleButton = styled(Button)`
    background-color: #6eb89f;
    color: #fff !important;
    border-radius: 2px;

    &:hover {
        border-color: #6eb89f !important;
    }
`;

const CategoriesData = ({ categories }: Props) => {
    // Router
    const router = useRouter();
    const params = useSearchParams();
    const id = params.get('id');

    // State
    const [mount, setMount] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [thumbnail, setThumbnail] = useState<string>('');

    const showModal = (data: Category) => {
        setIsModalOpen(true);

        form.setFieldsValue({
            name: data?.name,
            thumbnail: data?.thumbnail,
        });

        router.push(`?id=${data.id}`);
    };

    const handleChangeThumbnail = async (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;

        const file: any = target.files?.[0]!;

        const formData = new FormData();
        formData.append('file', file!);

        await instance.post('/api/pr/uploads', formData);

        setThumbnail(file?.name);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        router.replace('?id');
        setThumbnail('');
    };

    const handleOk = async () => {
        await instance
            .patch(`/api/pr/category/${id}`, {
                name: form.getFieldValue('name'),
                thumbnail: thumbnail.length > 0 ? thumbnail : form.getFieldValue('thumbnail'),
            })
            .then(() => {
                router.refresh();
                message.success('Sửa thành công');
            });
        setIsModalOpen(false);
    };

    const showDeleteConfirm = (id: string) => {
        confirm({
            title: `Bạn có muốn xóa danh mục này ${id}`,
            icon: <ExclamationCircleFilled />,
            content: 'Danh mục sẽ được xóa khỏi database',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await instance.delete(`/api/pr/category/${id.toString()}`).then(() => {
                        router.refresh();
                        form.resetFields();
                        message.success('Đã xóa thành công');
                    });
                } catch (error: any) {
                    message.error(error.message);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    useEffect(() => {
        setMount(true);
    }, []);

    if (!mount) {
        return null;
    }

    return (
        <div>
            <div className="max-w-full overflow-x-auto overflow-hidden">
                <table className="table-auto border border-gray-300 w-full min-w-[500px]">
                    <thead>
                        <tr>
                            <th className="py-1">Thumnail</th>
                            <th className="py-2">Danh mục</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories?.map((cate) => (
                            <tr key={cate.id}>
                                <td className="text-center border border-gray-300 px-2 py-2">
                                    <Image
                                        preview
                                        width={60}
                                        height={60}
                                        src={`/uploads/${cate.thumbnail}`}
                                        alt="images"
                                    />
                                </td>
                                <td className="text-center border border-gray-300 w-full px-2 py-2">{cate.name}</td>
                                <td className="border border-gray-300 px-2 py-2">
                                    <StyleButton onClick={() => showModal(cate)}>Sửa</StyleButton>
                                    <StyleButton
                                        className="!bg-red-500 mt-1"
                                        onClick={() => showDeleteConfirm(cate.id)}
                                    >
                                        Xóa
                                    </StyleButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                title="Basic Modal"
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleOk}
                okButtonProps={{ type: 'default' }}
            >
                <Form form={form} layout="vertical">
                    <Image preview src={`/uploads/${form.getFieldValue('thumbnail')}`} />
                    <Input type="file" name="thumbnail" onChange={handleChangeThumbnail} />

                    <InputField
                        name={'name'}
                        label={'Tên danh mục'}
                        rules={[{ required: true, message: 'bắt buộc' }]}
                    />
                </Form>
            </Modal>
        </div>
    );
};

export default CategoriesData;
