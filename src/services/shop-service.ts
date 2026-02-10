import { Product, CartItem } from '@/types/shop';

export const shopService = {

    getProducts: async (): Promise<Product[]> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลสินค้าได้');

        const res = await response.json();
        return res.data.items;
    },

    checkout: async (cart: CartItem[]) => {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: cart.map(item => ({
                    code: item.code,
                    amount: item.quantity
                }))
            }),
        });

        console.log('response', response);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Checkout failed');
        }

        return await response.json();
    }
};