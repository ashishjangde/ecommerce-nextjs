import z from 'zod';

const SignUpSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Name is required' })
        .min(3, { message: 'Name must be at least 3 characters' }),
    email: z
        .string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Email is invalid' }),
    password: z
        .string()
        .min(1, { message: 'Password is required' })
        .min(6, { message: 'Password must be at least 6 characters' }),
        
    confirmpassword: z
        .string()
        .min(1, { message: 'Confirm Password is required' })
        .min(6, { message: 'Confirm Password must be at least 6 characters' })
}).refine((data) => data.password === data.confirmpassword, {
    message: 'Passwords do not match',
    path: ['confirmpassword'],
});

export default SignUpSchema