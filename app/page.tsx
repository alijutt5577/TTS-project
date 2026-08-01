'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from './context/ProductContext';
import { useCart } from './context/CartContext';
import { useWishlist } from './context/WishlistContext';
import { useBanners } from './context/BannerContext';
import { Heart, ShoppingBag, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  const productContext = useProducts() as any;
  const products = productContext?.products || [];

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { heroBanners, mobileHeroBanners, poster1, poster2, poster3 } = useBanners();

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // AUTO-SLIDE HERO BANNERS
  useEffect(() => {
    const activeBannersLength = window.innerWidth < 768 ? mobileHeroBanners.length : heroBanners.length;
    if (activeBannersLength <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % activeBannersLength);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroBanners, mobileHeroBanners]);

  const handlePrevBanner = () => {
    const activeLength = window.innerWidth < 768 ? mobileHeroBanners.length : heroBanners.length;
    if (activeLength === 0) return;
    setCurrentBannerIndex((prevIndex) => (prevIndex === 0 ? activeLength - 1 : prevIndex - 1));
  };

  const handleNextBanner = () => {
    const activeLength = window.innerWidth < 768 ? mobileHeroBanners.length : heroBanners.length;
    if (activeLength === 0) return;
    setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % activeLength);
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-[#FDFBF7]" />;
  }

  const bestSellerProducts = products.filter((product: any) => {
    const cat = product.category ? product.category.toLowerCase() : '';
    return cat.includes('best sellers');
  });

  const hasHeroBanners = heroBanners.length > 0 || mobileHeroBanners.length > 0;

  return (
    <div className="bg-[#FDFBF7] text-[#2C2623] min-h-screen pt-0 font-sans pb-20 md:pb-0">
      
      {/* 1. HERO SLIDER BANNER */}
      {hasHeroBanners && (
        <section className="relative w-full pt-[95px] md:pt-[110px] bg-[#EFECE6] flex items-center justify-center overflow-hidden group">
          
          {/* MOBILE BANNER SLIDER */}
          {mobileHeroBanners.length > 0 && (
            <div className="relative w-full aspect-[4/5] sm:aspect-[1/1] md:hidden overflow-hidden bg-stone-100 flex items-center justify-center">
              <div 
                className="flex h-full w-full transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
              >
                {mobileHeroBanners.map((banner, index) => (
                  <div key={index} className="relative w-full h-full shrink-0">
                    <Image
                      src={banner}
                      alt={`Mobile Banner ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes="100vw"
                      className="object-cover object-center w-full h-full"
                    />
                  </div>
                ))}
              </div>

              {mobileHeroBanners.length > 1 && (
                <>
                  <button
                    onClick={handlePrevBanner}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition shadow-lg cursor-pointer z-20"
                    aria-label="Previous Banner"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextBanner}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition shadow-lg cursor-pointer z-20"
                    aria-label="Next Banner"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20">
                    {mobileHeroBanners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentBannerIndex(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          currentBannerIndex === idx ? 'w-8 bg-amber-900' : 'w-2 bg-white/70 hover:bg-white'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* DESKTOP BANNER SLIDER */}
          {heroBanners.length > 0 && (
            <div className="hidden md:relative md:flex w-full md:h-[calc(100vh-110px)] overflow-hidden bg-stone-100 items-center justify-center">
              <div 
                className="flex h-full w-full transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
              >
                {heroBanners.map((banner, index) => (
                  <div key={index} className="relative w-full h-full shrink-0">
                    <Image
                      src={banner}
                      alt={`Desktop Banner ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes="100vw"
                      className="object-cover object-center w-full h-full"
                    />
                  </div>
                ))}
              </div>

              {heroBanners.length > 1 && (
                <>
                  <button
                    onClick={handlePrevBanner}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-md transition shadow-lg cursor-pointer z-20"
                    aria-label="Previous Banner"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextBanner}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-md transition shadow-lg cursor-pointer z-20"
                    aria-label="Next Banner"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20">
                    {heroBanners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentBannerIndex(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          currentBannerIndex === idx ? 'w-8 bg-amber-900' : 'w-2 bg-white/70 hover:bg-white'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

        </section>
      )}

      {/* LUXURY DIVIDER */}
      <div className="w-full py-8 flex items-center justify-center bg-[#FDFBF7]">
        <div className="flex items-center space-x-4 text-amber-900/60">
          <div className="h-[1px] w-16 sm:w-32 bg-amber-900/30"></div>
          <div className="flex items-center space-x-2">
            <span className="text-xs">✦</span>
            <Sparkles className="w-4 h-4" />
            <span className="text-xs">✦</span>
          </div>
          <div className="h-[1px] w-16 sm:w-32 bg-amber-900/30"></div>
        </div>
      </div>

      {/* 2. PROMO BANNERS / POSTERS (DYNAMIC FROM FIRESTORE) */}
      <section className="max-w-7xl mx-auto px-6 pt-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link href="/ladies" className="group relative h-[320px] rounded-2xl overflow-hidden shadow-md block bg-stone-200">
            <Image
              src={poster1 || '/poster1.jpg'}
              alt="Ladies Collection"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center w-full h-full group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition p-6 flex flex-col justify-end text-white z-10">
              <span className="text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:text-amber-300">
                EXPLORE LADIES →
              </span>
            </div>
          </Link>

          <Link href="/kids" className="group relative h-[320px] rounded-2xl overflow-hidden shadow-md block bg-stone-200">
            <Image
              src={poster2 || '/poster2.jpg'}
              alt="Kids Festive Collection"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center w-full h-full group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition p-6 flex flex-col justify-end text-white z-10">
              <span className="text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:text-amber-300">
                EXPLORE KIDS →
              </span>
            </div>
          </Link>

          <Link href="/new-arrivals" className="group relative h-[320px] rounded-2xl overflow-hidden shadow-md block bg-stone-200">
            <Image
              src={poster3 || '/poster3.jpg'}
              alt="New Arrivals"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center w-full h-full group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition p-6 flex flex-col justify-end text-white z-10">
              <span className="text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:text-amber-300">
                EXPLORE NEW ARRIVALS →
              </span>
            </div>
          </Link>

        </div>
      </section>

      {/* 3. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12 pb-20">
        <div className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-amber-900 font-semibold mb-2">
            CURATED CLASSICS
          </p>
          <h2 className="font-serif text-3xl md:text-4xl tracking-[0.2em] uppercase text-stone-900">
            BEST SELLERS
          </h2>
          <div className="h-[1px] w-12 bg-amber-900/40 mx-auto mt-3"></div>
        </div>

        {bestSellerProducts.length === 0 ? (
          <p className="text-center text-xs text-stone-500 tracking-widest uppercase py-8">
            No Best Seller Products Selected Yet
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellerProducts.map((product: any) => {
              const isWishlisted = isInWishlist(product.id);
              const isSoldOut = product.units === 0 || product.units === '0';
              const productImage = product.image || (product.images && product.images[0]) || '/poster1.jpg';

              return (
                <div key={product.id} className="group relative">
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative h-[380px] w-full rounded-2xl overflow-hidden bg-stone-200 mb-4 shadow-sm">
                      <Image
                        src={productImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className={`object-cover object-center w-full h-full group-hover:scale-105 transition duration-500 ease-in-out ${
                          isSoldOut ? 'opacity-80' : ''
                        }`}
                      />

                      {isSoldOut && (
                        <span className="absolute top-3 left-3 bg-red-800 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-md z-10">
                          Sold Out
                        </span>
                      )}

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

                    <p className="text-[10px] uppercase tracking-widest text-amber-900 font-bold pl-1">
                      {product.category}
                    </p>
                    <h3 className="font-serif text-sm font-semibold text-stone-900 mt-0.5 pl-1 group-hover:text-amber-800 transition line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs font-bold text-stone-800 mt-1 pl-1">
                      {product.price}
                    </p>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}