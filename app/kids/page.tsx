'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '../context/ProductContext';

export default function KidsPage() {
  const { products } = useProducts();

  const kidsProducts = products.filter((p: any) => {
    const cat = p.category ? p.category.toLowerCase() : '';
    return cat.includes('kids');
  });

  return (
    <div className="bg-[#FDFBF7] text-[#2C2623] min-h-screen pt-32 pb-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-amber-900 font-semibold mb-2">
            Festive & Casual Wear
          </p>
          <h1 className="font-serif text-3xl md:text-5xl tracking-widest uppercase">
            Kids Collection
          </h1>
          <div className="h-[1px] w-12 bg-amber-900/40 mx-auto mt-4"></div>
        </div>

        {kidsProducts.length === 0 ? (
          <p className="text-center text-xs text-stone-500 tracking-widest uppercase py-12">
            No Kids Products Available
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {kidsProducts.map((product: any) => {
              const isSoldOut = product.units === 0 || product.units === '0';
              const productImage = product.image || (product.images && product.images[0]) || '/poster1.jpg';

              return (
                <Link key={product.id} href={`/product/${product.id}`} className="group block">
                  <div className="relative h-[380px] w-full rounded-xl overflow-hidden bg-stone-200 mb-4 shadow-sm">
                    <Image
                      src={productImage}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className={`object-cover object-top group-hover:scale-105 transition duration-500 ${
                        isSoldOut ? 'opacity-80' : ''
                      }`}
                    />

                    {/* SOLD OUT BADGE */}
                    {isSoldOut && (
                      <span className="absolute top-3 left-3 bg-red-800 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-md z-10">
                        Sold Out
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] font-bold text-amber-900 uppercase tracking-widest">
                    {product.category}
                  </p>
                  <h3 className="font-serif text-sm font-semibold text-stone-900 mt-1 group-hover:text-amber-800 transition line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs font-bold text-stone-800 mt-1">{product.price}</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}