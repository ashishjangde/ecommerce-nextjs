import z from 'zod';

const IdAndVerificationCodeSchema = z.object({
    id: z
        .string()
        .min(4, { message: 'id is required' }),
    verificationCode: z
        .string()
        .min(1, { message: 'Code is required' })
        .min(6, { message: 'Code must be at least 6 characters' }),
})

export default IdAndVerificationCodeSchema