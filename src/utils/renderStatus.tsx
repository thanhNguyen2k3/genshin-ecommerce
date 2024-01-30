import { StatusEnum } from '@/types/enum';

export const renderStatus = (status: number) => {
    if (status === StatusEnum.ORDER_UNCONFIRM) return <span>PENDING</span>;
    if (status === StatusEnum.ORDER_CONFIRM) return <span>CONFIRM</span>;
    if (status === StatusEnum.ORDER_SHIPPING) return <span>SHIPPING</span>;
    if (status === StatusEnum.ORDER_COMPLETE) return <span>COMPLETE</span>;
    if (status === StatusEnum.ORDER_CANCELLED) return <span className="text-red-500">CANCELLED</span>;
};
