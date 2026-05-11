import { z } from "zod";

export const createBookingSchema = z.object({
    //number,int,positive : phai la so nguyen duong, so nguyen, lon hon 0
    maPhong: z.coerce.number().int().positive(),
    soLuongKhach: z.coerce.number().int().positive(),
    //date,min(1) : phai la chuoi, khong dc de rong
    ngayDen: z.string().min(1),
    ngayDi: z.string().min(1),
})
export const updateBookingSchema = z.object({
    //optional() : co the la null, khong dc de rong
    maPhong: z.coerce.number().int().positive().optional(),
    // z.coerce.number() : tự đổi string thành number sau đó kiểm tra điều kiện
    soLuongKhach: z.coerce.number().int().positive().optional(),
    ngayDen: z.string().min(1).optional(),
    ngayDi: z.string().min(1).optional(),
})
