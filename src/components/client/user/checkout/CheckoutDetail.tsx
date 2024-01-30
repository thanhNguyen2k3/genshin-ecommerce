'use client';

import { Form, message } from 'antd';
import { useEffect, useState } from 'react';
import { City, Country, State } from 'country-state-city';
import { AnimatePresence, motion } from 'framer-motion';
import { OrderItem, Product, Variant } from '@prisma/client';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';

import instance from '@/lib/axios';
import { useAppSelector } from '@/store/hook';
import { ExtandProduct } from '@/types/extend';
import { formartUSD } from '@/utils/formartUSD';
import { totalAmount } from '@/utils/reduceTotal';

import Wrapper from '@/components/local/Wrapper';
import BillBoard from '@/components/local/BillBoard';
import InputField from '@/components/local/InputField';
import ButtonComponent from '@/components/local/Button';
import SelectedCountry from '@/components/ui/SelectedCountry';
import DividerFading from '@/components/ui/DividerFading';
import LoadingElement from '@/components/ui/LoadingElement';
import { useRouter } from 'next/navigation';

type ExtandOrderItem = OrderItem & {
    product: Product;
    variant: Variant;
};

type Props = {
    products: ExtandProduct[];
    orderItems: ExtandOrderItem[];
};

const StyleBill = styled.div`
    position: absolute;
    left: 0;
    width: 100%;
    height: 10px;
    background-color: transparent;
    background-image: radial-gradient(farthest-side, transparent 6px, #f7f7f7 0);
    background-size: 15px 15px;
`;

