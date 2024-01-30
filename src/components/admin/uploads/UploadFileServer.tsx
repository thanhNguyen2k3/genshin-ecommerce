'use client';

import ButtonComponent from '@/components/local/Button';
import instance from '@/lib/axios';
import { DeleteOutlined, LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, Spin, Upload, message } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Image } from 'antd';
import Dropzone, { useDropzone } from 'react-dropzone';

type Props = {
    setImages: Dispatch<SetStateAction<string[]>>;
    images?: string[];
};

const StyleInputUpload = styled(Input)`
    padding: 4px 6px;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    position: relative;
    z-index: 10;
`;

const StyleButtonUpload = styled.button`
    position: relative;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    border: 1px solid #ccc;
    background-color: #eee;
    transition: all ease 0.2s;
    &:hover {
        background-color: #6eb89f;
        color: #fff;
    }
`;

const UploadFilePublic = ({ images, setImages }: Props) => {
    const [mount, setMount] = useState(false);
    useEffect(() => {
        setMount(true);
    }, []);

    const [fileList, setFileList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const props: UploadProps = {
        // listType: 'picture',
        isImageUrl: (file) => {
            return true;
        },
        maxCount: 4,
        multiple: true,
        // method: 'POST',
        // beforeUpload(file, fileList) {
        //     return new Promise((resolve) => {
        //         setFileList(fileList);
        //         setImages((prev) => [...prev, file.name]);
        //     });
        // },
    };

    const onChange = async (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        const files = target.files as any;

        for (const file of files) {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('file', file);
                const res = await instance.post('/api/pr/uploads', formData, {
                    headers: {
                        'content-type': 'multipart/form-data',
                    },
                });

                setImages((prev) => [...prev, res.data.url]);
                message.success('Upload ảnh thành công');
            } catch (error: any) {
                message.error(error.message);
                setImages([]);
            } finally {
                setLoading(false);
            }
        }
    };

    // useEffect(() => {
    //     fileList && makeRequest();
    // }, [fileList]);

    // const handleUpload = async (accepteddFiles: File[]) => {
    //     for (const file of accepteddFiles) {
    //         try {
    //             setLoading(true);
    //             const formData = new FormData();
    //             formData.append('file', file);
    //             const res = await instance.post('/api/pr/uploads', formData, {
    //                 headers: {
    //                     'content-type': 'multipart/form-data',
    //                 },
    //             });

    //             setImages((prev) => [...prev, res.data.url]);
    //             message.success('Upload ảnh thành công');
    //         } catch (error: any) {
    //             message.error(error.message);
    //             setImages([]);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    // };

    if (!mount) {
        return null;
    }

    return (
        <>
            <StyleButtonUpload type="button">
                <StyleInputUpload type="file" multiple onChange={onChange} />
                <span className="absolute text-base z-0">Upload file</span>
            </StyleButtonUpload>

            {/* <Upload {...props}>
                <Button icon={<UploadOutlined />}>Upload (Max: 4)</Button>
            </Upload> */}

            {/* <Dropzone accept={{ 'image/*': [] }} onDrop={handleUpload}>
                {({ getInputProps, getRootProps, isDragActive, isDragReject }) => {
                    const additionalClass = isDragActive ? 'accept' : isDragReject ? 'reject' : '';
                    return (
                        <section className="container">
                            <div {...getRootProps({ className: `dropzone ${additionalClass}` })}>
                                <input {...getInputProps()} />
                                <p>Drag 'n' drop some files here, or click to select files</p>
                            </div>
                        </section>
                    );
                }}
            </Dropzone> */}

            {loading ? (
                <div className="flex justify-center w-full">
                    <Spin indicator={<LoadingOutlined />} />
                </div>
            ) : (
                images &&
                images.length > 0 &&
                images?.map((img, index) => (
                    <div
                        key={index}
                        className="border mt-2 border-dashed gap-x-2 rounded-sm border-gray-500 px-2 py-1 flex items-center"
                    >
                        <div className="w-10 h-10 flex">
                            <img src={`/uploads/${img}`} draggable className="w-full h-full" alt="image" />
                        </div>
                        <p className="flex-1 line-clamp-1">{img?.slice(9)}</p>

                        <DeleteOutlined
                            onClick={() => setImages((prev) => [...prev.filter((_item, i) => i !== index)])}
                            className="hover:text-red-500 text-xl text-zinc-400 cursor-pointer"
                        />
                    </div>
                ))
            )}

            {/* <Upload action={`../../../api/pr/uploads`} listType="picture" maxCount={4} multiple>
                <Button icon={<UploadOutlined />}>Upload (Max: 4)</Button>
            </Upload> */}
        </>
    );
};

export default UploadFilePublic;
