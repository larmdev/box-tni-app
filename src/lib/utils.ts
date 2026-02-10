import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAge(birthdayStr: string | null | undefined): string | number {
  // 1. ถ้าไม่มีข้อมูล ให้ส่งค่าว่างหรือ "-" กลับไปเลย
  if (!birthdayStr || typeof birthdayStr !== 'string') return "-";

  try {
    // 2. แยก วัน/เดือน/ปี
    const parts = birthdayStr.split('/');
    if (parts.length !== 3) return "-"; // ป้องกันกรณี Format วันที่ผิด

    const [day, month, year] = parts.map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    // ตรวจสอบว่าวันที่สร้างขึ้นมาถูกต้อง (Valid Date)
    if (isNaN(birthDate.getTime())) return "-";

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  } catch (error) {
    return "-";
  }
}