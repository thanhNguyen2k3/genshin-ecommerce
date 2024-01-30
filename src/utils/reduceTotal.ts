export const totalAmount = (cartItems: any[]) => {
    return cartItems.reduce((sum: number, item: any) => {
        return sum + item?.price * item?.quantity;
    }, 0);
};
