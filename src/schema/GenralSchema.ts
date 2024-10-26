import z from 'zod'

export const emailValidatorSchema = z.object({
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Email is invalid' }),
  })
  
 export const verificationCodeSchema = z.object({
    code: z
      .string()
      .min(1, { message: 'Code is required' })
      .min(6, { message: 'Code must be at least 6 characters' }),
  })
  
 export const passwordSchema = z.object({
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters' }),
  
    confirmpassword: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters' }),
  }).refine((data) => data.password === data.confirmpassword, {
    message: 'Passwords do not match',
    path: ['confirmpassword'],
});