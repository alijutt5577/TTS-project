'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from './context/ProductContext';
import { useCart } from './context/CartContext';
import { useWishlist } from './context/WishlistContext';
import { Heart, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  const productContext = useProducts() as any;
  const products = productContext?.products || [];

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Dynamic Banners State (Supports Multiple Hero Banners)
  const [heroBanners, setHeroBanners] = useState<string[]>(['/herobanners.jpg']);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const [poster1, setPoster1] = useState('/poster1.jpg');
  const [poster2, setPoster2] = useState('/poster2.jpg');
  const [poster3, setPoster3] = useState('/poster3.jpg');

  useEffect(() => {
    setIsMounted(true);

    const loadBanners = () => {
      const savedHeroBanners = localStorage.getItem('tts_hero_banners');
      if (savedHeroBanners) {
        try { setHeroBanners(JSON.parse(savedHeroBanners)); } catch (e) { setHeroBanners(['/herobanners.jpg']); }
      } else {
        const single = localStorage.getItem('tts_hero_banner');
        if (single) setHeroBanners([single]);
      }

      const p1 = localStorage.getItem('tts_poster1');
      if (p1) setPoster1(p1);
      const p2 = localStorage.getItem('tts_poster2');
      if (p2) setPoster2(p2);
      const p3 = localStorage.getItem('tts_poster3');
      if (p3) setPoster3(p3);
    };

    loadBanners();
    window.addEventListener('storage', loadBanners);
    return () => window.removeEventListener('storage', loadBanners);
  }, []);

  // AUTO-SLIDE HERO BANNERS
  useEffect(() => {
    if (heroBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % heroBanners.length);
    }, 4000); // 4 Seconds per slide

    return () => clearInterval(interval);
  }, [heroBanners]);

  const handlePrevBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex === 0 ? heroBanners.length - 1 : prevIndex - 1));
  };

  const handleNextBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % heroBanners.length);
  };

  // Hydration Safety Return
  if (!isMounted) {
    return <div className="min-h-screen bg-[#FDFBF7]" />;
  }

  const bestSellerProducts = products.filter((product: any) => {
    const cat = product.category ? product.category.toLowerCase() : '';
    return cat.includes('best sellers');
  });

  return (
    <div className="bg-[#FDFBF7] text-[#2C2623] min-h-screen pt-0 font-sans">
      
      {/* 1. HERO SLIDER BANNER */}
      <section className="relative w-full pt-[110px] bg-[#EFECE6] flex items-center justify-center overflow-hidden group">
        <div className="relative w-full h-[calc(100vh-110px)] overflow-hidden">
          
          {/* SLIDER CAROUSEL TRACK */}
          <div 
            className="flex h-full w-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
          >
            {heroBanners.map((banner, index) => (
              <div key={index} className="relative w-full h-full shrink-0">
                <Image
                  src={banner}
                  alt={`Banner ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-top"
                />
              </div>
            ))}
          </div>

          {/* PREV & NEXT BUTTONS (Visible if > 1 banner) */}
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

              {/* DOT INDICATORS */}
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
      </section>

      {/* 2. PROMO BANNERS */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link href="/ladies" className="group relative h-[320px] rounded-2xl overflow-hidden shadow-md block">
            <Image
              src={poster1}
              alt="Ladies Collection"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-top group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition p-6 flex flex-col justify-end text-white">
              <span className="text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:text-amber-300">
                EXPLORE LADIES →
              </span>
            </div>
          </Link>

          <Link href="/kids" className="group relative h-[320px] rounded-2xl overflow-hidden shadow-md block">
            <Image
              src={poster2}
              alt="Kids Festive Collection"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-top group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition p-6 flex flex-col justify-end text-white">
              <span className="text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:text-amber-300">
                EXPLORE KIDS →
              </span>
            </div>
          </Link>

          <Link href="/new-arrivals" className="group relative h-[320px] rounded-2xl overflow-hidden shadow-md block">
            <Image
              src={poster3}
              alt="New Arrivals"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-top group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition p-6 flex flex-col justify-end text-white">
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
                        className={`object-cover object-top group-hover:scale-105 transition duration-500 ease-in-out ${
                          isSoldOut ? 'opacity-80' : ''
                        }`}
                      />

                      {/* SOLD OUT BADGE */}
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
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-stone-700 hover:text-red-600 transition z-10 shadow-sm cursor-pointer"
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
                      </button>

                      {!isSoldOut && (
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
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
                            className="w-full bg-[#3D2B1F] hover:bg-[#2A1D14] text-white text-[10px] uppercase tracking-widest py-2.5 rounded shadow flex items-center justify-center space-x-2 transition cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
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