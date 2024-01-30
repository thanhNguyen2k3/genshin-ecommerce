'use client';

import instance from '@/lib/axios';
import { Category, Character, Color, Region, Size, Vision, Weapon } from '@prisma/client';
import { Button, Checkbox, Form, Input, InputNumber, Select, Tag, Typography, message, Image } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import UploadFilePublic from '../../uploads/UploadFileServer';
import ButtonComponent from '@/components/local/Button';
import InputField from '@/components/local/InputField';
import styled from 'styled-components';
import Editors from './Editors';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { ExtandCharacter } from '@/types/extend';
import { CloseCircleFilled, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import UploadSingleFile from '../../uploads/UploadSingleFile';

type Props = {
    categories: Category[] | null;
    characters?: Character[];
    regions: Region[];
    weapons: Weapon[];
    visions: Vision[];
    colors: Color[];
    sizes: Size[];
};

const { Option } = Select;

const StyleSelect = styled(Select)`
    .ant-select-selector {
        border-radius: 0;

        &:focus {
            border-color: #bbb !important;
        }
    }
`;

const StyleInput = styled(Input)`
    border-radius: 0;
`;

const StyleInputNumber = styled(InputNumber)`
    border-radius: 0;
`;

const StyleCheckbox = styled(Checkbox)`
    .ant-checkbox-inner {
        border-radius: 0;
    }
`;

const CreateProduct = ({ categories, regions, visions, weapons, sizes, colors }: Props) => {
    const router = useRouter();

    const [form] = Form.useForm();
    const [images, setImages] = useState<string[]>([]);
    const [editors, setEditors] = useState<string>('');
    const [characterIds, setCharacterIds] = useState<CheckboxValueType[]>([]);
    const [charactersFilter, setCharactersFilter] = useState<ExtandCharacter[] | undefined>([]);
    const [loading, setLoading] = useState(false);

    //Ids character
    const [regionId, setRegionId] = useState<string>('');
    const [weaponId, setWeaponId] = useState<string>('');
    const [visionId, setVisionId] = useState<string>('');

    // Variants
    const [colorIds, setColorIds] = useState<string[]>([]);
    const [sizeIds, setSizeIds] = useState<string[]>([]);
    const [checked, setChecked] = useState(false);
    const [filterColor, setFilterColor] = useState<any[]>([]);
    const [filterSize, setFilterSize] = useState<any[]>([]);

    useEffect(() => {
        setFilterColor(colors.filter((color) => color?.id === colorIds.find((colorId) => colorId === color.id)));
    }, [colorIds]);

    useEffect(() => {
        setFilterSize(sizes.filter((size) => size?.id === sizeIds.find((sizeId) => sizeId === size.id)));
    }, [sizeIds]);

    // type
    const types = [
        {
            label: 'Tiêu chuẩn',
            description: 'Là loại sản phẩm không bao gồm thông số và biến thể phức tạp',
            value: 'standard',
        },
        {
            label: 'Biến thể',
            description: 'Bao gồm thông số khác như "Kích cỡ, màu sắc, khác..."',
            value: 'variant',
        },
    ];

    // Effected
    useEffect(() => {
        const makeRequest = () => {
            instance
                .get(`/api/pr/character?regionId=${regionId}&weaponId=${weaponId}&visionId=${visionId}`)
                .then((res) => {
                    setCharactersFilter(res.data);
                });
        };

        makeRequest();
    }, [visionId, regionId, weaponId]);

    // Added values start

    //  finally end

    const hasDupsObjects = (array: any) => {
        return array
            ?.map(function (value: any) {
                if (value.sizeId || value.colorId) {
                    return value.sizeId + value.colorId + value.image;
                }
            })
            ?.some(function (value: any, _index: any, array: any) {
                return array.indexOf(value) !== array.lastIndexOf(value);
            });
    };

    const onFinish = async (values: any) => {
        const filter = values?.variants?.map((variant: any) => {
            const { id, price, inventory, productId, createdAt, updatedAt, size, color, ...rest } = variant;

            return rest;
        });

        const checkSize = filter?.find((item: any) => item.sizeId);
        const checkColor = filter?.find((item: any) => item.colorId);

        if (hasDupsObjects(filter) && values.variants.length > 0 && (checkSize || checkColor)) {
            return message.error('Một số biến thể đang trùng nhau. Vui lòng kiểm tra lại');
        } else {
            try {
                setLoading(true);
                const res = await instance
                    .post('/api/pr/product', {
                        ...values,
                        description: editors,
                        images,
                        characterIds,
                        variants: values.variants || [],
                    })
                    .then(() => {
                        toast.success(`Tạo sản phẩm ${values.name} thành công`);
                        router.refresh();
                        router.push('/admin/products');
                        form.resetFields();
                    });

                return res;
            } catch (error) {
                setLoading(false);
                toast.error(`Tạo sản phẩm ${values.name} không thành công`);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <div className="flex justify-end mb-4">
                    <ButtonComponent loading={loading} className="!w-[120px]" htmlType="submit">
                        Lưu
                    </ButtonComponent>
                </div>
                <div className="grid grid-cols-3 gap-x-3">
                    <div className="col-span-2 space-y-3">
                        <div className="border shadow-2xl bg-white p-3 rounded">
                            <InputField
                                name={'name'}
                                label="Tên sản phẩm"
                                rules={[
                                    { required: true, message: 'Bắt buộc' },
                                    { min: 10, message: 'Lớn hơn 10 ký tự' },
                                ]}
                            />
                            <InputField
                                name={'shortDes'}
                                label="Mô tả ngắn"
                                rules={[
                                    { required: true, message: 'Bắt buộc' },
                                    { min: 10, message: 'Lớn hơn 10 ký tự' },
                                ]}
                            />

                            <Form.Item label="Mô tả">
                                <Editors value={editors} setValue={setEditors} />
                            </Form.Item>
                        </div>

                        <div className="border shadow-2xl bg-white p-3 rounded">
                            <Form.Item label={'Màu sắc'} name={'colors'}>
                                <Checkbox.Group onChange={(value: any[]) => setColorIds(value)}>
                                    {colors.map((color) => (
                                        <StyleCheckbox key={color.id} value={color.id} className="flex items-center">
                                            <div
                                                style={{ backgroundColor: color.value }}
                                                className="w-[20px] h-[20px] border border-black rounded-full"
                                            ></div>
                                        </StyleCheckbox>
                                    ))}
                                </Checkbox.Group>
                            </Form.Item>

                            <Form.Item label={'Kích cỡ'} name={'sizes'}>
                                <Checkbox.Group onChange={(value: any[]) => setSizeIds(value)}>
                                    {sizes.map((size) => (
                                        <StyleCheckbox key={size.id} value={size.id} className="flex items-center">
                                            {size.value}
                                        </StyleCheckbox>
                                    ))}
                                </Checkbox.Group>
                            </Form.Item>
                        </div>

                        <div className="border shadow-2xl bg-white p-3 rounded">
                            <Form.Item label={<span className="text-base font-semibold">Biến thể</span>}>
                                <StyleCheckbox onChange={(e) => setChecked(e.target.checked)}>
                                    Biến thể giúp bạn có nhiều lựa chọn cho sản phẩm.
                                </StyleCheckbox>
                            </Form.Item>

                            {checked && (
                                <Form.Item label={<span className="text-base font-semibold">Lựa chọn biến thể</span>}>
                                    <Form.List name="variants">
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => {
                                                    return (
                                                        <div className="flex gap-x-2" key={key}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'image']}
                                                                label="Ảnh"
                                                                initialValue={null}
                                                            >
                                                                <StyleSelect className="!w-[100px] !h-[60px]">
                                                                    {images.map((url, index) => (
                                                                        <Option value={url} key={index}>
                                                                            <Image
                                                                                src={`/uploads/${url}`}
                                                                                alt="image"
                                                                                width={70}
                                                                                height={70}
                                                                                preview={true}
                                                                            />
                                                                        </Option>
                                                                    ))}
                                                                </StyleSelect>
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'colorId']}
                                                                label="Màu"
                                                                initialValue={null}
                                                            >
                                                                <StyleSelect
                                                                    defaultValue={null}
                                                                    className="!w-[120px] !h-[60px]"
                                                                >
                                                                    <Option value={null}>-- Lựa chọn màu --</Option>
                                                                    {filterColor.map((color) => {
                                                                        return (
                                                                            <Option key={color.id} value={color.id}>
                                                                                {color.name}
                                                                            </Option>
                                                                        );
                                                                    })}
                                                                </StyleSelect>
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'sizeId']}
                                                                label="Kích cỡ"
                                                                initialValue={null}
                                                            >
                                                                <StyleSelect
                                                                    defaultValue={null}
                                                                    className="!w-[120px] !h-[60px]"
                                                                >
                                                                    <Option value={null}>-- Lựa chọn size --</Option>
                                                                    {filterSize.map((size) => (
                                                                        <Option key={size.id} value={size.id}>
                                                                            {size.value}
                                                                        </Option>
                                                                    ))}
                                                                </StyleSelect>
                                                            </Form.Item>

                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'optionName']}
                                                                label="Khác"
                                                                initialValue={null}
                                                            >
                                                                <StyleInput
                                                                    className="!h-[60px]"
                                                                    placeholder="Lựa chọn khác"
                                                                    defaultValue={''}
                                                                />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'price']}
                                                                label="Giá"
                                                                required
                                                            >
                                                                <StyleInputNumber
                                                                    className="!h-[60px] leading-[60px]"
                                                                    placeholder="Giá"
                                                                />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'inventory']}
                                                                label="Số lượng"
                                                                required
                                                            >
                                                                <StyleInputNumber
                                                                    className="!h-[60px] leading-[60px]"
                                                                    placeholder="Số lượng"
                                                                />
                                                            </Form.Item>
                                                            <Form.Item label="...">
                                                                <DeleteOutlined
                                                                    className="ml-3 text-xl"
                                                                    onClick={() => remove(name)}
                                                                />
                                                            </Form.Item>
                                                        </div>
                                                    );
                                                })}

                                                <div className="text-center">
                                                    <button onClick={() => add()} type="button" className=" space-x-1">
                                                        <PlusOutlined />
                                                        <span>Thêm biến thể</span>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </Form.List>
                                </Form.Item>
                            )}
                        </div>
                    </div>

                    <div className="col-span-1 space-y-3">
                        <div className="border shadow-2xl bg-white p-3 rounded">
                            <Form.Item
                                name={'active'}
                                label={<span className="text-base font-semibold">Trạng thái</span>}
                                rules={[{ required: true, message: 'Bắt buộc' }]}
                            >
                                <StyleSelect defaultValue={true} placeholder="Chọn trạng thái">
                                    <Option value={true}>Hoạt động</Option>
                                    <Option value={false}>Không hoạt động</Option>
                                </StyleSelect>
                            </Form.Item>
                        </div>
                        <div className="border shadow-2xl bg-white p-3 rounded">
                            <Form.Item
                                name={'categoryId'}
                                label={<span className="text-base font-semibold">Loại hàng</span>}
                                rules={[{ required: true, message: 'Bắt buộc' }]}
                            >
                                <StyleSelect defaultValue={''} placeholder="Chọn loại hàng">
                                    <Option value="">-- Loại hàng --</Option>
                                    {categories?.map((category) => (
                                        <Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Option>
                                    ))}
                                </StyleSelect>
                            </Form.Item>
                        </div>

                        <div className="border shadow-2xl bg-white p-3 rounded">
                            <Form.Item
                                className="flex w-full flex-col pt-4"
                                label={<span className="text-base font-semibold">Dạng sản phẩm</span>}
                            >
                                <Form.Item
                                    className="flex w-full flex-col pt-4"
                                    label={<span className="text-base font-semibold">Dạng sản phẩm</span>}
                                    name={'type'}
                                >
                                    <StyleSelect defaultValue={'standard'}>
                                        {types.map((type) => (
                                            <Option key={type.value} value={type.value}>
                                                {type.label}
                                            </Option>
                                        ))}
                                    </StyleSelect>
                                </Form.Item>
                            </Form.Item>
                        </div>

                        <div className="border shadow-2xl bg-white p-3 rounded">
                            <Form.Item label={<span className="text-base font-semibold">Thêm ảnh</span>}>
                                <UploadFilePublic images={images} setImages={setImages} />
                            </Form.Item>
                        </div>

                        <div className="border shadow-2xl bg-white p-3 rounded">
                            <Form.Item label={<span className="text-base font-semibold">Giá thành</span>}>
                                <InputField isNumber defaultValue={0} name={'price'} label="Giá (VNĐ)" />
                                <InputField isNumber defaultValue={0} name={'saleOff'} label="Giảm giá" />
                                <InputField isNumber defaultValue={0} name={'inStock'} label="Số lượng" />
                            </Form.Item>
                        </div>

                        <div className="px-4 pb-4 rounded border border-gray-300">
                            <p className="font-semibold text-base py-2">Nhân vật</p>
                            <div className="grid grid-cols-3 gap-x-2 overflow-x-auto">
                                <StyleSelect
                                    placeholder="Vùng"
                                    defaultValue={''}
                                    allowClear
                                    onChange={(value: string) => setRegionId(value)}
                                >
                                    <Option value="">-- Chọn vùng --</Option>
                                    {regions?.map((reion) => (
                                        <Option key={reion.id} value={reion.id}>
                                            {reion.name}
                                        </Option>
                                    ))}
                                </StyleSelect>

                                <StyleSelect
                                    placeholder="Vũ khí"
                                    defaultValue={''}
                                    allowClear
                                    onChange={(value: string) => setWeaponId(value)}
                                >
                                    <Option value="">-- Chọn vũ khí --</Option>
                                    {weapons?.map((weapon) => (
                                        <Option key={weapon.id} value={weapon.id}>
                                            {weapon.name}
                                        </Option>
                                    ))}
                                </StyleSelect>

                                <StyleSelect
                                    placeholder="Vision"
                                    defaultValue={''}
                                    allowClear
                                    onChange={(value: string) => setVisionId(value)}
                                >
                                    <Option value="">-- Chọn vision --</Option>
                                    {visions?.map((vision) => (
                                        <Option key={vision.id} value={vision.id}>
                                            {vision.name}
                                        </Option>
                                    ))}
                                </StyleSelect>
                            </div>
                            <Checkbox.Group
                                onChange={(values) => setCharacterIds(values)}
                                className="grid grid-cols-3 lg:grid-cols-3 gap-2 mt-2 min-w-[400px] max-h-[360px] overflow-x-auto overflow-y-auto"
                            >
                                {charactersFilter?.length === 0 ? (
                                    <h1>Không tìm thấy</h1>
                                ) : (
                                    charactersFilter?.map((character) => (
                                        <div key={character.id} className="border p-2">
                                            <Checkbox value={character.id} className="w-full">
                                                <div>
                                                    <img
                                                        src={`/uploads/${character.thumbnail}`}
                                                        className="w-full h-full"
                                                        alt=""
                                                    />
                                                </div>

                                                <p className="uppercase font-semibold mt-1 text-center">
                                                    {character.name}
                                                </p>
                                            </Checkbox>
                                        </div>
                                    ))
                                )}
                            </Checkbox.Group>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default CreateProduct;
