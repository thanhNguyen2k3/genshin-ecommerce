import { ExclamationCircleOutlined } from '@ant-design/icons';
import React from 'react';

type Props = {
    message?: string;
};

const AlertWarning = ({ message }: Props) => {
    return (
        <div className="w-full bg-[#E0B252] px-4 py-4 flex text-white text-base">
            <ExclamationCircleOutlined className="mr-4" /> <p>{message}</p>
        </div>
    );
};

export default AlertWarning;
