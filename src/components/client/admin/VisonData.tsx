'use client';

import { Brand, Vision } from '@prisma/client';
import { useEffect, useState } from 'react';
import { Button, Form, Modal, message } from 'antd';
import styled from 'styled-components';
import { ExclamationCircleFilled } from '@ant-design/icons';
import InputField from '@/components/local/InputField';
import instance from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
const { confirm } = Modal;

type Props = {
    visions: Vision[];
};

const StyleButton = styled(Button)`
    background-color: #6eb89f;
    color: #fff !important;
    border-radius: 2px;

    &:hover {
        border-color: #6eb89f !important;
    }
`;

const VisonData = ({ visions }: Props) => {
    // Router
    const router = useRouter();
    const params = useSearchParams();
    const id = params.get('id');

    // State
    const [mount, setMount] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const showModal = (data: Vision) => {
        setIsModalOpen(true);

        form.setFieldsValue({
            name: data?.name,
        });

        router.push(`?id=${data.id}`);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        router.replace('?id');
    };

    const handleOk = async () => {
        await instance
            .patch(`/api/pr/brand/${id}`, {
                name: form.getFieldValue('name'),
            })
            .then(() => {
                router.refresh();
                form.resetFields();
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
                            <th className="py-2">Visions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visions.map((vision) => (
                            <tr key={vision.id}>
                                <td className="text-center border border-gray-300 w-full px-2 py-2">{vision.name}</td>
                                <td className="border border-gray-300 px-2 py-2">
                                    <StyleButton onClick={() => showModal(vision)}>Sửa</StyleButton>
                                    <StyleButton
                                        className="!bg-red-500 mt-1"
                                        onClick={() => showDeleteConfirm(vision.id)}
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

export default VisonData;
