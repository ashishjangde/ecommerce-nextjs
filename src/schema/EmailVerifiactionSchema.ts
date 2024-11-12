import z from 'zod';

const EmailVerificationSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Email is invalid' }),
})

export default EmailVerificationSchema