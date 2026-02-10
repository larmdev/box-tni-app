import * as z from "zod"

export interface Member {
  memberId?: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  birthday: number;
  birthdayStr?: string | null; // เพิ่ม ? หรือ | null    
  status: string | null;
}
export interface MemberResponse {
  data: Member[];
  total: number;
  totalPages: number;
  pageSize: number;
}

export const memberSchema = z.object({
  // ปรับให้เป็น optional เพราะตอน "เพิ่มใหม่" จะยังไม่มี ID นี้
  memberId: z.string().nullable().optional(),
  phone: z.string().optional(),
  fullName: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  birthdayStr: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "รูปแบบต้องเป็น DD/MM/YYYY"),
  position: z.string(), // ปรับเป็น string ธรรมดาก่อนถ้าใน API เป็น "Software Engineer" ฯลฯ
  status: z.string().optional()
})

export type MemberFormValues = z.infer<typeof memberSchema>