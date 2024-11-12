import z from 'zod';

const VeriificationCodeSchema = z.object({
    code: z
        .string()
        .min(1, { message: 'Code is required' })
        .min(6, { message: 'Code must be at least 6 characters' }),
})

export default VeriificationCodeSchema