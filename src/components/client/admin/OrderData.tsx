'use client';

import ButtonComponent from '@/components/local/Button';
import instance from '@/lib/axios';
import { StatusEnum } from '@/types/enum';
import { ExtandOrder } from '@/types/extend';
import { formartUSD } from '@/utils/formartUSD';
import {
    CloseSquareOutlined,
    DoubleRightOutlined,
    ExclamationCircleFilled,
    PrinterOutlined,
    RightSquareOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { Order } from '@prisma/client';
import { Button, Input, InputRef, Modal, Space, Table, Form, Select, message, DatePicker } from 'antd';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import { useRouter, useSearchParams } from 'next/navigation';
import { Key, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import styled from 'styled-components';

const { confirm } = Modal;
const { Option } = Select;
const { RangePicker } = DatePicker;

const renderStatus = (status: number) => {
    if (status === StatusEnum.ORDER_UNCONFIRM) return <span>PENDING</span>;
    if (status === StatusEnum.ORDER_CONFIRM) return <span>CONFIRM</span>;
    if (status === StatusEnum.ORDER_SHIPPING) return <span>SHIPPING</span>;
    if (status === StatusEnum.ORDER_COMPLETE) return <span>COMPLETE</span>;
    if (status === StatusEnum.ORDER_CANCELLED) return <span className="text-red-500">CANCELLED</span>;
};

type Props = {
    orders: ExtandOrder[];
};

type DataIndex = keyof ExtandOrder;

const StyleSelect = styled(Select)`
    .ant-select-selector {
        border-radius: 0;

        &:focus {
            border-color: #bbb !important;
        }
    }
`;

const OrderData = ({ orders }: Props) => {
    const router = useRouter();
    const [form] = Form.useForm();

    const searchParams = useSearchParams();

    //state start
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const [editingKey, setEditingKey] = useState('');
    // Selected id
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    // state end

    // Ref start
    const searchInput = useRef<InputRef>(null);
    //Ref end

    // Handle

    const onSelectChange = (newSelectedRowKeys: Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const showCancelledConfirm = (record: Order) => {
        confirm({
            title: <p>Bạn có muốn hủy đơn hàng này</p>,
            icon: <ExclamationCircleFilled />,
            content: <p>Đơn hàng sẽ không hoạt động khi bạn thực hiện thao tác này.😉</p>,
            okText: 'Xác nhận',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                await instance
                    .patch(`/api/pr/order/${record.id}`, {
                        status: 0,
                    })
                    .then(() => {
                        router.refresh();
                        message.success('Hủy đơn hàng thành công');
                    });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
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

    const save = async (id: string, record: ExtandOrder) => {
        try {
            const row = (await form.validateFields()) as Order;

            const newData = [...orders];

            if (selectedRowKeys.length > 0) {
                const orderStatus = orders.find((order) => order.status !== record.status);

                if (orderStatus) {
                    message.warning('Vui lọng lựa chọn những đơn hàng có trạng thái giống nhau để cập nhật');
                } else {
                    instance
                        .patch('/api/pr/order/ids', {
                            status: row.status,
                            orderIds: selectedRowKeys,
                        })
                        .then((res) => {
                            message.success('Cập nhật thành công');
                            router.refresh();
                            setSelectedRowKeys([]);
                        });

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
                }
            } else {
                if (row.status >= StatusEnum.ORDER_CONFIRM) {
                    await instance
                        .patch(`/api/pr/order/${id}`, {
                            status: row.status,
                        })
                        .then(() => {
                            message.success('Cập nhật thành công');
                            router.refresh();
                        });

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
                }
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const showConfirm = (record: ExtandOrder) => {
        confirm({
            title: <h1>Bạn có muốn chuyển trạng thái đơn hàng</h1>,
            icon: <ExclamationCircleFilled />,
            content: (
                <p className="flex items-center gap-x-3">
                    Chuyển trạng thái đơn hàng <DoubleRightOutlined />{' '}
                    <span className="bg-primary text-white px-3 py-2 text-base">
                        {record.status === StatusEnum.ORDER_UNCONFIRM
                            ? 'Xác nhận đơn hàng'
                            : record.status === StatusEnum.ORDER_CONFIRM
                            ? 'Giao hàng'
                            : record.status === StatusEnum.ORDER_SHIPPING
                            ? 'Hoàn thành'
                            : ''}
                    </span>
                </p>
            ),
            onOk: async () => {
                if (selectedRowKeys.length > 0) {
                    const orderStatus = orders.find((order) => order.status !== record.status);

                    if (orderStatus) {
                        message.warning('Vui lọng lựa chọn những đơn hàng có trạng thái giống nhau để cập nhật');
                    } else {
                        await instance
                            .patch('/api/pr/order/ids', {
                                status: record.status + 1,
                                orderIds: selectedRowKeys,
                            })
                            .then((res) => {
                                message.success('Cập nhật thành công');
                                router.refresh();
                                setSelectedRowKeys([]);
                            });
                    }
                } else {
                    await instance
                        .patch(`/api/pr/order/${record.id}`, {
                            status: record.status + 1,
                        })
                        .then(() => {
                            message.success('Cập nhật thành công');
                            router.refresh();
                        });
                }
            },
            onCancel() {
                console.log('Cancel');
            },

            okText: 'Chuyển trạng thái',
            cancelText: 'Hủy',
            okButtonProps: {
                type: 'default',
            },
            closable: false,
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

    const columns: any[] = [
        {
            title: 'Tên khách hàng',
            dataIndex: 'fullName',
            key: 'fullName',
            width: '20%',
            render: (record: string) => {
                return record;
            },
            ...getColumnSearchProps('fullName'),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: '20%',
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            width: '15%',
            render: (record: number) => renderStatus(record),
            editable: true,
        },
        {
            title: 'PAID',
            dataIndex: 'isPaid',
            key: 'isPaid',
            width: '10%',
            render: (record: boolean) => {
                return record ? (
                    <span className="text-green-500">SUCCESS</span>
                ) : (
                    <span className="text-red-500">ERROR</span>
                );
            },
        },
        {
            title: 'Thanh toán',
            dataIndex: 'payMethod',
            key: 'payMethod',
            width: '15%',
            render: (record: number) =>
                record === 1 ? (
                    <span className="text-green-500">Trả sau</span>
                ) : (
                    <span className="text-red-500">Đã thanh toán</span>
                ),
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            width: '20%',
            render: (_: any, record: ExtandOrder) => {
                return (
                    <div className="flex">
                        <ButtonComponent
                            icon={<RightSquareOutlined />}
                            disabled={record.status === StatusEnum.ORDER_CANCELLED || !record.isPaid}
                            onClick={() => showConfirm(record)}
                        />

                        <ButtonComponent
                            disabled={
                                record.status === StatusEnum.ORDER_CANCELLED ||
                                record.status === StatusEnum.ORDER_SHIPPING ||
                                !record.isPaid
                            }
                            onClick={() => showCancelledConfirm(record)}
                            className="ml-2 !bg-red-500"
                            icon={<CloseSquareOutlined />}
                        />

                        <ButtonComponent
                            disabled={record.status === StatusEnum.ORDER_CANCELLED || !record.isPaid}
                            onClick={() => router.push(`orders/${record.id}`)}
                            className="ml-2  !bg-gray-800"
                            icon={<PrinterOutlined />}
                        />
                    </div>
                );
            },
        },
    ];

    // Search params
    const method = searchParams.get('method');

    const handleChangeQueryOrderPayMathod = (value: string) => {
        if (value === '') {
            router.push('?');
        } else {
            router.push(`?method=${value}`);
        }
    };

    const handleChangeStatusQuery = (value: string) => {
        if (value === '') {
            router.push(`?method=${method}&status=`);
        } else {
            router.push(`?method=${method}&status=${value}`);
        }
    };

    // date params
    const onChange = (
        _value: DatePickerProps['value'] | RangePickerProps['value'],
        dateString: [string, string] | string,
    ) => {
        router.push(`?startdate=${dateString[0]}&enddate=${dateString[1]}`);
    };

    // Change Status oderids

    return (
        <div>
            <div className="flex w-full justify-between flex-wrap gap-y-2 mb-2">
                <div className="flex gap-x-3 flex-wrap  gap-y-2">
                    <StyleSelect className="w-[200px]" onChange={handleChangeQueryOrderPayMathod} defaultValue={''}>
                        <Option value="">Phương thức thanh toán</Option>
                        <Option value="1">Trả sau</Option>
                        <Option value="2">Đã thanh toán</Option>
                    </StyleSelect>
                    <StyleSelect className="w-[200px]" onChange={handleChangeStatusQuery} defaultValue={''}>
                        <Option value="">TRẠNG THÁI ĐƠN HÀNG</Option>
                        <Option value="1">PENDING</Option>
                        <Option value="2">CONFIRM</Option>
                        <Option value="3">SHIPPING</Option>
                        <Option value="4">COMPLETE</Option>
                        <Option value="0">CANCELLED</Option>
                    </StyleSelect>
                    <button onClick={() => router.push('?')} className="border px-4 hover:bg-gray-200">
                        Xóa
                    </button>
                </div>

                <div>
                    <span>Tìm kiếm đơn hàng theo ngày : </span>
                    <RangePicker
                        format={'YYYY-MM-DD'}
                        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                        onChange={onChange}
                        showTime={false}
                    />
                </div>
            </div>

            <Form form={form} component={false}>
                <Table
                    rowSelection={rowSelection}
                    expandable={{
                        expandIcon: ({ onExpand, record }) => (
                            <DoubleRightOutlined
                                onClick={(e) => onExpand(record, e)}
                                className="rotate-90 cursor-pointer"
                            />
                        ),
                        expandedRowRender: (record) => {
                            return (
                                <div>
                                    <div className="space-y-1 mb-6">
                                        <h1>
                                            <span className="inline-block w-[180px]">ID:</span> {record.id}
                                        </h1>
                                        <p>
                                            <span className="inline-block w-[180px]">Tên khách hàng:</span>
                                            <span className="font-semibold tracking-wider">{record.fullName}</span>
                                        </p>
                                        <p>
                                            <span className="inline-block w-[180px]">Email:</span>
                                            <span className="font-semibold tracking-wider">{record?.email}</span>
                                        </p>
                                        <p>
                                            <span className="inline-block w-[180px]">Số điện thoại:</span>
                                            <span className="font-semibold tracking-wider">{record.phone}</span>
                                        </p>
                                        <p>
                                            <span className="inline-block w-[180px]">Địa chỉ:</span>
                                            <span className="font-semibold tracking-wider">{record.address}</span>
                                        </p>
                                        <p>
                                            <span className="inline-block w-[180px]">Địa chỉ chi tiết:</span>
                                            <span className="font-semibold tracking-wider">{record.detailAddress}</span>
                                        </p>
                                        <p>
                                            <span className="inline-block w-[180px]">Tổng: </span>
                                            <span className="font-semibold tracking-wider">
                                                {formartUSD(record.total)}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="inline-block w-[180px]">Phương thức thanh toán:</span>
                                            <span className="font-semibold tracking-wider">
                                                {record.payMethod === 1 ? 'Trả sau' : 'Đã thanh toán'}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="inline-block w-[180px]">Giao hàng:</span>
                                            <span className="font-semibold tracking-wider">
                                                {record.deliveryMethod === 1 ? 'Tiêu chuẩn' : 'Nhanh'}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="inline-block w-[180px]">Status:</span>
                                            <span className="font-semibold tracking-wider">
                                                {renderStatus(record.status)}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="inline-block w-[180px]">Ngày đặt hàng:</span>
                                            <span className="font-semibold tracking-wider">
                                                {record.createdAt.toLocaleDateString()}
                                            </span>
                                        </p>
                                    </div>
                                    <table className="border-spacing-2 !rounded-none">
                                        <thead className="!rounded-none">
                                            <tr>
                                                <th className="text-left border p-2 !rounded-none">Tên sản phẩm</th>
                                                <th className="text-left border p-2 !rounded-none">Số lượng</th>
                                                <th className="text-left border p-2 !rounded-none">Giá</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {record.orderItems.map((item, index) => {
                                                const color = item?.variant?.color
                                                    ? ' - ' + item.variant.color.name
                                                    : '';
                                                const size = item?.variant?.size ? ' - ' + item.variant.size.value : '';
                                                const option = item?.variant?.optionName
                                                    ? ' - ' + item.variant.optionName
                                                    : '';

                                                let orderName = (
                                                    <p>
                                                        {item.product.name}{' '}
                                                        <span className="font-bold">{color! + size! + option!}</span>
                                                    </p>
                                                );

                                                if (item.product.type === 'variant') {
                                                    return (
                                                        <tr key={index}>
                                                            <td className="border flex items-center gap-x-2 p-2">
                                                                <img
                                                                    src={`/uploads/${item?.variant?.image}`}
                                                                    width={50}
                                                                    height={50}
                                                                    alt="image"
                                                                />
                                                                {orderName}
                                                            </td>
                                                            <td className="border p-2">{item?.quantity}</td>
                                                            <td className="border p-2">
                                                                {formartUSD(item?.price! * item?.quantity)}
                                                            </td>
                                                        </tr>
                                                    );
                                                } else {
                                                    return (
                                                        <tr key={index}>
                                                            <td className="border flex items-center gap-x-2 p-2">
                                                                <img
                                                                    src={`/uploads/${item.product?.images[0]}`}
                                                                    width={50}
                                                                    height={50}
                                                                    alt=""
                                                                />
                                                                {item.product?.name}
                                                            </td>
                                                            <td className="border p-2">{item?.quantity}</td>
                                                            <td className="border p-2">
                                                                {formartUSD(item?.product?.price! * item?.quantity)}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        },
                    }}
                    rowKey={'id'}
                    columns={columns}
                    dataSource={orders}
                    scroll={{ x: 1000 }}
                />
            </Form>
        </div>
    );
};

export default OrderData;
