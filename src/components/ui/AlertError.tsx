import { Alert } from 'antd';

type Props = {
    message?: string;
};

const AlertError = ({ message }: Props) => {
    return (
        <Alert
            message={message}
            description="Vui lòng quay lại trang chủ để tìm kiếm sản phẩm khác mà bạn muốn."
            type="error"
            showIcon
        />
    );
};

export default AlertError;