let initialShipping = 25000;
const CheckoutDetail = ({}: Props) => {
    const { status, data } = useSession();
    const [form] = Form.useForm();
    const router = useRouter();

    // State

    const { cartItems } = useAppSelector((state) => state.cart);

    // console.log(cartItems);

    const [payMethod, setPayMethod] = useState(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [deliveryMethod, setDeliveryMethod] = useState(1);
    const [deliveryMoney, setDeliveryMoney] = useState(initialShipping);
    const [loading, setLoading] = useState(false);

    // Country data
    let countryData = Country.getAllCountries();
    const [stateData, setStateData] = useState<any>();
    const [cityData, setCityData] = useState<any>();

    const [country, setCountry] = useState(countryData[239]);
    const [state, setState] = useState<any>();
    const [city, setCity] = useState<any>();

    // Effected

    useEffect(() => {
        setStateData(State.getStatesOfCountry(country?.isoCode));
    }, [country]);

    useEffect(() => {
        setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
    }, [state]);

    useEffect(() => {
        stateData && setState(stateData[0]);
    }, [stateData]);

    useEffect(() => {
        cityData && setCity(cityData[0]);
    }, [cityData]);

    useEffect(() => {
        setLoading(true);

        setTimeout(() => setLoading(false), 1000);
    }, [deliveryMethod]);

    useEffect(() => {
        form.setFieldsValue({
            email: data?.user.email!,
            fullName: data?.user.fullName!,
            phone: data?.user.phoneNumber!,
            detailAddress: data?.user.detailAddress!,
        });
    }, [form, data]);

    // Checkout
    const reduceQuantity = cartItems.reduce((init, product) => init + product.quantity, 0);

    const handleFinish = async (values: any) => {
        const {} = values;

        if (status === 'unauthenticated' || !data) {
            return router.push('/login');
        } else {
            if (cartItems.length === 0) {
                return message.info('Không tìm thấy sản phẩm nào để có thể thanh toán.');
            }

            if (window.confirm('Đơn hàng không thể bị hủy sau khi đã thanh toán')) {
                if (payMethod === 1) {
                    try {
                        setIsLoading(true);
                        await instance
                            .post('/api/pl/order', {
                                orderItems: cartItems,
                                payMethod,
                                deliveryMethod: reduceQuantity > 3 ? 0 : deliveryMethod,
                                address: `${state.name} - ${city.name} - ${country.name}`,
                                total:
                                    reduceQuantity > 3
                                        ? totalAmount(cartItems)
                                        : totalAmount(cartItems) + deliveryMoney,
                                ...values,
                            })
                            .then((res) => {
                                router.push(`/shopping-cart/checkout/${res.data.id}/?vnp_ResponseCode=00`);
                            });
                    } catch (error: any) {
                        setIsLoading(true);
                        message.error(error.message);
                    } finally {
                        setIsLoading(false);
                    }
                }

                if (payMethod === 2) {
                    try {
                        setIsLoading(true);
                        const response = await instance.post('/api/pl/vnpay', {
                            orderId: Math.random(),
                            language: '',
                            orderType: 1,
                            orderDescription: 'vnpay',
                            amount:
                                reduceQuantity > 3 ? totalAmount(cartItems) : totalAmount(cartItems) + deliveryMoney,
                            bankCode: '',
                            userId: data?.user.id,
                            products: cartItems,
                            address: `${state.name} - ${city.name} - ${country.name}`,
                            deliveryMethod: reduceQuantity > 3 ? 0 : deliveryMethod,
                            payMethod,
                            ...values,
                        });

                        window.location = response.data.url;
                    } catch (error: any) {
                        setIsLoading(true);
                        message.error(error.message);
                    } finally {
                        setIsLoading(false);
                    }
                }
            }
        }
    };

    return (
        <Wrapper className="py-8">
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <div className="grid grid-cols-1 gap-y-10 md:grid-cols-2 gap-x-6 lg:grid-cols-2">
                    <div className="col-span-1">
                        <h1 className="text-center font-medium text-xl mb-7 mt-7">CHI TIẾT THANH TOÁN</h1>

                        <InputField
                            name={'fullName'}
                            label="Tên đẩy đủ"
                            rules={[{ required: true, message: 'Bắt buộc' }]}
                        />

                        <Form.Item
                            label="Địa chỉ"
                            rules={[{ required: true, message: 'Bắt buộc' }]}
                            style={{ marginBottom: 10 }}
                        >
                            {/* <SelectedCountry data={countryData} selected={country} setSelected={setCountry} /> */}

                            {state && <SelectedCountry data={stateData} selected={state} setSelected={setState} />}
                            {city && <SelectedCountry data={cityData} selected={city} setSelected={setCity} />}
                        </Form.Item>

                        <InputField
                            name={'email'}
                            label="Địa chỉ email"
                            rules={[{ required: true, message: 'Bắt buộc' }]}
                        />

                        <InputField
                            name={'phone'}
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Bắt buộc' }]}
                        />

                        <InputField
                            textarea
                            name={'detailAddress'}
                            label="Địa chỉ chi tiết"
                            rules={[{ required: true, message: 'Bắt buộc' }]}
                        />

                        {/* <ButtonComponent className="col-span-1 mt-5">Thanh toán</ButtonComponent> */}
                    </div>
                    <div className="col-span-1">
                        <div className="bg-gray-100 px-4 py-4 relative lg:px-7 lg:py-7">
                            <div>
                                <StyleBill style={{ top: '-10px', backgroundPosition: '-3px -5px, 0 0' }} />
                                <h1 className="text-center font-medium text-xl mb-7">ĐƠN HÀNG CỦA BẠN</h1>
                                <div className=" bg-white px-7 py-7 relative">
                                    {loading && <LoadingElement />}
                                    <div className="flex justify-between">
                                        <span>SẢN PHẨM</span>
                                        <span>TỔNG</span>
                                    </div>
                                    <DividerFading fading />

                                    {cartItems.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <div className="flex justify-between px-2 py-1">
                                                    <span className="break-words text-sm w-[calc(100%-100px)]">
                                                        [Đặt hàng trước]{' '}
                                                        {item?.option ? (
                                                            <span className="font-semibold text-content">
                                                                {item?.name}{' '}
                                                                <strong className="text-black font-bold">
                                                                    {item?.option?.color && `- ${item?.option?.color}`}{' '}
                                                                    {item?.option?.size && `- ${item?.option?.size}`}{' '}
                                                                    {item?.option?.optionName &&
                                                                        `- ${item?.option?.optionName}`}
                                                                </strong>
                                                            </span>
                                                        ) : (
                                                            <span>{item?.name}</span>
                                                        )}
                                                        <strong className="ml-2">× {item.quantity}</strong>
                                                    </span>

                                                    <span className="text-gray-500">
                                                        {formartUSD(item?.price * item.quantity)}
                                                    </span>
                                                </div>
                                                <DividerFading />
                                            </div>
                                        );
                                    })}

                                    <BillBoard
                                        deliveryMoney={deliveryMoney}
                                        setDeliveryMoney={setDeliveryMoney}
                                        deliveryMethod={deliveryMethod}
                                        setDeliveryMethod={setDeliveryMethod}
                                    />
                                </div>
                                <br />
                                <div>
                                    <label className="hover:cursor-pointer">
                                        <input
                                            name="pay"
                                            className="mt-4"
                                            onChange={(e) => setPayMethod(Number(e.target.value))}
                                            value={1}
                                            type="radio"
                                            defaultChecked
                                        />
                                        <span className="ml-2">Thanh toán khi bạn nhận được hàng</span>
                                    </label>
                                    <AnimatePresence>
                                        {payMethod === 1 && (
                                            <motion.div
                                                animate={{ height: 50, opacity: 1, overflow: 'hidden' }}
                                                initial={{ height: 0 }}
                                                exit={{ height: 0 }}
                                            >
                                                <div className="bg-white mt-2 py-2 px-4 h-[40px] flex items-center">
                                                    <span className="mr-2">Thanh toán trả sau</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div>
                                    <label className="hover:cursor-pointer">
                                        <input
                                            name="pay"
                                            className="mt-4"
                                            onChange={(e) => setPayMethod(Number(e.target.value))}
                                            value={2}
                                            type="radio"
                                        />
                                        <span className="ml-2">Thanh toán bằng VNPAY</span>
                                    </label>

                                    <AnimatePresence>
                                        {payMethod === 2 && (
                                            <motion.div
                                                animate={{ height: 50, opacity: 1, overflow: 'hidden' }}
                                                initial={{ height: 0 }}
                                                exit={{ height: 0 }}
                                            >
                                                <div className="bg-white mt-2 py-2 px-4 h-[40px] flex items-center">
                                                    <span className="mr-2">Thanh toán bằng</span>
                                                    <img src="/vnpay.webp" alt="" className="w-[70px]" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div>
                                    <br />
                                    <DividerFading fading />
                                    <br />
                                    <p className="text-sm text-nav">
                                        Thông tin thẻ tín dụng sẽ được xử lý bằng cổng thanh toán an toàn do bạn lựa
                                        chọn và sẽ không được lưu trữ trong hệ thống trang web của chúng tôi. Dữ liệu cá
                                        nhân của bạn sẽ được sử dụng để xử lý đơn đặt hàng, hỗ trợ trải nghiệm của bạn
                                        trên trang web này và cho các mục đích khác được mô tả trong{' '}
                                        <strong className="text-[#48b8e5] font-semibold">chính sách bảo mật</strong> của
                                        chúng tôi.
                                    </p>

                                    <br />

                                    <DividerFading fading />

                                    <div className="text-sm text-nav">
                                        <label>
                                            <input type="checkbox" required />
                                            <span className="ml-2">
                                                Tôi hiểu và đồng ý rằng đơn hàng không thể bị hủy sau khi thanh toán
                                                xong. Tôi cũng đã đọc và đồng ý với các điều khoản và điều kiện của
                                                trang web *
                                            </span>
                                        </label>
                                    </div>

                                    <br />

                                    {payMethod === 1 && (
                                        <ButtonComponent htmlType="submit" loading={isLoading}>
                                            Thanh toán trả sau
                                        </ButtonComponent>
                                    )}
                                    {payMethod == 2 && (
                                        <ButtonComponent htmlType="submit" loading={isLoading}>
                                            Thanh toán
                                            <img
                                                src="/vnpay.webp"
                                                alt=""
                                                className="w-[50px] ml-2 h-[20px] object-cover"
                                            />
                                        </ButtonComponent>
                                    )}
                                </div>
                            </div>

                            <StyleBill style={{ bottom: '-10px', backgroundPosition: '-3px 2px, 0 0' }} />
                        </div>
                    </div>
                </div>
            </Form>
        </Wrapper>
    );
};

export default CheckoutDetail;
