import z from 'zod';

const VeriificationCodeSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }), 
    verificationCode: z
        .string()
        .min(1, { message: 'Code is required' })
        .min(6, { message: 'Code must be at least 6 characters' }),
});

export default VeriificationCodeSchema;