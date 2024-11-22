import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload } from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Zod Schema for Category
const categorySchema = z.object({
  grandparentName: z.string().min(2, { message: "Grandparent name must be at least 2 characters" }),
  grandparentImage: z.string().optional(),
  grandparentFeatured: z.boolean().optional(),
  
  parentName: z.string().min(2, { message: "Parent name must be at least 2 characters" }),
  parentImage: z.string().optional(),
  parentFeatured: z.boolean().optional(),
  
  childName: z.string().min(2, { message: "Child name must be at least 2 characters" }),
  childImage: z.string().optional()
});

const CategoryForm = () => {
 
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      grandparentName: '',
      grandparentImage: '',
      grandparentFeatured: false,
      parentName: '',
      parentImage: '',
      parentFeatured: false,
      childName: '',
      childImage: '',
    }
  });

  // Image upload handler
  const handleImageUpload = (field: keyof z.infer<typeof categorySchema>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue(field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: z.infer<typeof categorySchema>) => {
    console.log('Category Data:', data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Grandparent Category */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-4">Grandparent Category</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="grandparentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Grandparent Category Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Image</FormLabel>
              <div className="flex items-center space-x-2">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload('grandparentImage')}
                  className="hidden" 
                  id="grandparent-image" 
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => document.getElementById('grandparent-image')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
                {form.watch('grandparentImage') && (
                  <img 
                    src={form.watch('grandparentImage')} 
                    alt="Preview" 
                    className="h-10 w-10 object-cover" 
                  />
                )}
              </div>
            </FormItem>

            <FormField
              control={form.control}
              name="grandparentFeatured"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Is Featured</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Parent Category */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-4">Parent Category</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="parentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Parent Category Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Image</FormLabel>
              <div className="flex items-center space-x-2">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload('parentImage')}
                  className="hidden" 
                  id="parent-image" 
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => document.getElementById('parent-image')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
                {form.watch('parentImage') && (
                  <img 
                    src={form.watch('parentImage')} 
                    alt="Preview" 
                    className="h-10 w-10 object-cover" 
                  />
                )}
              </div>
            </FormItem>

            <FormField
              control={form.control}
              name="parentFeatured"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Is Featured</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Child Category */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-4">Child Category</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="childName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Child Category Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Image</FormLabel>
              <div className="flex items-center space-x-2">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload('childImage')}
                  className="hidden" 
                  id="child-image" 
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => document.getElementById('child-image')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
                {form.watch('childImage') && (
                  <img 
                    src={form.watch('childImage')} 
                    alt="Preview" 
                    className="h-10 w-10 object-cover" 
                  />
                )}
              </div>
            </FormItem>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Save Categories
        </Button>
      </form>
    </Form>
  );
};

export default CategoryForm;