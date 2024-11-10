'use client';
import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Image from 'next/image';

export interface ShopByCategoryProps {
  id: string;
  image: string;
  alt: string;
  link: string;
  name: string;
}

export default function ShopByCategory({ items }: { items: ShopByCategoryProps[] }) {
  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <p className="text-gray-600 text-base md:text-lg px-4">
          Discover our curated collection of categories
        </p>
      </div>

      {/* Multi-item Swiper */}
      <div className="w-full">
        <Swiper
          spaceBetween={16}
          breakpoints={{
            320: { slidesPerView: 3, spaceBetween: 10 },
            480: { slidesPerView: 4, spaceBetween: 12 },
            768: { slidesPerView: 5, spaceBetween: 16 },
            1024: { slidesPerView: 6, spaceBetween: 20 }
          }}
          className="w-full"
        >
          {items.map((item: ShopByCategoryProps) => (
            <SwiperSlide key={item.id}>
              <Link href={item.link} className="block">
                <div className="text-center transform transition-all duration-300 ease-in-out hover:scale-105">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 mx-auto mb-2 md:mb-3 ring-2 ring-gray-100 hover:ring-4 hover:ring-blue-100 transition-all duration-300 shadow-md hover:shadow-lg">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      width={159}  
                      height={150} 
                      className="w-full h-full object-cover"  
                    />
                  </div>

                  {/* Category Name */}
                  <p className="text-xs sm:text-sm md:text-base font-medium text-gray-800 hover:text-blue-600 transition-colors duration-300 truncate px-1">
                    {item.name}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
