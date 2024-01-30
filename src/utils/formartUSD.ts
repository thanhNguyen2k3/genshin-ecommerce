export const formartUSD = (price: number) => {
    const formatter = new Intl.NumberFormat('vn', {
        style: 'currency',
        currency: 'VND',
    });

    return formatter.format(price);
};
