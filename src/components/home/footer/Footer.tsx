import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Divider } from '@nextui-org/divider';
import { Truck, CreditCard, RefreshCw } from 'lucide-react';

const Footer = () => {
  return (
    <div className="bg-white text-gray-800 py-6 ">

      <Divider orientation="horizontal" />

      {/* First Section: Delivery, Payment, Return */}
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center my-8 space-y-8 md:space-y-0 md:space-x-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bbg-white shadow-lg mb-4">
            <Truck className="text-blue-800 text-5xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">Free Delivery</h3>
          <p className="text-gray-500">
            Fast and free delivery straight to your doorstep!
          </p>
        </div>

        <Divider orientation="vertical" className="hidden md:block h-24 bg-gray-500" />

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-lg mb-4">
            <CreditCard className="text-blue-800 text-5xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">Online Payment</h3>
          <p className="text-gray-500">
            Safe, secure, and hassle-free online payment options.
          </p>
        </div>

        <Divider orientation="vertical" className="hidden md:block h-24 bg-gray-500" />

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-lg mb-4">
            <RefreshCw className="text-blue-800 text-5xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">Easy Return</h3>
          <p className="text-gray-500">
            Hassle-free returns for your peace of mind.
          </p>
        </div>
      </div>

      <Divider orientation="horizontal" />

      {/* Second Section: Footer Links */}
      <div className="container mx-auto mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 text-center md:text-left">
        <h1 className='text-[3rem] font-semibold text-gray-800 dark:text-gray-100'>NextStore</h1>
          <p>
          Your trusted partner in shopping <br />
          Shop 009A, Level 4, Block A, <br />
          Demo Park, XYZ <br />
          +91-913-555-xxxx <br />
          nextstore@gmail.com
          </p>
        </div>
        <div className="space-y-4 text-center md:text-left">
          <h4 className="text-lg font-semibold">My Account</h4>
          <ul className="space-y-2">
            <li><Link href="/profile">My Profile</Link></li>
            <li><Link href="/orders">My Order History</Link></li>
            <li><Link href="/order-tracking">Order Tracking</Link></li>
            <li><Link href="/cart">Shopping Cart</Link></li>
          </ul>
        </div>
        <div className="space-y-4 text-center md:text-left">
          <h4 className="text-lg font-semibold">Shop Departments</h4>
          <ul className="space-y-2">
            <li><Link href="/shop/computers-accessories">Computers & Accessories</Link></li>
            <li><Link href="/shop/smartphones-tablets">Smartphones & Tablets</Link></li>
            <li><Link href="/shop/tv-video-audio">TV, Video & Audio</Link></li>
            <li><Link href="/shop/cameras-photo-video">Cameras, Photo & Video</Link></li>
          </ul>
        </div>
        <div className="space-y-4 text-center md:text-left">
          <h4 className="text-lg font-semibold">Download App</h4>
          <div className="flex flex-col space-y-4 items-center md:items-start md:justify-center">
            <Link href="https://apps.apple.com">
              <Image src="/footer/apple.svg" alt="Download from Apple App Store" width={150} height={50} />
            </Link>
            <Link href="https://play.google.com">
              <Image src="/footer/google.png" alt="Get It On Google Play Store" width={150} height={50} />
            </Link>
          </div>
        </div>


      </div>

      {/* Third Section: Payment Methods */}
      <div className="container mx-auto mt-12 flex justify-center items-center space-x-4">
        <Image src="/footer/paypal.svg" alt="PayPal" width={50} height={50} />
        <Image src="/footer/visa.svg" alt="Visa" width={50} height={50} />
        <Image src="/footer/mastercard.svg" alt="Mastercard" width={50} height={50} />
        <Image src="/footer/amex.svg" alt="American Express" width={50} height={50} />
        <Image src="/footer/discover.svg" alt="Discover" width={50} height={50} />
      </div>
      <Divider />

      {/* Fourth Section: Copyright */}
      <div className="container mx-auto mt-4 text-center text-gray-900">
        © 2024 NextStore. All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;
