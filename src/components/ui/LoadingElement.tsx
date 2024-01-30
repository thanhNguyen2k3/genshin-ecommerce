import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

type Props = {};

const LoadingElement = ({}: Props) => {
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-100/75 flex justify-center items-center">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#333' }} spin />} />
        </div>
    );
};

export default LoadingElement;
