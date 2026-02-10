export interface Product {
    code: string;
    name: string;
    price: number;
    remain: number; // จำนวนคงเหลือในสต็อก
}

export interface CartItem extends Product {
    quantity: number; // จำนวนที่ลูกค้าเลือกซื้อ
}