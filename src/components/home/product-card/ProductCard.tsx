'use client'
import React, { useState } from 'react';
import { ShoppingCart, Heart, Star, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link from next
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string;
  productName: string;
  productImage: string;
  productAlt: string;
  productPrice: number;
  productActualPrice: number;
  productDiscount: number;
  productRating: number;
  productLink: string;
  addToCart: () => void;
  addToWishlist: () => void;
}

export default function ProductCard({ items }: { items: ProductCardProps[] }) {
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);

  const toggleLike = (id: string) => {
    if (likedItems.includes(id)) {
      setLikedItems(likedItems.filter(itemId => itemId !== id));
    } else {
      setLikedItems([...likedItems, id]);
    }
  };

  const toggleCart = (id: string) => {
    if (cartItems.includes(id)) {
      setCartItems(cartItems.filter(itemId => itemId !== id));
    } else {
      setCartItems([...cartItems, id]);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 p-2 sm:p-4">
      {items.map((item, index) => (
        <div key={item.id} className="w-full">
          <Card className="h-[380px] sm:h-[420px] flex flex-col bg-white shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="relative p-0 h-52 sm:h-60">
              <div className="relative w-full h-full">
                <Link href={item.productLink} passHref>
                  <div className="absolute top-0 left-0 w-full h-full">
                  <Image
                  src={item.productImage}
                  alt={item.productAlt}
                  width={240} 
                  height={240} 
                  className="object-contain p-4 w-full h-full" 
                  priority={index < 2}
                />
                  </div>
                </Link>
                <div className="absolute top-2 left-2 flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium text-sm text-black">{item.productRating}</span>
                </div>
                <div
                  className="absolute top-2 right-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(item.id);
                  }}
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Heart
                      className={`w-6 h-6 ${likedItems.includes(item.id) ? 'fill-red-500' : 'fill-none'} stroke-red-500`}
                    />
                  </motion.div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col flex-grow px-4 pt-1">
              {/* Link wrapping the product name */}
              <Link href={item.productLink} passHref>
                <CardDescription className="text-gray-900 font-medium text-base sm:text-lg line-clamp-2 min-h-[48px]  cursor-pointer">
                  {item.productName}
                </CardDescription>
              </Link>

              <div className="mt-auto pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 line-through text-sm">₹{item.productActualPrice}</span>
                  {item.productDiscount > 0 && (
                    <div className="bg-green-900 text-white px-2 py-0.5 rounded text-xs font-medium">
                      {item.productDiscount}% OFF
                    </div>
                  )}
                </div>
                <div className="text-green-600 text-xl font-bold mt-1">
                  ₹{item.productPrice}
                </div>
              </div>
            </CardContent>

            <CardFooter className="px-4 pb-4 pt-0">
              <button
                className="w-full  sm:w-60 h-12 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-1 transition-colors"
                onClick={() => toggleCart(item.id)}
              >
                {cartItems.includes(item.id) ? (
                  <>
                    <Check className="w-6 h-6" />
                    <span className="text-xs sm:text-sm md:text-base truncate whitespace-nowrap w-full text-center">Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    <span className="text-xs sm:text-sm md:text-base truncate whitespace-nowrap w-full text-center">Add to Cart</span>
                  </>
                )}
              </button>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
}
