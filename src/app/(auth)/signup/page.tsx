'use client'
import React, { useState } from 'react'
import SignUpSchema from '@/schema/SignupSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@nextui-org/button'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast';
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
import { signIn } from 'next-auth/react'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/app/api/_utils/ApiResponse'

export default function Page() {
  const router = useRouter()
  const [submitting , setSubmitting] = useState(false)
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmpassword: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setSubmitting(true);
    
    try {
      const response = await axios.post<ApiResponse<typeof SignUpSchema>>('/api/auth/signup', data);
      
      if (response.status === 201 && response.data) {
        if (response.data.apiError) {
          toast.error(response.data.apiError.message);
        } else {
          toast.success('Account created successfully');
          router.push('/login');
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
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
      <section className='flex flex-col gap-2 w-full max-w-md px-10 py-7 bg-white rounded-3xl shadow-lg'>
      <h1 className='text-4xl text-center font-bold text-gray-800 dark:text-gray-100'>NextStore</h1>
        <h2 className="text-center text-lg text-gray-600">Welcome to NextStore !!</h2>
            <div className="flex items-center justify-center my-4">
          <hr className="border-gray-300 w-full" />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />  
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
            <FormField
              control={form.control}
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
            {submitting ? <Spinner color='white'/>  : 'Login'}
            </Button>
          </form>
        </Form>
        <div className="flex justify-center items-center text-sm text-gray-100">
          <Link href="/login" className='text-gray-600'>have an account?<span className='text-blue-600 hover:underline'> Signin</span></Link>
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
  )
}