import { getGraphRevenue } from '@/actions/get-graph-revenue';
import { getInstockCount } from '@/actions/get-instock-count';
import { getSaleCount } from '@/actions/get-sale-count';
import { getTotalRevenue } from '@/actions/get-total-revenue';
import { getUserCount } from '@/actions/get-user-count';
import Overview from '@/components/client/admin/Overview';
import { formartUSD } from '@/utils/formartUSD';
import { DropboxOutlined, StockOutlined, UserOutlined } from '@ant-design/icons';

const Page = async () => {
    const totalRevenue = await getTotalRevenue();
    const saleCount = await getSaleCount();
    const instockCount = await getInstockCount();
    const graphRevenue = await getGraphRevenue();
    const userCount = await getUserCount();

    return (
        <div>
            <div></div>
            <div className="">
                <div className="flex gap-x-4 overflow-x-auto">
                    <div className="border-2 min-w-[160px] border-gray-300 font-semibold rounded p-4">
                        <div className="flex justify-between border-b pb-2">
                            <span>TỔNG</span>

                            <span>VNĐ</span>
                        </div>
                        <p className="mt-4 text-lg">{formartUSD(totalRevenue)}</p>
                    </div>

                    <div className="border-2 min-w-[160px] border-gray-300 font-semibold rounded p-4">
                        <div className="flex justify-between border-b pb-2">
                            <span>SALE</span>

                            <span>
                                <StockOutlined className="text-base" />
                            </span>
                        </div>
                        <p className="mt-4 text-lg">{saleCount}</p>
                    </div>

                    <div className="border-2 min-w-[160px] border-gray-300 font-semibold rounded p-4">
                        <div className="flex justify-between border-b pb-2">
                            <span>SẢN PHẨM</span>

                            <span>
                                <DropboxOutlined className="text-base" />
                            </span>
                        </div>
                        <p className="mt-4 text-lg">{instockCount}</p>
                    </div>

                    <div className="border-2 min-w-[160px] border-gray-300 font-semibold rounded p-4">
                        <div className="flex justify-between border-b pb-2">
                            <span>NGƯỜI DÙNG</span>

                            <span>
                                <UserOutlined className="text-base" />
                            </span>
                        </div>
                        <p className="mt-4 text-lg">{userCount}</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-4 border-2 border-gray-200 rounded">
                <h1 className="text-xl mb-6 font-semibold">Overview</h1>
                <Overview data={graphRevenue} />
            </div>
        </div>
    );
};

export default Page;
