'use client';
import SignInSchema from '@/schema/SignInSchema';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {Spinner} from "@nextui-org/spinner";
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
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast';
import { CredentialsSignin } from 'next-auth';



export default function Page() {
  const [submitting , setSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    setSubmitting(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        ...data
      });
  
      if (result?.error) {
        console.log(result);
        toast.error(result.code || "An error occurred during login.");
      } else {
        toast.success("Login successful");
        router.push("/");
      }
    } catch (error) {
     if (error instanceof CredentialsSignin) {
        toast.error(error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <main className='flex items-center justify-center min-h-screen bg-gray-100'>
      <section className='flex flex-col gap-2 w-full max-w-md px-10 py-12 bg-white rounded-3xl shadow-lg '>
      <h1 className='text-4xl text-center font-bold text-gray-800 dark:text-gray-100'>NextStore</h1>
        <h2 className="text-center text-lg text-gray-600">Welcome back to NextStore !!</h2>
        <div className="flex items-center justify-center my-4">
          <hr className="border-gray-300 w-full" />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full bg-blue-600 rounded-full px-4 py-2 text-white hover:bg-blue-700 transition'>
             {submitting ? <Spinner color='white'/>  : 'Login'} 
            </Button>
          </form>
        </Form>

        <div className="flex justify-between text-sm text-gray-100">
          <Link href="/forgot-password" className="hover:underline text-blue-600">Forgot Password?</Link>
          <Link href="/signup" className='text-gray-600'>Dont have an account?<span className='text-blue-600 hover:underline'> Sign Up</span></Link>
        </div>
        <div className="flex items-center justify-center my-4">
          <hr className="border-gray-300 w-1/4" />
          <span className="mx-2 text-gray-600">or</span>
          <hr className="border-gray-300 w-1/4" />
        </div>
        <div className="flex items-center justify-center">
        <Button
          onClick={() => {
            signIn('google', { redirectTo: '/' }).catch((error) =>
              console.error('Google login failed:', error)
            );
          }}
          className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-full px-4 py-2 text-gray-800 shadow-md transition"
        >
          <Image src="/google.svg" alt="google" width={25} height={25} className="mr-2" />
          Continue with Google
        </Button>
        </div>
      </section>
    </main>
  );
}