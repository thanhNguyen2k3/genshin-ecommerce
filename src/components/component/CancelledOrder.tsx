const CancelledOrder = () => {
    return (
        <div>
            <h4 style={{ fontSize: 16, fontWeight: 500 }}>Shop Genshin Global thông báo</h4>
            <br />
            <h1 style={{ fontSize: 20, fontWeight: 500 }}>Đơn hàng của bạn đã được hủy theo yêu cầu 🥰.</h1>
            <br />
            <p>Cảm ơn quý khách đã ủng hộ.</p>
            <br />
            <p>
                Ghé thăm shop{' '}
                <a href={process.env.NEXT_URL!} style={{ color: 'blue' }}>
                    {process.env.NEXT_URL!}
                </a>
            </p>
        </div>
    );
};

export default CancelledOrder;
