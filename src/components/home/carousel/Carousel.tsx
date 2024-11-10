'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import 'swiper/swiper-bundle.css';

export interface CarouselItem {
  image: string;
  link: string;
  alt?: string;
}

const Carousel = ({ items }: { items: CarouselItem[] }) => {
  return (
    <div className="w-100vw h-full mt-[75px] px-4 ">
      <div className="mx-auto">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-full"
        >
          {items.map((item, index) => (
            <SwiperSlide key={index}>
           <Link href={item.link} passHref>
            <div className="relative w-full h-[200px] md:h-[390px] cursor-pointer rounded-lg overflow-hidden shadow-lg">
              <Image
                src={item.image}
                alt={item.alt || `Slide ${index + 1}`}
                fill
                style={{ objectFit: 'fill' }}  
                className="rounded-lg"
                priority={index === 0}  
              />
            </div>
          </Link>

            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Carousel;
