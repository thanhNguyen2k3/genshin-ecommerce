'use client';

import { ExtandOrder } from '@/types/extend';
import { formartUSD } from '@/utils/formartUSD';
import { CloseOutlined, ProfileOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

type Props = {
    order: ExtandOrder;
};

const BuildInvoice = ({ order }: Props) => {
    const componentRef = useRef<any>(null);
    const router = useRouter();

    let today: Date = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    const handlePrint = useReactToPrint({
        content: () => componentRef?.current!,
        documentTitle: `bill-${order.id}`,
        onAfterPrint: () => alert('In hóa đơn thành công.'),
    });

    return (
        <div className="bg-black fixed top-0 left-0 right-0 bottom-0 flex py-4 justify-center items-center z-50">
            <div className=" overflow-y-auto h-full">
                <div className="relative flex flex-col bg-white shadow-lg rounded-xl pointer-events-auto dark:bg-gray-800">
                    <div className="relative overflow-hidden min-h-[5rem] bg-gray-900 text-center rounded-t-xl">
                        {/* <!-- Close Button --> */}
                        <div className="absolute top-2 end-2">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-lg text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
                                data-hs-overlay="#hs-bg-gray-on-hover-cards"
                            >
                                <CloseOutlined />
                            </button>
                        </div>
                        {/* <!-- End Close Button --> */}

                        {/* <!-- SVG Background Element --> */}

                        {/* <!-- End SVG Background Element --> */}
                    </div>

                    <div className="relative z-10 -mt-12">
                        {/* <!-- Icon --> */}
                        <span className="mx-auto flex justify-center items-center w-[62px] h-[62px] rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                            <ProfileOutlined className="text-2xl" />
                        </span>
                        {/* <!-- End Icon --> */}
                    </div>

                    {/* <!-- Body --> */}
                    <div className="p-4 sm:p-7 overflow-y-auto">
                        <div ref={componentRef} className="px-4 py-2">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                    Hóa đơn từ Shop Genshin Global
                                </h3>
                                <p className="text-sm text-gray-500">Mã hóa đơn: {order.id}</p>
                            </div>

                            <h1 className="text-center mt-3 text-base">
                                Đến khách hàng: <span className="font-semibold">{order.fullName}</span>
                            </h1>

                            {/* <!-- Grid --> */}
                            <div className="mt-5 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 gap-5">
                                <div>
                                    <span className="block text-xs uppercase text-gray-500">Tổng giá:</span>
                                    <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {formartUSD(order.total)}
                                    </span>
                                </div>
                                {/* <!-- End Col --> */}

                                <div>
                                    <span className="block text-xs uppercase text-gray-500">Ngày tạo:</span>
                                    <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {dd + '/' + mm + '/' + yyyy}
                                    </span>
                                </div>
                                {/* <!-- End Col --> */}

                                <div>
                                    <span className="block text-xs uppercase text-gray-500">
                                        Phương thức thanh toán:
                                    </span>
                                    <div className="flex items-center gap-x-2">
                                        {order.payMethod === 1 ? (
                                            'Trả sau'
                                        ) : (
                                            <div className="flex items-center">
                                                <span className="mr-1">Đã thanh toán bằng</span>
                                                <div className="w-[40px] h-[20px]">
                                                    <img
                                                        src="/vnpay.webp"
                                                        className="w-full h-full object-cover"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* <!-- End Col --> */}
                            </div>
                            {/* <!-- End Grid --> */}

                            {/* Shipping */}
                            <div className="mt-4">
                                <span className="block text-xs uppercase text-gray-500">Địa chỉ:</span>
                                <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {order.address}
                                </span>
                            </div>
                            {/*  */}

                            <div className="mt-5 sm:mt-10">
                                <h4 className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-200">
                                    Đơn hàng
                                </h4>

                                <ul className="mt-3 flex flex-col">
                                    {order.orderItems.map((product, index) => {
                                        const color = product?.variant?.color ? ' - ' + product.variant.color.name : '';
                                        const size = product?.variant?.size ? ' - ' + product.variant.size.value : '';
                                        const option = product?.variant?.optionName
                                            ? ' - ' + product.variant.optionName
                                            : '';

                                        let orderName = (
                                            <p>
                                                {product.product.name}{' '}
                                                <span className="font-bold">{color! + size! + option!}</span>
                                            </p>
                                        );
                                        return (
                                            <li
                                                key={index}
                                                className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-semibold bg-gray-50 border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-slate-800 dark:border-gray-700 dark:text-gray-200"
                                            >
                                                <div className="flex items-center justify-between w-full line-clamp-2">
                                                    <span className="font-normal mr-6">{orderName}</span>
                                                    <span>{formartUSD(product.price)}</span>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            <div className="mt-5 sm:mt-10">
                                <h4 className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-200">
                                    Tóm tắt
                                </h4>

                                <ul className="mt-3 flex flex-col">
                                    <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-gray-700 dark:text-gray-200">
                                        <div className="flex items-center justify-between w-full">
                                            <span>Phí thanh toán</span>
                                            <span>
                                                {formartUSD(
                                                    order.orderItems.reduce(
                                                        (init, order) => init + order.price * order.quantity,
                                                        0,
                                                    ),
                                                )}
                                            </span>
                                        </div>
                                    </li>
                                    <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-gray-700 dark:text-gray-200">
                                        <div className="flex items-center justify-between w-full">
                                            <span>Phí giao hàng</span>
                                            <span>
                                                {order.deliveryMethod === 1 ? formartUSD(25000) : formartUSD(40000)}
                                            </span>
                                        </div>
                                    </li>
                                    <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-semibold bg-gray-50 border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-slate-800 dark:border-gray-700 dark:text-gray-200">
                                        <div className="flex items-center justify-between w-full">
                                            <span>Tổng chi phí</span>
                                            <span>{formartUSD(order.total)}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* <!-- Button --> */}
                        <div>
                            <div className="mt-5 flex justify-end gap-x-2">
                                <button
                                    onClick={() => router.back()}
                                    className="border px-2 py-1 rounded-lg text-gray-700 shadow-sm align-middle"
                                >
                                    Quay lại
                                </button>
                                <button className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-lg border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-primary transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
                                    <svg
                                        className="flex-shrink-0 w-4 h-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" x2="12" y1="15" y2="3" />
                                    </svg>
                                    Hóa đơn PDF
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary text-white hover:bg-secondary disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                >
                                    <svg
                                        className="flex-shrink-0 w-4 h-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="6 9 6 2 18 2 18 9" />
                                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                        <rect width="12" height="8" x="6" y="14" />
                                    </svg>
                                    In hóa đơn
                                </button>
                            </div>
                            {/* <!-- End Buttons --> */}

                            <div className="mt-5 sm:mt-10">
                                <p className="text-sm text-gray-500">
                                    If you have any questions, please contact us at{' '}
                                    <a
                                        className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium"
                                        href="#"
                                    >
                                        example@site.com
                                    </a>{' '}
                                    or call at{' '}
                                    <a
                                        className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium"
                                        href="tel:+1898345492"
                                    >
                                        +1 898-34-5492
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* <!-- End Body --> */}
                </div>
            </div>
        </div>
    );
};

export default BuildInvoice;
