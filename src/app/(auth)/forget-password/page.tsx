'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Spinner } from "@nextui-org/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from '@nextui-org/button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';

import { emailValidatorSchema, passwordSchema, verificationCodeSchema } from '@/schema/GenralSchema';

export default function Page() {
  const router = useRouter();
  const [step, setStep] = useState(0); // Step: 0 = email, 1 = code, 2 = password
  const [submitting, setSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");

  const emailForm = useForm({
    resolver: zodResolver(emailValidatorSchema),
    defaultValues: {
      email: "",
    }
  });
  const codeForm = useForm({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      code: "",
    }
  });
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmpassword: "",
    }
  });

  const handleEmailSubmit = async (data: z.infer<typeof emailValidatorSchema>) => {
    setSubmitting(true);
    try {
      const respone =  await axios.post('/api/auth/forget-password/sendotp', { email: data.email });
        if(respone.status === 200){
          setEmail(data.email)
          setStep(1)
          toast.success("Verification code sent successfully. Please check your email.");
        }
    } catch (error) {
        toast.error("Failed to send verification code. Please try again.");
    } finally {
        setSubmitting(false);
    }
};


  const handleCodeSubmit = async (data : z.infer<typeof verificationCodeSchema>) => {
    setSubmitting(true);
    try {
      const response = await axios.post('/api/auth/forget-password/verify-otp', {  email:email , verificationCode: data.code });
      if (response.status === 200) {
        console.log(response.data);
        setVerificationCode(data.code);
        toast.success("Verification code verified successfully.");
        setStep(2); 
      } else {
        console.log(response.data);
        toast.error("Invalid verification code. Please try again.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Code verification failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    setSubmitting(true);
    try {
     await axios.post('/api/auth/forget-password/change-password', {  email: email, verificationCode: verificationCode, password: data.password });
      toast.success('Password set successfully! You can now log in.');
      router.push('/login');
    } catch (error) {
      toast.error("Failed to set password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className='flex items-center justify-center min-h-screen bg-gray-100'>
      <section className='flex flex-col gap-2 w-full max-w-md px-10 py-12 bg-white rounded-3xl shadow-lg'>
        <Image src="/logo.png" alt="logo" width={200} height={50} className='mx-auto' />
        <h2 className="text-center text-lg text-gray-600">
          {step === 0 ? "Welcome back to Discount!" : step === 1 ? "Enter the verification code" : "Set your new password"}
        </h2>
        <div className="flex items-center justify-center my-4">
          <hr className="border-gray-300 w-full" />
        </div>
        {step === 0 && (
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-3">
              <FormField
                control={emailForm.control}
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
              <Button type='submit' className='w-full bg-blue-600 rounded-full px-4 py-2 text-white hover:bg-blue-700 transition'>
                {submitting ? <Spinner color='white' /> : 'Send Verification Code'}
              </Button>
            </form>
          </Form>
        )}
        {step === 1 && (
          <Form {...codeForm}>
            <form onSubmit={codeForm.handleSubmit(handleCodeSubmit)} className="space-y-3">
              <FormField
                control={codeForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the verification code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full bg-blue-600 rounded-full px-4 py-2 text-white hover:bg-blue-700 transition'>
                {submitting ? <Spinner color='white' /> : 'Verify Code'}
              </Button>
            </form>
          </Form>
        )}
        {step === 2 && (
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-3">
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full bg-blue-600 rounded-full px-4 py-2 text-white hover:bg-blue-700 transition'>
                {submitting ? <Spinner color='white' /> : 'Set Password'}
              </Button>
            </form>
          </Form>
        )}
        <div className="flex justify-center items-center text-sm text-gray-100 mt-4">
          <Link href="/login" className='text-gray-600'>Already have an account? <span className='text-blue-600 hover:underline'>Log In</span></Link>
        </div>
      </section>
    </main>
  );
}
