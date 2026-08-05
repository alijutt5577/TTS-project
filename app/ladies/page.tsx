'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, ShoppingBag } from 'lucide-react';

export default function LadiesPage() {
  const productContext = useProducts() as any;
  const products = productContext?.products || [];
  const loadMoreProducts = productContext?.loadMoreProducts;
  const hasMore = productContext?.hasMore;
  const loadingMore = productContext?.loadingMore;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Filter to support multi-category strings containing 'ladies', 'lawn', or 'stitched'
  const ladiesProducts = products.filter((p: any) => {
    const cat = p.category ? p.category.toLowerCase() : '';
    return (
      cat.includes('ladies') ||
      cat.includes('lawn') ||
      cat.includes('stitched')
    );
  });

  return (
    <div className="bg-[#FDFBF7] text-[#2C2623] min-h-screen pt-32 pb-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-amber-900 font-semibold mb-2">
            Luxury Unstitched & Pret
          </p>
          <h1 className="font-serif text-3xl md:text-5xl tracking-widest uppercase">
            Ladies Collection
          </h1>
          <div className="h-[1px] w-12 bg-amber-900/40 mx-auto mt-4"></div>
        </div>

        {ladiesProducts.length === 0 ? (
          <p className="text-center text-xs text-stone-500 tracking-widest uppercase py-12">
            No Ladies Products Available
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {ladiesProducts.map((product: any) => {
                const isWishlisted = isInWishlist(product.id);
                const isSoldOut = product.units === 0 || product.units === '0';
                const productImage = product.image || (product.images && product.images[0]) || '/poster1.jpg';

                return (
                  <div key={product.id} className="group relative">
                    <Link href={`/product/${product.id}`} className="block">
                      <div className="relative h-[380px] w-full rounded-xl overflow-hidden bg-stone-200 mb-4 shadow-sm">
                        <Image
                          src={productImage}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className={`object-cover object-center w-full h-full group-hover:scale-105 transition duration-500 ${
                            isSoldOut ? 'opacity-80' : ''
                          }`}
                        />

                        {/* SOLD OUT BADGE */}
                        {isSoldOut && (
                          <span className="absolute top-3 left-3 bg-red-800 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-md z-10">
                            Sold Out
                          </span>
                        )}

                        {/* Wishlist Button */}
                        <button
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className="absolute top-3 right-3 p-2.5 bg-white/90 hover:bg-white backdrop-blur-md rounded-full text-stone-800 transition z-10 shadow-md cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600 text-red-600' : 'text-stone-800'}`} />
                        </button>

                        {/* Add to Cart Button */}
                        {!isSoldOut && (
                          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 z-10">
                            <button
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart({
                                  ...product,
                                  image: productImage,
                                  quantity: 1,
                                });
                              }}
                              className="w-full bg-white hover:bg-stone-100 text-stone-900 text-[11px] font-medium tracking-[0.15em] uppercase py-3 rounded-lg shadow-lg flex items-center justify-center space-x-2 transition cursor-pointer"
                            >
                              <ShoppingBag className="w-4 h-4 text-stone-900" />
                              <span>Add To Cart</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="text-[10px] font-bold text-amber-900 uppercase tracking-widest pl-1">
                        {product.category}
                      </p>
                      <h3 className="font-serif text-sm font-semibold text-stone-900 mt-1 pl-1 group-hover:text-amber-800 transition line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs font-bold text-stone-800 mt-1 pl-1">{product.price}</p>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* LOAD MORE BUTTON */}
            {hasMore && loadMoreProducts && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMoreProducts}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-amber-900 text-white font-semibold uppercase tracking-widest text-xs rounded-full hover:bg-stone-900 transition disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {loadingMore ? 'Loading...' : 'Load More Products'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}