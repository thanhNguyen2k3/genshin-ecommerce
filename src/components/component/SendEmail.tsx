import { ExtandOrder } from '@/types/extend';
import { formartUSD } from '@/utils/formartUSD';
import { renderStatus } from '@/utils/renderStatus';

const baseUrl = process.env.NEXT_URL ? `${process.env.NEXT_URL}` : '';

type Props = {
    orderId?: string;
    order?: ExtandOrder;
};

const ShopReceiptEmail = ({ orderId, order }: Props) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm: any = today.getMonth() + 1; // Months start at 0!
    let dd: any = today.getDate();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    const formattedToday = dd + '/' + mm + '/' + yyyy;

    return (
        <div
            style={{
                maxWidth: 670,
                backgroundColor: '#fff',
                borderRadius: '3px',
                borderTop: 'solid 10px green',
                minWidth: 600,
                margin: '0 auto',
            }}
        >
            <div>
                <div style={{ textAlign: 'left', padding: '10px 10px 0px 10px' }}>
                    <img
                        style={{ maxWidth: ' 150px' }}
                        src={`https://genshin.global/wp-content/uploads/2022/05/logo-genshin-impact-global.webp`}
                        alt="Shop"
                    />
                </div>
                <div style={{ textAlign: 'right', fontWeight: 400, paddingRight: 10 }}>{formattedToday}</div>
            </div>
            <div>
                <div>
                    <div style={{ border: 'solid 1px #ddd', padding: '10px 20px' }}>
                        <p style={{ fontSize: '14px', margin: '0 0 6px 0' }}>
                            <span style={{ fontWeight: 'bold', display: 'inline-block', minWidth: '150px' }}>
                                Trạng thái đơn hàng
                            </span>
                            <b style={{ color: 'green', fontWeight: 'normal', margin: '0' }}>
                                {renderStatus(order?.status!)}
                            </b>
                        </p>
                        <p style={{ fontSize: '14px', margin: '0 0 6px 0' }}>
                            <span style={{ fontWeight: 'bold', display: 'inline-block', minWidth: '146px' }}>
                                Transaction ID
                            </span>
                            {orderId}
                        </p>
                        <p style={{ fontSize: '14px', margin: '0 0 0 0' }}>
                            <span style={{ fontWeight: 'bold', display: 'inline-block', minWidth: '146px' }}>
                                Tổng đơn hàng
                            </span>{' '}
                            {formartUSD(order?.total!)}
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto auto',
                        border: '1px solid #ccc',
                        marginTop: 10,
                        padding: 10,
                    }}
                >
                    <div>
                        <p style={{ margin: '0 0 10px 0', padding: 0, fontSize: '14px' }}>
                            <span style={{ display: 'block', fontWeight: 'bold', fontSize: '13px' }}>
                                Tên khách hàng :
                            </span>{' '}
                            {order?.fullName}
                        </p>
                        <p style={{ margin: '0 0 10px 0', padding: 0, fontSize: '14px' }}>
                            <span style={{ display: 'block', fontWeight: 'bold', fontSize: '13px' }}>Email :</span>{' '}
                            {order?.user?.email}
                        </p>
                        <p style={{ margin: '0 0 10px 0', padding: 0, fontSize: '14px' }}>
                            <span style={{ display: 'block', fontWeight: 'bold', fontSize: '13px' }}>
                                Số điện thoại :
                            </span>{' '}
                            {order?.phone}
                        </p>
                    </div>
                    <div>
                        <p style={{ margin: '0 0 10px 0', padding: 0, fontSize: '14px' }}>
                            <span style={{ display: 'block', fontWeight: 'bold', fontSize: '13px' }}>ID No. :</span>{' '}
                            {order?.user?.id || 'ID trống'}
                        </p>
                        <p style={{ margin: '0 0 10px 0', padding: 0, fontSize: '14px' }}>
                            <span style={{ display: 'block', fontWeight: 'bold', fontSize: '13px' }}>Địa chỉ :</span>{' '}
                            {order?.detailAddress}
                        </p>
                        <p style={{ margin: '0 0 10px 0', padding: 0, fontSize: '14px' }}>
                            <span style={{ display: 'block', fontWeight: 'bold', fontSize: '13px' }}>Giao hàng :</span>{' '}
                            {order?.deliveryMethod === 1 ? 'Tiêu chuẩn' : 'Nhanh'}
                        </p>
                        <p style={{ margin: '0 0 10px 0', padding: 0, fontSize: '14px' }}>
                            <span style={{ display: 'block', fontWeight: 'bold', fontSize: '13px' }}>Thanh toán :</span>{' '}
                            {order?.payMethod === 1 ? 'Trả sau' : 'Đã thanh toán'}
                        </p>
                    </div>
                </div>

                <div style={{ border: '1px solid #ccc', marginTop: 10, padding: 10 }}>
                    <h3 style={{ fontSize: '20px' }}>Sản phẩm</h3>
                    <table style={{ marginTop: 10 }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ccc', padding: '6px 10px' }}>Tên sản phẩm</th>
                                <th style={{ border: '1px solid #ccc', padding: '6px 10px' }}>Giá</th>
                            </tr>
                        </thead>
                        <tbody style={{ padding: '15px' }}>
                            {order?.orderItems?.map((order) => (
                                <tr
                                    style={{
                                        fontSize: '14px',
                                        margin: 0,
                                        padding: '10px',
                                        border: 'solid 1px #ddd',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    <td style={{ width: '100%', border: '1px solid #ccc', padding: '6px 10px' }}>
                                        <span style={{ display: 'block', fontSize: '13px', fontWeight: 'normal' }}>
                                            {order?.product?.name}{' '}
                                            {order?.variantId && (
                                                <strong>
                                                    {order?.variant?.colorId && `- ${order?.variant?.color?.name}`}{' '}
                                                    {order?.variant?.sizeId && `- ${order?.variant?.size?.value}`}{' '}
                                                    {order?.variant?.optionName && `- ${order?.variant?.optionName}`}
                                                </strong>
                                            )}
                                            <b style={{ fontSize: '12px', fontWeight: 800 }}>x {order.quantity}</b>
                                        </span>{' '}
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: '6px 10px' }}>
                                        {formartUSD(order?.product?.price! * order.quantity)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShopReceiptEmail;
