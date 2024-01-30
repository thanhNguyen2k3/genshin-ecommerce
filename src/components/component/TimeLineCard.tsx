import { ExtandOrder } from '@/types/extend';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

type Props = {
    type?: 'success' | 'cancelled';
    order?: ExtandOrder;
};

const TimeLineCard = ({ order, type }: Props) => {
    return (
        <div
            className={`mb-8 flex justify-between ${
                type === 'cancelled' ? 'flex-row-reverse' : ''
            } items-center w-full right-timeline`}
        >
            <div className="order-1 w-5/12"></div>
            <div
                className={`z-20 flex items-center order-1 ${
                    type === 'success' ? 'bg-green-500' : 'bg-red-400'
                } shadow-xl w-8 h-8 rounded-full`}
            >
                <h1 className="mx-auto font-semibold text-lg text-white">
                    {type === 'success' ? <CheckOutlined /> : <CloseOutlined />}
                </h1>
            </div>
            <div
                className={`order-1 ${
                    type === 'success' ? 'bg-green-500' : 'bg-red-400'
                }  rounded-lg shadow-xl w-5/12 px-6 py-4`}
            >
                <p className="text-white border-b border-gray-100 pb-1 text-center">
                    {type === 'success' ? order?.createdAt.toLocaleDateString() : order?.updatedAt.toLocaleDateString()}
                </p>
                <h3 className="mb-1 text-white text-base">
                    <span className="text-xl font-semibold">{order?.fullName}</span> -{' '}
                    {type === 'success' ? 'Đặt hàng 🥰' : 'Hủy đơn 😥'}
                </h3>
                <div className="text-sm leading-snug tracking-wide text-gray-50 text-opacity-100">
                    <ul>
                        {order?.orderItems.map((order, index) => (
                            <li className="flex flex-nowrap gap-x-1" key={index}>
                                <span className="line-clamp-1">
                                    {index + 1}.{order.name}
                                </span>
                                x <b>{order.quantity}</b>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TimeLineCard;
