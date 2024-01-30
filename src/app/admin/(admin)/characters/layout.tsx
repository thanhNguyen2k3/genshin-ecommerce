'use client';

import ButtonComponent from '@/components/local/Button';
import InputField from '@/components/local/InputField';
import instance from '@/lib/axios';
import { CommentOutlined, FileAddOutlined, MenuOutlined } from '@ant-design/icons';
import { Divider, Drawer, FloatButton, Form, message } from 'antd';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
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
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();

    // State
    const [loading, setLoading] = useState(false);
    const [loadingWeapon, setLoadingWeapon] = useState(false);
    const [loadingVision, setLoadingVision] = useState(false);
    const [open, setOpen] = useState(false);
    // Void

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    // handle

    const createRegion = async (values: any) => {
        try {
            setLoading(true);
            await instance
                .post('/api/pr/region', {
                    ...values,
                })
                .then(() => {
                    router.push('/admin/characters/regions');
                    router.refresh();
                    form.resetFields();
                    message.success('Thêm vùng thành công');
                });
        } catch (error: any) {
            message.error(error.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const createWeapon = async (values: any) => {
        try {
            setLoadingWeapon(true);
            await instance
                .post('/api/pr/weapon', {
                    ...values,
                })
                .then(() => {
                    router.push('/admin/characters/weapons');
                    router.refresh();
                    form1.resetFields();
                    message.success('Thêm vùng thành công');
                });
        } catch (error: any) {
            message.error(error.message);
            setLoadingWeapon(false);
        } finally {
            setLoadingWeapon(false);
        }
    };

    const createVision = async (values: any) => {
        try {
            setLoadingVision(true);
            await instance
                .post('/api/pr/vision', {
                    ...values,
                })
                .then(() => {
                    router.push('/admin/characters/visions');
                    router.refresh();
                    form2.resetFields();
                    message.success('Thêm vùng thành công');
                });
        } catch (error: any) {
            message.error(error.message);
            setLoadingVision(false);
        } finally {
            setLoadingVision(false);
        }
    };

    return (
        <div>
            <div>{children}</div>
            <Drawer title="Thêm danh mục, Thương hiệu" width={600} placement="right" onClose={onClose} open={open}>
                {/* Category */}

                <Form form={form} layout="vertical" onFinish={createRegion}>
                    <div>
                        <h1 className="font-semibold text-base mb-2">Regions</h1>

                        <div>
                            <InputField
                                label={'Tên vùng'}
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

                <Form form={form1} layout="vertical" onFinish={createWeapon}>
                    <div>
                        <h1 className="font-semibold text-base mb-2">Weapons</h1>

                        <div>
                            <InputField
                                label={'Vũ khí'}
                                name={'name'}
                                rules={[{ required: true, message: 'Bắt buộc' }]}
                            />
                            <ButtonComponent htmlType="submit" loading={loadingWeapon} className="!w-1/2">
                                Thêm
                            </ButtonComponent>
                        </div>
                    </div>
                </Form>

                <Divider />

                <Form form={form2} layout="vertical" onFinish={createVision}>
                    <div>
                        <h1 className="font-semibold text-base mb-2">Visons</h1>

                        <div>
                            <InputField
                                label={'Vison'}
                                name={'name'}
                                rules={[{ required: true, message: 'Bắt buộc' }]}
                            />
                            <ButtonComponent htmlType="submit" loading={loadingVision} className="!w-1/2">
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
