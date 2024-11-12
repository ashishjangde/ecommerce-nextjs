import z from 'zod';

const EmailAndVerificationCodeSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Email is invalid' }),
    code: z
        .string()
        .min(1, { message: 'Code is required' })
        .min(6, { message: 'Code must be at least 6 characters' }),
})

export default EmailAndVerificationCodeSchema