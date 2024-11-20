'use client'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import React, { useState } from 'react'
import { Spinner } from "@nextui-org/spinner";
import IdandVerificationCodeSchema from '@/schema/auth/IdAndVerificationCodeSchema';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ApiResponse } from '@/app/api/_utils/ApiResponse';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { InputOTP, InputOTPSlot } from '@/components/ui/input-otp';
import { ApiError } from '@/app/api/_utils/ApiError';

export default function Page() {
    const [submitting, setSubmitting] = useState(false);
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const form = useForm<z.infer<typeof IdandVerificationCodeSchema>>({
        resolver: zodResolver(IdandVerificationCodeSchema),
        defaultValues: {
            id: params.id || '',
            verificationCode: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof IdandVerificationCodeSchema>) => {
        setSubmitting(true); 
        try {
            const response = await axios.post<ApiResponse<typeof IdandVerificationCodeSchema>>( '/api/auth/verify-user', data );
    
            if (response.data) {
                const { apiError } = response.data;
    
                if (apiError) {
                    toast.error(apiError.message || "Verification failed. Please try again.");
                } else {
                    toast.success("OTP verified successfully");
                    router.push('/login'); 
                }
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
        <main className="flex items-center justify-center min-h-screen bg-gray-50">
            <section className="w-full max-w-md px-8 py-12 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">NextStore</h1>
                <p className="text-center text-gray-600 mb-6">Enter your verification code to proceed</p>
                <div className="flex items-center justify-center mb-4">
                    <hr className="border-gray-300 w-full" />
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <input type="hidden" {...form.register("id")} />

                        <FormField
                            control={form.control}
                            name="verificationCode"
                            render={({ field }) => (
                                <FormItem>
                                    <label className="block mb-4 text-sm font-medium text-gray-700 text-center">
                                        Verification Code
                                    </label>
                                    <div className="flex justify-center">
                                        <InputOTP
                                            maxLength={6}
                                            {...field}
                                            className="flex space-x-2"
                                            disabled={submitting}
                                        >
                                            {[...Array(6)].map((_, i) => (
                                                <InputOTPSlot key={i} index={i} />
                                            ))}
                                        </InputOTP>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 rounded-full px-4 py-2 text-white hover:bg-blue-700 transition"
                        >
                            {submitting ? <Spinner color="white" /> : "Submit"}
                        </Button>
                    </form>
                </Form>

                <div className="flex items-center justify-center my-4">
                    <hr className="border-gray-300 w-1/4" />
                    <span className="mx-2 text-gray-600">or</span>
                    <hr className="border-gray-300 w-1/4" />
                </div>
                <p className="text-center text-gray-500 text-sm">
                    Need help? <a href="#" className="text-blue-600 hover:underline">Contact Support</a>
                </p>
            </section>
        </main>
    )
}
