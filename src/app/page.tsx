'use client';
import Footer from "@/components/home/footer/Footer";
import Navbar from "@/components/home/navbar/Navbar";
import Carousel, { CarouselItem } from "@/components/home/carousel/Carousel";
import ShopByCategory from "@/components/home/shopbycategory/ShopByCategory";
import { ShopByCategoryProps } from "@/components/home/shopbycategory/ShopByCategory";
import ProductCard from "@/components/home/product-card/ProductCard";

const carouselItems: CarouselItem[] = [
  { image: '/carousel/pic1.jpg', link: '/product/1', alt: 'Product 1' },
  { image: '/carousel/pic2.jpg', link: '/product/2', alt: 'Product 2' },
  { image: '/carousel/pic3.jpg', link: '/product/3', alt: 'Product 3' },
  { image: '/carousel/pic4.jpg', link: '/product/4', alt: 'Product 4' },
  { image: '/carousel/pic5.jpg', link: '/product/5', alt: 'Product 5' },
];

const shopByCategoryItems: ShopByCategoryProps[] = [
  { id: 'Clothing', image: '/shopCategory/cloth.png', alt: 'Clothing', link: '/product/1', name: 'Clothing' },
  {id: "SmartPhones", image: "/shopCategory/smartphone.png", alt: "SmartPhones", link: "/product/1", name: "SmartPhones"},
  { id: 'Shoes', image: '/shopCategory/shoes.png', alt: 'Shoes', link: '/product/2', name: 'Shoes' },
  { id: 'Accessories', image: '/shopCategory/headphone.jpg', alt: 'Accessories', link: '/product/3', name: 'Accessories' },
  { id: 'Jewelry', image: '/shopCategory/jwellery.jpg', alt: 'Jewellery', link: '/product/4', name: 'Jewellery' },
  { id: 'Watches', image: '/shopCategory/watches.jpg', alt: 'Watches', link: '/product/5', name: 'Watches' },
  {id:'Lingerie', image: '/shopCategory/bikini.jpg', alt: 'lingerie', link: '/product/6', name: 'lingerie'},
];

const products = [
  {
    id: "product-1",
    productName: "Neo Gents IV Analog Watch - For Men 1802SL02",
    productImage: "/shopCategory/watches.jpg",
    productAlt: "Product 1 Image",
    productPrice: 19.99,
    productActualPrice: 24.99,
    productDiscount: 20,
    productRating: 4.5,
    productLink: "/product/1",
    addToCart: () =>    (""),
    addToWishlist: () =>    (""),
  },
  {
    id: "product-2",
    productName: "Boult W20 with Zen ENC Mic, 35H Battery Life, Low Latency Gaming, Made in India, 5.3v Bluetooth  (Glacier Blue, True Wireless)",
    productImage: "/shopCategory/headphone.jpg",
    productAlt: "Product 2 Image",
    productPrice: 14.99,
    productActualPrice: 19.99,
    productDiscount: 25,
    productRating: 4.2,
    productLink: "/product/2",
    addToCart: () =>    (""),
    addToWishlist: () =>    (""),
  },
  {
    id: "product-3",
    productName: "Acer Nitro 5 Gaming Laptop",
    productImage: "/shopCategory/shoes.png",
    productAlt: "Product 3 Image",
    productPrice: 899.99,
    productActualPrice: 999.99,
    productDiscount: 10,
    productRating: 4.7,
    productLink: "/product/3",
    addToCart: () =>    (""),
    addToWishlist: () =>    (""),
  },
  {
    id: "product-4",
    productName: "Canon EOS 200D DSLR Camera",
    productImage: "/shopCategory/bikini.jpg",
    productAlt: "Product 4 Image",
    productPrice: 499.99,
    productActualPrice: 599.99,
    productDiscount: 17,
    productRating: 4.6,
    productLink: "/product/4",
    addToCart: () => (""),
    addToWishlist: () =>    (""),
  },
  {
    id: "product-5",
    productName: "Amazon Echo Dot (4th Gen)",
    productImage: "/shopCategory/jwellery.jpg",
    productAlt: "Product 5 Image",
    productPrice: 29.99,
    productActualPrice: 39.99,
    productDiscount: 25,
    productRating: 4.3,
    productLink: "/product/5",
    addToCart: () =>    (""),
    addToWishlist:() =>    (""),
  },
  {
    id: "product-6",
    productName: "Samsung Galaxy Buds Live",
    productImage: "/shopCategory/smartphone.png",
    productAlt: "Product 6 Image",
    productPrice: 99.99,
    productActualPrice: 129.99,
    productDiscount: 23,
    productRating: 4.4,
    productLink: "/product/6",
    addToCart:() =>    (""),
    addToWishlist: () =>    (""),
  },
];


export default function Home() {
  return (
    <div className="w-full"> 
      <Navbar />
      <Carousel items={carouselItems} />
      <ShopByCategory items={shopByCategoryItems} />
      <ProductCard items={products} />

      <Footer />
    </div>
  );
}
