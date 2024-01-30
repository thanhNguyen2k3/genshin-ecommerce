import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const LoadingSpinner = () => {
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center bg-gray-200 items-center">
            <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24, color: '#333' }} spin />} />
        </div>
    );
};

export default LoadingSpinner;
