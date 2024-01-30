'use client';

import InputField from '@/components/local/InputField';
import instance from '@/lib/axios';
import { ExtandUser } from '@/types/extend';
import { SearchOutlined } from '@ant-design/icons';
import { Color, User } from '@prisma/client';
import { Form, Select, Table, Typography, message } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import styled from 'styled-components';

const { Option } = Select;

const StyleSelect = styled(Select)`
    width: 100%;
    .ant-select-selector {
        border-radius: 0;

        &:focus {
            border-color: #bbb !important;
        }
    }
`;

type Props = {
    users: ExtandUser[];
};

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: User;
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
                <Form.Item name={dataIndex}>
                    <StyleSelect defaultValue={record.inActive}>
                        <Option value={true}>Kích hoạt</Option>
                        <Option value={false}>Ngừng truy cập</Option>
                    </StyleSelect>
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const FormColor = ({ users }: Props) => {
    const router = useRouter();

    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record: User) => record.id === editingKey;

    const edit = (record: Partial<User> & { id: string }) => {
        form.setFieldsValue({ inActive: '', ...record });
        setEditingKey(record.id!);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (id: string) => {
        const row = (await form.validateFields()) as User;

        const newData = [...users];
        const index = newData.findIndex((item) => id === item.id);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
                ...item,
                ...row,
            });

            instance
                .patch(`/api/pr/user/${id}`, {
                    inActive: row.inActive,
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
            title: 'Email',
            dataIndex: 'email',
            width: '15%',
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            width: '15%',
            render: (record: string) => {
                return !record ? 'Chưa cập nhật' : record;
            },
        },
        {
            title: 'Tên đẩy đủ',
            dataIndex: 'fullName',
            width: '25%',
            render: (record: string) => {
                return !record ? 'Chưa cập nhật' : record;
            },
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            width: '20%',
            render: (record: string) => {
                return !record ? 'Chưa cập nhật' : record;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'inActive',
            width: '15%',
            render: (record: boolean) => {
                return record ? (
                    <span className="text-green-500">Đã kích hoạt</span>
                ) : (
                    <span className="text-red-500">Chưa kích hoạt</span>
                );
            },
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_: any, record: User) => {
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
            onCell: (record: User) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    // Search query
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams],
    );

    return (
        <>
            <div className="w-[300px] mb-4">
                <InputField
                    onChange={(e) => {
                        return router.push(`${pathname}?${createQueryString('q', e.target.value)}`);
                    }}
                    prefix={<SearchOutlined />}
                    placeholder="Tên người dùng,email,..."
                />
            </div>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={users}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    rowKey={'id'}
                    scroll={{ x: 1200 }}
                />
            </Form>
        </>
    );
};

export default FormColor;
