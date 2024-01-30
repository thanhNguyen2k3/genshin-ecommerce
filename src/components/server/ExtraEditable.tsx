import { FC, HTMLAttributes, ReactNode, useState } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import { Option } from '@prisma/client';
import instance from '@/lib/axios';
import { useRouter } from 'next/navigation';

interface EditableCellProps extends HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Option;
    index: number;
    children: ReactNode;
}

const EditableCell: FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

type Props = {
    options: Option[];
    productId?: string;
};

const ExtraEditable = ({ productId, options }: Props) => {
    const router = useRouter();

    const [form] = Form.useForm();

    const data = options.filter((extra) => extra.productId === productId);

    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record: Option) => record.id === editingKey;

    const edit = (record: Partial<Option>) => {
        form.setFieldsValue({ extraName: '', extraPrice: '', ...record });
        setEditingKey(record.id!);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (id: string) => {
        try {
            const row = (await form.validateFields()) as Option;

            const newData = [...data];

            const {} = await instance.patch(`/api/pr/extraoption/${id}`, {
                extraName: row.extraName,
                extraPrice: Number(row.extraPrice),
            });

            router.refresh();

            const index = newData.findIndex((item) => id === item.id);

            if (index > -1) {
                const item = newData[index];

                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });

                setEditingKey('');
            } else {
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'Tên',
            dataIndex: 'extraName',
            key: 'extraName',
            width: '40%',
            editable: true,
        },
        {
            title: 'Chi phí thêm',
            dataIndex: 'extraPrice',
            key: 'extraPrice',
            width: '30%',
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_: any, record: Option) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
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
            onCell: (record: Option) => ({
                record,
                inputType: col.dataIndex === 'extraPrice' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: cancel,
                }}
                rowKey={'id'}
            />
        </Form>
    );
};

export default ExtraEditable;
