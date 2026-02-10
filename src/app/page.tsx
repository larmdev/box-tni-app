"use client"
import { useState, useEffect } from 'react';
import { Product, CartItem } from '@/types/shop';
import { shopService } from '@/services/shop-service';

export default function Shop() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const data = await shopService.getProducts();
            setProducts(data);
        } catch (error) {
            console.error(error);
            alert("โหลดข้อมูลสินค้าไม่สำเร็จ");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const isExist = prev.find(item => item.code === product.code);
            if (isExist) {
                if (isExist.quantity < product.remain) {
                    return prev.map(item => item.code === product.code
                        ? { ...item, quantity: item.quantity + 1 } : item);
                }
                return prev;
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const checkout = async () => {
        if (cart.length === 0) return;

        try {
            await shopService.checkout(cart);

            alert("ชำระเงินสำเร็จ!");
            setCart([]); // ล้างตะกร้า

            await fetchProducts();

        } catch (error) {
            console.error("Checkout Error:", error);
            alert("เกิดข้อผิดพลาดในการตัดสต็อก: " + (error instanceof Error ? error.message : "Unknown error"));
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="animate-pulse text-lg font-bold">กำลังโหลดข้อมูลสินค้า...</p>
            </div>
        );
    }

    const removeItem = (code: string) => {
        setCart(prev => prev.filter(item => item.code !== code));
    };

    const clearCart = () => {
        if (confirm("คุณต้องการล้างตะกร้าสินค้าทั้งหมดใช่หรือไม่?")) {
            setCart([]);
        }
    };

    const updateQuantity = (code: string, delta: number) => {
        setCart(prev => {
            const updatedCart = prev.map(item => {
                if (item.code === code) {
                    const newQty = item.quantity + delta;
                    const productInStock = products.find(p => p.code === code);
                    const maxStock = productInStock ? productInStock.remain : 0;

                    if (newQty <= maxStock) {
                        return { ...item, quantity: newQty };
                    }
                }
                return item;
            });

            return updatedCart.filter(item => item.quantity > 0);
        });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-8 bg-gray-50 min-h-screen">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(p => {
                    const itemInCart = cart.find(item => item.code === p.code);
                    const quantityInCart = itemInCart ? itemInCart.quantity : 0;
                    const availableStock = p.remain - quantityInCart;

                    return (
                        <div
                            key={p.code}
                            className={`flex flex-col bg-white p-6 rounded-2xl shadow-sm border transition-all ${availableStock <= 0 ? 'opacity-60' : 'border-gray-100'
                                }`}
                        >
                            <div className="flex justify-between mb-4">
                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{p.code}</span>
                                <span className={`text-xs font-bold ${availableStock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    สต็อก: {availableStock}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold mb-1">{p.name}</h3>
                            <p className="text-2xl font-black text-gray-800 mb-6">฿{p.price}</p>

                            <button
                                onClick={() => addToCart(p)}
                                disabled={availableStock <= 0}
                                className={`mt-auto w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${availableStock > 0
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-100'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {availableStock > 0 ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-0 2.1-0.916 2.351-1.996l1.24-4.5a1.125 1.125 0 0 0-1.08-1.364H5.25m1.75 4.5h15.75m-14.25 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM16.5 20.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                                        </svg>
                                        เพิ่มลงตะกร้า
                                    </>
                                ) : (
                                    'สินค้าหมด'
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="w-full lg:w-96">
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-8">

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">ตะกร้าของคุณ</h2>
                        {cart.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="text-sm text-red-500 hover:underline"
                            >
                                ล้างตะกร้า
                            </button>
                        )}
                    </div>

                    <div className="space-y-4 mb-8">
                        {cart.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">ตะกร้าว่างเปล่า</p>
                        ) : cart.map(item => (
                            <div key={item.code} className="flex justify-between items-center group">
                                <div className="flex-1">
                                    <p className="font-bold">{item.name}</p>
                                    <p className="text-sm text-gray-500">฿{item.price} x {item.quantity}</p>
                                </div>

                                <div className="flex items-center gap-1">
                                    <p className="font-bold text-gray-800">฿{item.price * item.quantity}</p>

                                    <button
                                        onClick={() => updateQuantity(item.code, -1)}
                                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600"
                                    >
                                        -
                                    </button>

                                    <span className="w-6 text-center font-bold text-sm">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() => updateQuantity(item.code, 1)}
                                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600"
                                        title={item.quantity >= (products.find(p => p.code === item.code)?.remain || 0) ? "สินค้าในสต็อกไม่พอ" : ""}
                                    >
                                        +
                                    </button>

                                    <button
                                        onClick={() => removeItem(item.code)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        title="ลบรายการนี้"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between text-xl font-black mb-6">
                            <span>ยอดรวมทั้งหมด</span>
                            <span className="text-blue-600">
                                ฿{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                            </span>
                        </div>

                        <button
                            onClick={checkout}
                            disabled={cart.length === 0}
                            className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-600 shadow-lg shadow-green-100 disabled:bg-gray-100"
                        >
                            ยืนยันการขาย (ตัดสต็อก)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}