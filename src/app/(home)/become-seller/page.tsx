'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Percent, Infinity, ChevronRight, Building2, Mail, Phone, MapPin, Globe, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from '@hookform/resolvers/zod';
import SellerRegistrationSchema from '@/schema/SellerRegistrationSchema';
import toast from 'react-hot-toast';
import { ApiResponse } from '@/app/api/_utils/ApiResponse';




export default function Page () {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<z.infer<typeof SellerRegistrationSchema>>({
    resolver: zodResolver(SellerRegistrationSchema),
    defaultValues: {
      businessName: '',
      email: '',
      phone: '',
      address: { street: '', city: '', state: '', pinCode : '', country: '' },
      website: '',
      gstin: '',
      panNumber: ''
    }
  });

  const handleNextStep = async () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = await form.trigger(['businessName', 'email', 'phone']);
    } else if (currentStep === 2) {
      isValid = await form.trigger(['address.street', 'address.city', 'address.state', 'address.pinCode', 'address.country']);
    } else {
      isValid = await form.trigger([ 'gstin', 'panNumber']);
    }

    if (isValid) {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
      } else {
        await form.handleSubmit(onSubmit)();
      }
    }
  };

  const onSubmit = async (data: z.infer<typeof SellerRegistrationSchema>) => {
    try {
      const formData = {
        ...data,
        website: data.website || undefined
      };
     const response = await axios.post('/api/user/request-seller', formData);
      if (response.status === 201 && response.data) {
        toast.success('Account created successfully');
    }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const apiError = error.response.data as ApiResponse<null>;
        toast.error(apiError.apiError?.message || "Something went wrong");
      } else {
        console.error("An unexpected error occurred:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const progressWidth = `${((currentStep - 1) / 2) * 100}%`;

  return (
    <div className="min-h-screen bg-gradient-to-br mt-20 from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-950">
                Join NextStore
              </h1>
              <p className="text-xl text-gray-600">
                Start selling to millions of customers today
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: <DollarSign className="w-8 h-8" />, title: "No Hidden Fees", description: "Transparent pricing with no surprises" },
                { icon: <Percent className="w-8 h-8" />, title: "Competitive Rates", description: "Just 5% commission on sales" },
                { icon: <Infinity className="w-8 h-8" />, title: "Unlimited Products", description: "List as many items as you want" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start space-x-4 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg text-blue-600">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="backdrop-blur-sm bg-white/90 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="space-y-1 p-6">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-2xl font-bold">Seller Registration</CardTitle>
                  <span className="text-sm text-gray-500">Step {currentStep}/3</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: progressWidth }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <Form {...form}>
                  <form className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {currentStep === 1 && (
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="businessName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Business Name</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      className="pl-10 h-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="Enter your business name"
                                    />
                                    <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                  </div>
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
                                <FormLabel className="text-gray-700">Email Address</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      type="email"
                                      className="pl-10 h-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="Enter your email"
                                    />
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Phone Number</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      type="tel"
                                      className="pl-10 h-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="Enter your phone number"
                                    />
                                    <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="address.street"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Street Address</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      className="pl-10 h-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="Enter street address"
                                    />
                                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="address.city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-700">City</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      className="h-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="City"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="address.state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-700">State</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      className="h-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="State"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="address.pinCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Pin Code</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="h-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Postal Code"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="address.country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Country</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="h-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Country"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem> 
                            )}
                          />
                         </div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Website (Optional)</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      className="pl-10 h-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="https://example.com"
                                    />
                                    <Globe className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="gstin"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">GSTIN</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      className="pl-10 h-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="Enter GSTIN"
                                    />
                                    <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="panNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">PAN Number</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      className="pl-10 h-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="Enter PAN Number"
                                    />
                                    <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </motion.div>

                    <div className="flex justify-between pt-6">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(prev => prev - 1)}
                          className="h-12 px-6 text-gray-600 hover:text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
                        >
                          Back
                        </Button>
                      )}
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="h-12 px-8 ml-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg flex items-center gap-2"
                      >
                        {currentStep === 3 ? 'Submit' : 'Next'}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

