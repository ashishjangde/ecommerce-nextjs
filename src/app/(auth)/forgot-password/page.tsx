'use client';
import React, { useState } from 'react';
import ForgotPasswordSchema from '@/schema/ForgotPasswordSchema';
import EmailVerificationSchema from '@/schema/EmailVerifiactionSchema';
import VeriificationCodeSchema from '@/schema/VeriificationCodeSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Spinner } from '@nextui-org/spinner';
import axios, { AxiosError } from 'axios';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from 'zod';
import { ApiResponse } from '@/app/api/_utils/ApiResponse';
import { useRouter } from 'next/navigation';


type EmailVerificationData = z.infer<typeof EmailVerificationSchema>;
type VerificationCodeData = z.infer<typeof VeriificationCodeSchema>;
type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>;

const ForgotPasswordComponent = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const schema = [EmailVerificationSchema, VeriificationCodeSchema, ForgotPasswordSchema][step - 1];

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      verificationCode: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });


  const onSubmit = async (data: EmailVerificationData | VerificationCodeData | ForgotPasswordData) => {
    setSubmitting(true);

    try {
      if (step === 1 && 'email' in data) {
        console.log("inside step 1");
        await axios.post('/api/auth/send-verification-code', { email: data.email });
        toast.success('OTP sent to your email.');
        setStep(2);
      } else if (step === 2 && 'verificationCode' in data) {
        console.log("inside step 2");
        await axios.post('/api/auth/verify-otp', {
          email: data.email,
          verificationCode: data.verificationCode,
        });
        toast.success('OTP verified successfully.');
        setStep(3);
      } else if (step === 3 && 'newPassword' in data) {
        console.log("inside step 3");
        await axios.post('/api/auth/recover-password', {
          email: data.email,
          verificationCode: data.verificationCode,
          newPassword: data.newPassword,
        });
        toast.success('Password reset successful.');
       router.push('/login');
        form.reset(); 
      }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const apiError = error.response.data as ApiResponse<null>;
            toast.error(apiError.apiError?.message || "Something went wrong");
          } else {
            console.error("An unexpected error occurred:", error);
            toast.error("An unexpected error occurred");
          }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className='flex items-center justify-center min-h-screen bg-gray-100'>
      <section className='flex flex-col gap-2 w-full max-w-md px-10 py-12 bg-white rounded-3xl shadow-lg'>
        <h1 className='text-4xl text-center font-bold text-gray-800'>NextStore</h1>
        <h2 className="text-center text-lg text-gray-600">Forgot Password</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {step === 1 && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {step === 2 && (
              <FormField
                control={form.control}
                name="verificationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the OTP sent to your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {step === 3 && (
              <>
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <Button type='submit' className='w-full bg-blue-600 rounded-full px-4 py-2 text-white hover:bg-blue-700 transition'>
              {submitting ? <Spinner color='white'/> : step === 3 ? 'Reset Password' : 'Next'}
            </Button>
          </form>
        </Form>
        
        <div className="flex justify-between text-sm text-gray-100 mt-4">
          <Link href="/login" className="hover:underline text-blue-600">Back to Login</Link>
        </div>
      </section>
    </main>
  );
};

export default ForgotPasswordComponent;
