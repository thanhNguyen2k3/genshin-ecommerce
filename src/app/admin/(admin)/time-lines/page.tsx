import TimeLineCard from '@/components/component/TimeLineCard';
import { db } from '@/lib/db';
import { StatusEnum } from '@/types/enum';

const Page = async () => {
    const orderTimeLines = await db.timeLine.findMany({
        include: {
            order: {
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
        },
    });

    return (
        <div className="relative">
            {/* <div className="container mx-auto w-full h-full">
                <div className="relative wrap overflow-hidden p-10 h-full">
                    {orderTimeLines.map((timeline) => {
                        return (
                            <TimeLineCard
                                order={timeline.order}
                                key={timeline.id}
                                type={timeline.order.status === StatusEnum.ORDER_CANCELLED ? 'cancelled' : 'success'}
                            />
                        );
                    })}
                </div>
            </div> */}

            {orderTimeLines.length === 0 ? (
                <div className="w-full flex justify-center h-screen items-center">
                    <h1 className="text-base">Hiện tại chưa có đơn hàng nào được thực hiện</h1>
                </div>
            ) : (
                <ol className="border-l border-neutral-300 dark:border-neutral-500">
                    {/* <!--First item--> */}
                    {orderTimeLines.map((time) => (
                        <li key={time.id}>
                            <div className="flex-start flex items-center pt-3">
                                <div className="-ml-[5px] mr-3 h-[9px] w-[9px] rounded-full bg-neutral-300 dark:bg-neutral-500"></div>
                                <p className="text-sm text-neutral-500 dark:text-neutral-300">
                                    {time.order.createdAt.toLocaleDateString()}
                                    <span
                                        className={`${
                                            time.status === 0 ? 'bg-red-500' : 'bg-green-400'
                                        } px-2 py-1 text-white rounded ml-2`}
                                    >
                                        {time.status === 0 ? 'Đã hủy' : 'Xác nhận đơn hàng'}
                                    </span>
                                </p>
                            </div>
                            <div className="mb-6 ml-4 mt-2">
                                <h4 className="mb-1.5 text-xl font-semibold">
                                    Đơn hàng - {time.order.fullName.toUpperCase()}
                                </h4>
                                <p className="mb-3 text-neutral-500 dark:text-neutral-300">
                                    {time.order.orderItems.map((order) => order.name).join(', ')}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
};

export default Page;
