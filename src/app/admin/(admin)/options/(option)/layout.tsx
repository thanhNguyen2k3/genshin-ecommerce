'use client';

import UploadFilePublic from '@/components/admin/uploads/UploadFileServer';
import ButtonComponent from '@/components/local/Button';
import InputField from '@/components/local/InputField';
import instance from '@/lib/axios';
import { CommentOutlined, CustomerServiceOutlined, FileAddOutlined, MenuOutlined } from '@ant-design/icons';
import { Divider, Drawer, FloatButton, Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';
import { ReactNode, SyntheticEvent, useState } from 'react';
import styled from 'styled-components';

type Props = {
    children: ReactNode;
};

const StyleFloatButton = styled(FloatButton)`
    .ant-float-btn-body {
        background-color: #6eb89f;

        .ant-float-btn-icon {
            color: #fff !important;
        }

        &:hover {
            .ant-float-btn-icon {
                color: #000 !important;
            }
        }
    }
`;

const Layout = ({ children }: Props) => {
    const router = useRouter();
    const [form] = Form.useForm();

    // State
    const [thumbnail, setThumbnail] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [loadingBrand, setLoadingBrand] = useState(false);
    const [open, setOpen] = useState(false);
    // Void

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const handleChangeThumbnail = async (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;

        const file = target.files![0];

        const formData = new FormData();
        formData.append('file', file);

        await instance.post('/api/pr/uploads', formData);

        setThumbnail(file?.name);
    };

    const handleCreateCategory = async (values: any) => {
        try {
            setLoading(true);
            await instance
                .post('/api/pr/category', {
                    ...values,
                    thumbnail,
                })
                .then(() => {
                    router.push('/admin/options/categories');
                    router.refresh();
                    form.resetFields();
                    message.success('Thêm danh mục thành công');
                });
        } catch (error: any) {
            message.error(error.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBrand = async (values: any) => {
        try {
            setLoadingBrand(true);
            await instance
                .post('/api/pr/brand', {
                    ...values,
                })
                .then(() => {
                    router.push('/admin/options/brands');
                    router.refresh();
                    form.resetFields();
                    message.success('Thêm danh mục thành công');
                });
        } catch (error: any) {
            message.error(error.message);
            setLoadingBrand(false);
        } finally {
            setLoadingBrand(false);
        }
    };

    return (
        <div>
            {children}
            <Drawer title="Thêm danh mục, Thương hiệu" width={600} placement="right" onClose={onClose} open={open}>
                {/* Category */}

                <Form form={form} layout="vertical" onFinish={handleCreateCategory}>
                    <div>
                        <h1 className="font-semibold text-base mb-2">Danh mục</h1>
                        <Form.Item>
                            <Input type="file" onChange={handleChangeThumbnail} />
                        </Form.Item>
                        <div>
                            <InputField
                                label={'Tên danh mục'}
                                name={'name'}
                                rules={[{ required: true, message: 'Bắt buộc' }]}
                            />
                            <ButtonComponent loading={loading} htmlType="submit" className="!w-1/2">
                                Thêm
                            </ButtonComponent>
                        </div>
                    </div>
                </Form>

                <Divider />

                {/* Brand */}

                <Form layout="vertical" onFinish={handleCreateBrand}>
                    <div>
                        <h1 className="font-semibold text-base mb-2">Thương hiệu</h1>

                        <div>
                            <InputField
                                label={'Tên thương hiệu'}
                                name={'name'}
                                rules={[{ required: true, message: 'Bắt buộc' }]}
                            />
                            <ButtonComponent htmlType="submit" loading={loadingBrand} className="!w-1/2">
                                Thêm
                            </ButtonComponent>
                        </div>
                    </div>
                </Form>

                {/* Character */}
            </Drawer>
            <StyleFloatButton.Group trigger="click" icon={<MenuOutlined />}>
                <StyleFloatButton onClick={showDrawer} icon={<FileAddOutlined />} />
                <StyleFloatButton icon={<CommentOutlined />} />
            </StyleFloatButton.Group>
        </div>
    );
};

export default Layout;
