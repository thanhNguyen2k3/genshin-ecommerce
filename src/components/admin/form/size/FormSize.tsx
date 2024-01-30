'use client';

import ButtonComponent from '@/components/local/Button';
import InputField from '@/components/local/InputField';
import instance from '@/lib/axios';
import { Color, Size } from '@prisma/client';
import { Form, Input, InputNumber, Table, Typography, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
    sizes: Size[];
};

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Color;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    return (
        <td {...restProps}>
            {editing ? (
                <InputField
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Không được bỏ trống!`,
                        },
                    ]}
                />
            ) : (
                children
            )}
        </td>
    );
};

const FormSize = ({ sizes }: Props) => {
    const router = useRouter();

    const [form] = Form.useForm();
    const [formCraete] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [loading, setLoading] = useState(false);

    const isEditing = (record: Color) => record.id === editingKey;

    const edit = (record: Partial<Color> & { id: string }) => {
        form.setFieldsValue({ name: '', age: '', address: '', ...record });
        setEditingKey(record.id!);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (id: string) => {
        const row = (await form.validateFields()) as Color;

        const newData = [...sizes];
        const index = newData.findIndex((item) => id === item.id);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
                ...item,
                ...row,
            });

            instance
                .patch(`/api/pr/size/${id}`, {
                    name: row.name,
                    value: row.value,
                })
                .then(() => {
                    message.success('Cập nhật thành công');
                })
                .then(() => {
                    router.refresh();
                })
                .catch((err) => message.error(err.message));

            setEditingKey('');
        } else {
            setEditingKey('');
        }
    };

    const columns = [
        {
            title: 'Tên kích cỡ',
            dataIndex: 'name',
            width: '25%',
            editable: true,
        },
        {
            title: 'Mã kích cỡ',
            dataIndex: 'value',
            width: '15%',
            render: (record: string) => {
                return <span>{record}</span>;
            },
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_: any, record: Color) => {
                const editable = isEditing(record);
                return editable ? (
                    <div>
                        <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
                            Lưu
                        </Typography.Link>

                        <span onClick={cancel}>Hủy</span>
                    </div>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Sửa
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Color) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const onSubmit = (values: any) => {
        setLoading(true);
        instance
            .post(`/api/pr/size`, {
                ...values,
            })
            .then(() => {
                message.success('Tạo mới thành công');
                formCraete.resetFields();
                router.refresh();
            })
            .catch((err) => message.error(err.message))
            .finally(() => setLoading(false));
    };

    return (
        <>
            <Form form={formCraete} layout="vertical" onFinish={onSubmit}>
                <div className="flex gap-x-4">
                    <InputField name={'name'} label={'Tên kích cỡ'} rules={[{ required: true, message: 'Bắt buộc' }]} />
                    <InputField
                        name={'value'}
                        label={'Mã kích cỡ'}
                        rules={[
                            { required: true, message: 'Bắt buộc' },
                            { whitespace: false, message: 'Không được có khoảng trắng' },
                        ]}
                    />
                </div>

                <ButtonComponent htmlType="submit" loading={loading} className="!w-[120px]">
                    Thêm mới
                </ButtonComponent>
            </Form>

            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={sizes}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    rowKey={'id'}
                />
            </Form>
        </>
    );
};

export default FormSize;
