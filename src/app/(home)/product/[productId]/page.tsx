'use client';
import { useParams } from 'next/navigation';
import React from 'react';

export default function ProductPage() {
    const { productId } = useParams<{ productId: string }>();
  
    return (
        <div>result for {productId}</div>
    );
}
