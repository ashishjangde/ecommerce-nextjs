import React from 'react';

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export default function Page({ params: { productId } }: ProductPageProps) {
  return (
    <h1>Product Details for {productId}</h1>
  );
}
