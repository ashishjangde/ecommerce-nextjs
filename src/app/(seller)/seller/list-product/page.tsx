'use client';
import React, { useCallback, useState } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import Image from 'next/image';
import { 
  CloudUpload, 
  X, 
  Image as ImageIcon, 
  DollarSign, 
  Tags, 
  Layout, 
  Package,
  Building,
  Users ,
  ChartBarStacked
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useDrag, useDrop } from 'react-dnd';
import { useForm } from "react-hook-form"

interface ImageFile extends FileWithPath {
  preview: string;
}

interface ProductFormValues {
  productName: string;
  brand: string;
  category: string;
  subCategory: string;
  lowLevelCategory: string;
  gender: string;
  actualPrice: number;
  sellingPrice: number;
  description: string;
}

const ProductForm: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  
  // Initialize form with useForm hook
  const form = useForm<ProductFormValues>({
    defaultValues: {
      productName: "",
      brand: "",
      category: "",
      subCategory: "",
      lowLevelCategory: "",
      gender: "",
      actualPrice: 0,
      sellingPrice: 0,
      description: "",
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    console.log('Form data:', data);
    // Handle form submission here
  };

  const onDrop = (acceptedFiles: FileWithPath[]) => {
    const newImages = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const moveImage = (dragIndex: number, hoverIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(dragIndex, 1);
    newImages.splice(hoverIndex, 0, movedImage);
    setImages(newImages);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    multiple: true,
  });

  const ImageItem: React.FC<{ image: ImageFile; index: number }> = ({ image, index }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'image',
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    const [, drop] = useDrop(() => ({
      accept: 'image',
      hover: (item: { index: number }) => {
        if (item.index !== index) {
          moveImage(item.index, index);
          item.index = index;
        }
      },
    }));

    const handleRef = useCallback((node: HTMLDivElement | null) => {
      if (node) {
        drag(drop(node));
      }
    }, [drag, drop]);

    return (
      <div
        ref={handleRef}
        className={`relative group p-2 border rounded-lg shadow-sm w-32 bg-white transition-all hover:shadow-md`}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <Image
          src={image.preview}
          width={200}
          height={200}
          alt={`Uploaded ${index}`}
          className="w-full h-32 object-contain rounded-md"
        />
        <Button
          variant="destructive"
          size="icon"
          onClick={() => removeImage(index)}
          className="absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </Button>
        <div className="absolute bottom-1 left-1 bg-white rounded-full px-2 py-1 text-xs">
          {index + 1}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Package className="text-blue-600" />
          New Product
        </h1>
        <Button 
          type="submit"
          form="product-form"
          variant="default" 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Save Product
        </Button>
      </div>

      <Form {...form}>
        <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Product Info */}
            <Card className="lg:col-span-2">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Layout className="w-4 h-4 text-gray-500" />
                          Product Name
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter product name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-500" />
                          Brand
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter brand name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <ChartBarStacked className="w-4 h-4 text-gray-500" />
                            Category
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="electronics">Electronics</SelectItem>
                              <SelectItem value="clothing">Clothing</SelectItem>
                              <SelectItem value="accessories">Accessories</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <ChartBarStacked className="w-4 h-4 text-gray-500" />
                            Sub Category
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select sub-category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="smartphone">Smartphone</SelectItem>
                              <SelectItem value="laptop">Laptop</SelectItem>
                              <SelectItem value="kurta">Kurta</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lowLevelCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <ChartBarStacked className="w-4 h-4 text-gray-500" />
                            Low Level Category
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="kurta-pajama">Kurta Pajama</SelectItem>
                              <SelectItem value="innerwear">Innerwear</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          Gender
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="trans">Trans</SelectItem>
                            <SelectItem value="unisex">Unisex</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="actualPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            Actual Price
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="text" 
                              {...field} 
                              onChange={e => field.onChange(e.target.value)}
                              placeholder="0.00" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sellingPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            Selling Price
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="text" 
                              {...field} 
                              onChange={e => field.onChange(e.target.value)}
                              placeholder="0.00" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Tags className="w-4 h-4 text-gray-500" />
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Enter product description" 
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image Upload Section */}
            <Card className="lg:col-span-1">
              <CardContent className="pt-6">
                <FormLabel className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-4 h-4 text-gray-500" />
                  Product Images
                </FormLabel>
                <div className="mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    {images.map((image, index) => (
                      <ImageItem key={index} image={image} index={index} />
                    ))}
                  </div>
                </div>
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer mt-4"
                >
                  <input {...getInputProps()} />
                  <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Drag and drop your images here
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    or click to select files
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;