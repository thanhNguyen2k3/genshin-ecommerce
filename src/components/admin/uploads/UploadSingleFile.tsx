'use client';

import instance from '@/lib/axios';
import { Upload, message } from 'antd';
import { Dispatch, SetStateAction, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';

type Props = {
    image: string;
    setImage: Dispatch<SetStateAction<string>>;
};

const StyleUpload = styled(Upload)`
    display: inline-block;
    width: 110px !important;
`;

const UploadSingleFile = ({ image, setImage }: Props) => {
    const [loading, setLoading] = useState(false);

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const onChange = async (file: any) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            const res = await instance.post('/api/pr/uploads', formData, {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            });

            setImage(res.data.url);
            message.success('Upload ảnh thành công');
        } catch (error: any) {
            message.error(error.message);
            setImage('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyleUpload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={(file) => onChange(file)}
        >
            {image.length > 0 ? <img src={`/uploads/${image}`} alt="image" style={{ width: '100%' }} /> : uploadButton}
        </StyleUpload>
    );
};

export default UploadSingleFile;
