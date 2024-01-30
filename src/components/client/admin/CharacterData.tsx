'use client';

import { Character, Region, Vision, Weapon } from '@prisma/client';
import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Button, Form, Image, Input, Modal, Select, message } from 'antd';
import styled from 'styled-components';
import { ExclamationCircleFilled, SearchOutlined } from '@ant-design/icons';
import InputField from '@/components/local/InputField';
import instance from '@/lib/axios';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ExtandCharacter } from '@/types/extend';
import ButtonComponent from '@/components/local/Button';
const { confirm } = Modal;

type Props = {
    characters: ExtandCharacter[];
    visions: Vision[];
    regions: Region[];
    weapons: Weapon[];
};

const { Option } = Select;

const StyleButton = styled(Button)`
    background-color: #6eb89f;
    color: #fff !important;
    border-radius: 2px;

    &:hover {
        border-color: #6eb89f !important;
    }
`;

const StyleSelect = styled(Select)`
    width: 300px;
    .ant-select-selector {
        border-radius: 0;

        &:focus {
            border-color: #bbb !important;
        }
    }
`;

const CharacterData = ({ characters, regions, visions, weapons }: Props) => {
    // Router
    const router = useRouter();
    const params = useSearchParams();
    const id = params.get('id');
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [form] = Form.useForm();
    // State
    const [mount, setMount] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [thumbnail, setThumbnail] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const showModal = (data: Character) => {
        setIsModalOpen(true);

        form.setFieldsValue({
            thumbnail: data.thumbnail,
            name: data?.name,
            regionId: data.regionId,
            weaponId: data.weaponId,
            visionId: data.visionId,
        });

        router.push(`?id=${data.id}`);
    };

    const onChange = async (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;

        const file = target.files![0];

        const formData = new FormData();
        formData.append('file', file);

        try {
            await instance.post('/api/pr/uploads', formData).then((res) => {
                setThumbnail(res.data.url);
            });
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const onSubmit = async (values: any) => {
        try {
            setLoading(true);

            await instance
                .patch(`/api/pr/character/${id}`, {
                    thumbnail: thumbnail.length > 0 ? thumbnail : form.getFieldValue('thumbnail'),
                    ...values,
                })
                .then(() => {
                    router.refresh();
                    form.resetFields();
                    message.success('Tạo nhân vật thành công');
                    setIsModalOpen(false);
                });
        } catch (error) {
            setLoading(false);
            message.error('Tạo nhân vật thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        router.push('?');
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
                    await instance.delete(`/api/pr/character/${id.toString()}`).then(() => {
                        router.refresh();
                        form.resetFields();
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

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams],
    );

    if (!mount) {
        return null;
    }

    return (
        <div>
            <div className="space-y-2 mb-4">
                <div className="w-[300px] mb-4">
                    <InputField
                        onChange={(e) => {
                            return router.push(`${pathname}?${createQueryString('q', e.target.value)}`);
                        }}
                        prefix={<SearchOutlined />}
                        placeholder="Tên nhân vật"
                    />
                </div>

                <div>
                    <StyleSelect
                        defaultValue={''}
                        onChange={(value: string) => {
                            router.push(`${pathname}?${createQueryString('regionId', value)}`);
                        }}
                    >
                        <Option value={''}>-- Chọn vùng --</Option>
                        {regions.map((region) => (
                            <Option value={region.id}>{region.name}</Option>
                        ))}
                    </StyleSelect>
                </div>

                <button onClick={() => router.push('?')} className="border px-4 hover:bg-gray-200">
                    Clear
                </button>
            </div>

            <div className="max-w-full overflow-x-auto overflow-hidden">
                <table className="table-auto w-full min-w-[500px]">
                    <thead>
                        <tr className="border">
                            <th className="py-1">Thumnail</th>
                            <th className="py-2">Tên nhân vật</th>
                            <th className="py-2">Vùng</th>
                            <th className="py-2">Vũ khí</th>
                            <th className="py-2">Vision</th>
                        </tr>
                    </thead>
                    <tbody>
                        {characters.map((character) => (
                            <tr key={character.id} className="border uppercase">
                                <td className="text-center px-2 py-2">
                                    <Image
                                        preview
                                        width={100}
                                        height={100}
                                        src={`/uploads/${character.thumbnail}`}
                                        alt="images"
                                    />
                                </td>
                                <td className="text-center px-2 py-2">{character.name}</td>
                                <td className="text-center px-2 py-2">{character.region.name}</td>
                                <td className="text-center px-2 py-2">{character.weapon.name}</td>
                                <td className="text-center px-2 py-2">{character.vision.name}</td>
                                <td className="px-2 py-2">
                                    <StyleButton onClick={() => showModal(character)}>Sửa</StyleButton>
                                    <StyleButton
                                        className="!bg-red-500 mt-1"
                                        onClick={() => showDeleteConfirm(character.id)}
                                    >
                                        Xóa
                                    </StyleButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal title="Nhân vật" open={isModalOpen} onCancel={handleCancel} okButtonProps={{ type: 'default' }}>
                <Form form={form} className="col-span-1 mt-3" onFinish={onSubmit}>
                    <Form.Item>
                        <div className="border border-dashed p-3 bg-black border-gray-500 ">
                            <img
                                src={`/uploads/${thumbnail.length > 0 ? thumbnail : form.getFieldValue('thumbnail')}`}
                                className="w-full h-full"
                                alt=""
                            />
                        </div>

                        <Input name={'thumbnail'} type="file" onChange={onChange} />
                    </Form.Item>

                    <InputField name={'name'} placeholder="Tên nhân vật" />

                    <Form.Item name={'regionId'}>
                        <Select defaultValue={''}>
                            <Option value={''}>-- Chọn vùng --</Option>
                            {regions.map((region) => (
                                <Option key={region.id} value={region.id}>
                                    {region.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name={'weaponId'}>
                        <Select defaultValue={''}>
                            <Option value={''}>-- Chọn vũ khí --</Option>
                            {weapons.map((weapon) => (
                                <Option key={weapon.id} value={weapon.id}>
                                    {weapon.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name={'visionId'}>
                        <Select defaultValue={''}>
                            <Option value={''}>-- Chọn vision --</Option>
                            {visions.map((vision) => (
                                <Option key={vision.id} value={vision.id}>
                                    {vision.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <ButtonComponent htmlType="submit" loading={loading}>
                        Lưu nhân vật
                    </ButtonComponent>
                </Form>
            </Modal>
        </div>
    );
};

export default CharacterData;
