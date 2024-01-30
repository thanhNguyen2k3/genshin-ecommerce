'use client';

import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Category, Product } from '@prisma/client';
import { Button, DatePicker, Image, Input, InputRef, Modal, Space, Table } from 'antd';

import { ColumnType, ColumnsType, FilterConfirmProps } from 'antd/es/table/interface';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import { Key, useCallback, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import styled from 'styled-components';
import ButtonComponent from '@/components/local/Button';
import { ExtandProduct } from '@/types/extend';
import ViewProductAdmin from './ViewProductAdmin';
import { FaList } from 'react-icons/fa';
import InputField from '@/components/local/InputField';

const { RangePicker } = DatePicker;

type Props = {
    products: Product[];
    categories?: Category[];
};

type DataIndex = keyof ExtandProduct;

const StyleTable = styled(Table)`
    .ant-table-cell {
        .ant-checkbox-wrapper {
            .ant-checkbox {
                .ant-checkbox-inner {
                    border-radius: 0;
                }
            }
        }
    }
`;

const ProductData = ({ products }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');

    //state start
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<ExtandProduct | null>(null);

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

    // Update active product

    //

    const showModalView = (record: ExtandProduct) => {
        setOpen(true);
        setView(record);
    };

    const showModal = () => {
        setIsModalOpen(true);
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

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<ExtandProduct> => ({
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

    const columns: ColumnsType<ExtandProduct> = [
        {
            title: 'Ảnh',

            dataIndex: 'images',
            key: 'images',
            render: (record) => {
                return <Image width={80} src={`/uploads/${record![0]}`} />;
            },
            width: '8%',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Trong kho',
            key: 'inStock',
            width: '10%',
            render: (record) => {
                const reduceQuantity =
                    record.type === 'variant' &&
                    record.variants.reduce((init: number, variant: any) => {
                        return init + variant.inventory;
                    }, 0);

                if (record.type === 'standard') {
                    return <span>{record?.instock <= 0 ? 'Hết hàng' : record?.inStock}</span>;
                } else {
                    return <span>{reduceQuantity <= 0 ? 'Hết hàng' : reduceQuantity}</span>;
                }
            },
        },
        {
            title: 'Loại hàng',
            dataIndex: 'category',
            key: 'category',
            width: '10%',
            render: (cate) => {
                return cate === null ? 'Chưa cập nhật' : cate.name;
            },
        },
        {
            title: 'Sale',
            dataIndex: 'saleOff',
            key: 'saleOff',
            width: '15%',
            render: (sale) => {
                return sale ? (
                    <span className="text-white bg-red-500 px-2 py-2">Giảm giá {sale}%</span>
                ) : (
                    <span>Không áp dụng</span>
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            key: 'inActive',
            width: '15%',
            render: (active: boolean) => {
                return active ? (
                    <span className="bg-green-600 px-4 py-2 text-white">Active</span>
                ) : (
                    <span className="bg-red-600 px-4 py-2 text-white">In Active</span>
                );
            },
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 180,
            render: (record) => (
                <div className="flex items-center gap-x-2">
                    <Link href={`products/${record.id}`}>
                        <ButtonComponent icon={<EditOutlined />} />
                    </Link>
                    <ButtonComponent
                        icon={<FaList />}
                        onClick={() => showModalView(record)}
                        type="default"
                        className="!bg-gray-500"
                    />
                </div>
            ),
        },
    ];

    // date params

    const onChange = (
        _value: DatePickerProps['value'] | RangePickerProps['value'],
        dateString: [string, string] | string,
    ) => {
        router.push(`?startdate=${dateString[0]}&enddate=${dateString[1]}`);
    };

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams],
    );

    // searchParams
    const pathname = usePathname();

    return (
        <div>
            <div className="w-[300px] mb-4">
                <InputField
                    onChange={(e) => {
                        return router.push(`${pathname}?${createQueryString('q', e.target.value)}`);
                    }}
                    prefix={<SearchOutlined />}
                    placeholder="Tên sản phẩm"
                />
            </div>

            <div className="float-right">
                <RangePicker
                    format={'YYYY-MM-DD'}
                    placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                    onChange={onChange}
                    showTime={false}
                />
            </div>

            <button onClick={() => router.push('?')} className="border px-4 hover:bg-gray-200">
                Xóa
            </button>

            {/* Thêm sản phẩm */}

            <span style={{ marginLeft: 8 }}>{hasSelected ? `Đã lựa chọn ${selectedRowKeys.length} sản phẩm` : ''}</span>
            {/* Data Grid */}
            <StyleTable
                rowSelection={rowSelection}
                rowKey={'id'}
                columns={columns as any}
                dataSource={products}
                scroll={{ x: 1200 }}
            />

            {/* Modal view */}

            {view && (
                <Modal
                    width={1000}
                    title="Chi tiết sản phẩm"
                    open={open}
                    cancelButtonProps={{ hidden: true }}
                    okButtonProps={{ hidden: true }}
                    onCancel={() => setOpen(false)}
                >
                    <ViewProductAdmin product={view!} />
                </Modal>
            )}
        </div>
    );
};

export default ProductData;
