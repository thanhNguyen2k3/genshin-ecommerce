'use client';

import instance from '@/lib/axios';
import { ExtandOrder } from '@/types/extend';
import { formartUSD } from '@/utils/formartUSD';
import { DeleteOutlined, ExclamationCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Order, OrderItem, Product, User } from '@prisma/client';
import { Button, Input, InputRef, Modal, Space, Table } from 'antd';
import { ColumnType, ColumnsType, FilterConfirmProps } from 'antd/es/table/interface';
import { useRouter } from 'next/navigation';
import { Key, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { FaTrashRestore } from 'react-icons/fa';

const { confirm } = Modal;

type Props = {
    orders: ExtandOrder[];
};

type ExtandOrderItem = OrderItem & {
    product: Product;
    user: User;
};

type DataIndex = keyof ExtandOrder;

const OrderInTrash = ({ orders }: Props) => {
    const router = useRouter();

    //state start
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    // Selected id
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    // state end

    // Ref start
    const searchInput = useRef<InputRef>(null);
    //Ref end

    const hasSelected = selectedRowKeys.length > 0;

    const onSelectChange = (newSelectedRowKeys: Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    // Edit row start

    const showRestore = (record: Order) => {
        confirm({
            title: <p>Bạn có muốn khôi phục đơn hàng</p>,
            icon: <ExclamationCircleFilled />,
            content: <p>Đơn hàng sẽ được khôi phục.😉</p>,
            okText: 'Xác nhận',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                const { status } = await instance.patch(`/api/pr/order/${record.id}/restore`, {
                    deleted: false,
                });
                if (status === 200) {
                    router.refresh();
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const showDestroy = (record: Order) => {
        confirm({
            title: <p>Bạn có thật sự muốn xóa đơn hàng này</p>,
            icon: <ExclamationCircleFilled />,
            content: <div>Đơn hàng sẽ được loại bỏ hoàn toàn khỏi Database.😓</div>,
            okText: 'Xác nhận',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {},
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    // Edit row end
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<ExtandOrder> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="default"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
        onFilter: (value, record) =>
            (record as any)[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns: ColumnsType<ExtandOrder> = [
        {
            title: 'Tên khách hàng',
            dataIndex: 'user',
            key: 'user',
            width: '20%',
            render: (record: { name: string }) => {
                return record.name;
            },
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: '20%',
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Tổng giá',
            dataIndex: 'orderItems',
            key: 'orderItems',
            width: '10%',
            render: (record: ExtandOrderItem[]) => {
                return formartUSD(
                    record.reduce((total: number, item: { product: Product; quantity: number }) => {
                        return total + item.product?.price * item.quantity;
                    }, 0),
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isPaid',
            key: 'isPaid',
            width: '15%',
            render: (record: boolean) =>
                record ? (
                    <span className="text-green-500">Thành công</span>
                ) : (
                    <span className="text-red-500">Thất bại</span>
                ),
        },
        {
            title: 'Actions',
            dataIndex: 'operation',
            width: '20%',
            render: (_, record) => {
                return (
                    <div>
                        <Button onClick={() => showRestore(record)} type="default" icon={<FaTrashRestore />} />

                        <Button
                            onClick={() => showDestroy(record)}
                            type="default"
                            className="ml-2"
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <Table
            rowSelection={rowSelection}
            expandable={{
                expandedRowRender: (record) => {
                    return (
                        <table className="border-spacing-2 !rounded-none border border-slate-400">
                            <thead className="!rounded-none">
                                <tr>
                                    <th className="text-left border border-slate-300 p-2 !rounded-none">
                                        Tên sản phẩm
                                    </th>
                                    <th className="text-left border border-slate-300 p-2 !rounded-none">Số lượng</th>
                                    <th className="text-left border border-slate-300 p-2 !rounded-none">Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {record.orderItems.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="border border-slate-300 p-2">{item.name}</td>
                                            <td className="border border-slate-300 p-2">{item.quantity}</td>
                                            <td className="border border-slate-300 p-2">
                                                {formartUSD(item.product.price * item.quantity)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    );
                },
            }}
            rowKey={'id'}
            columns={columns}
            dataSource={orders}
            scroll={{ x: 1000 }}
        />
    );
};

export default OrderInTrash;
