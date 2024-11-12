import z from 'zod';

const ForgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Email is invalid' }),
    verificationCode : z
        .string()
        .min(1, { message: 'Code is required' })
        .min(6, { message: 'Code must be at least 6 characters' }),

    newPassword: z
        .string()
        .min(1, { message: 'Password is required' })
        .min(6, { message: 'Password must be at least 6 characters' }),

    confirmNewPassword: z
        .string()
        .min(1, { message: 'Confirm Password is required' })
        .min(6, { message: 'Confirm Password must be at least 6 characters' })
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
}); 

export default ForgotPasswordSchema;
