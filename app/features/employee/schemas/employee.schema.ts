import { z } from 'zod'

export const employeeSchema = z.object({
    name: z.string().trim().min(1, 'Nama wajib diisi').max(100),
    position: z.string().trim().min(1, 'Jabatan wajib diisi'),
    grade: z.string().min(1, 'Grade wajib dipilih'),
    salary: z.number().positive('Gaji harus lebih dari 0'),
    address: z.string().trim().min(1, 'Alamat wajib diisi'),
    province: z.string().min(1, 'Provinsi wajib dipilih'),
    city: z.string().min(1, 'Kota wajib dipilih'),
    district: z.string().min(1, 'Kecamatan wajib dipilih'),
    birthDate: z.string()
        .min(1, 'Tanggal lahir wajib diisi')
        .refine(value => !Number.isNaN(Date.parse(value)), 'Tanggal lahir tidak valid')
        .refine(value => new Date(value) < new Date(), 'Tanggal lahir harus sebelum hari ini'),
})

export type EmployeeFormData = z.infer<typeof employeeSchema>