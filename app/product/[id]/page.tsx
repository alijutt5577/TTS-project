'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProducts } from '@/app/context/ProductContext';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, Send } from 'lucide-react';
import CheckoutModal from '@/app/components/CheckoutModal';

export default function ProductDetailPage() {
  const params = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const productId = params?.id as string;
  // Get product dynamically from global products context
  const product: any = products.find((p) => p.id === productId) || products[0];

  const [quantity, setQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Multiple Gallery Images Handling
  const productImages: string[] = product?.images && Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product?.image || '/poster1.jpg'];
    
  const [selectedImage, setSelectedImage] = useState<string>(productImages[0] || product?.image);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center pt-28">
        <p className="text-stone-600 text-sm">Product not found.</p>
      </div>
    );
  }

  // Stock Unit Check
  const stockUnits = product.units !== undefined ? product.units : 10;
  const isSoldOut = stockUnits <= 0;

  // Dynamic Price Calculation
  const numericPrice = parseInt(product.price.replace(/[^0-9]/g, ''), 10) || 0;
  const totalPrice = numericPrice * quantity;
  const formattedTotalPrice = `PKR ${totalPrice.toLocaleString()}`;

  const handleAdd = () => {
    if (isSoldOut) return;
    addToCart({
      ...product,
      quantity: quantity,
    });
  };

  return (
    <div className="bg-[#FDFBF7] text-[#2C2623] min-h-screen pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-stone-500 mb-8 uppercase tracking-widest flex items-center space-x-2">
          <Link href="/" className="hover:text-stone-900 transition">Home</Link>
          <span>/</span>
          <Link href="/ladies" className="hover:text-stone-900 transition">{product.category}</Link>
          <span>/</span>
          <span className="text-stone-900 font-semibold">{product.name}</span>
        </nav>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          
          {/* Left Column: Product Image & Gallery Thumbnails */}
          <div className="space-y-4">
            <div className="relative h-[480px] md:h-[620px] w-full rounded-xl overflow-hidden shadow-md bg-stone-200">
              <Image
                src={selectedImage || product.image}
                alt={product.name}
                fill
                priority
                className="object-cover object-top"
              />
              {/* SOLD OUT BADGE OVERLAY */}
              {isSoldOut && (
                <div className="absolute top-4 left-4 bg-red-700 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow">
                  Sold Out
                </div>
              )}
            </div>

            {/* MULTIPLE GALLERY THUMBNAILS */}
            {productImages.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pt-2 pb-1">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                      selectedImage === img ? 'border-amber-900 scale-105' : 'border-stone-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Purchase Actions */}
          <div className="space-y-6">
            
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-amber-900 font-semibold mb-1">
                {product.category}
              </p>
              <h1 className="font-serif text-2xl md:text-4xl text-stone-900 tracking-wide">
                {product.name}
              </h1>
              
              {/* Unit Price & Calculated Total Badge */}
              <div className="flex items-center space-x-4 mt-3">
                <p className="text-xl md:text-2xl font-bold text-stone-900">
                  {product.price}
                </p>
                {quantity > 1 && !isSoldOut && (
                  <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded">
                    Total: {formattedTotalPrice}
                  </span>
                )}
                {isSoldOut && (
                  <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded uppercase">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            <hr className="border-stone-200" />

            {/* Unstitched Badge & Description */}
            <div className="space-y-2">
              <span className="inline-block bg-stone-200 text-stone-800 text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded-sm">
                100% Premium Quality
              </span>
              <p className="text-xs md:text-sm text-stone-600 leading-relaxed pt-1">
                Crafted from premium quality fabric featuring intricate details and elegance. Perfect for festive occasions, gatherings, and everyday luxury wear.
              </p>
            </div>

            {/* Quantity Selector */}
            {!isSoldOut && (
              <div className="space-y-2">
                <span className="text-xs tracking-wider uppercase font-medium block">Quantity:</span>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-stone-300 rounded bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-stone-600 hover:text-stone-900 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="px-4 text-xs font-semibold text-stone-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(stockUnits, q + 1))}
                      className="px-3 py-2 text-stone-600 hover:text-stone-900 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    ({stockUnits} units available)
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleAdd}
                  disabled={isSoldOut}
                  className={`flex-1 text-white text-xs uppercase tracking-widest py-4 rounded-sm transition duration-300 shadow-md flex items-center justify-center space-x-2 ${
                    isSoldOut 
                      ? 'bg-stone-400 cursor-not-allowed' 
                      : 'bg-[#3D2B1F] hover:bg-[#2A1D14] cursor-pointer'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isSoldOut ? 'Sold Out' : 'Add To Cart'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label="Wishlist"
                  className={`p-3.5 border rounded-sm transition bg-white ${
                    isWishlisted 
                      ? 'border-red-600 text-red-600 bg-red-50' 
                      : 'border-stone-300 hover:border-stone-900 text-stone-700'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Direct Checkout Button */}
              <button
                onClick={() => !isSoldOut && setIsCheckoutOpen(true)}
                disabled={isSoldOut}
                className={`w-full text-white text-xs uppercase tracking-widest py-3.5 rounded-sm transition duration-300 shadow flex items-center justify-center space-x-2 font-semibold ${
                  isSoldOut 
                    ? 'bg-stone-400 cursor-not-allowed' 
                    : 'bg-[#25D366] hover:bg-[#20bd5a] cursor-pointer'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSoldOut ? 'Item Sold Out' : `Proceed To Checkout (${formattedTotalPrice})`}
                </span>
              </button>
            </div>

            {/* Service Highlights */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-stone-200 text-center text-[10px] md:text-xs text-stone-600">
              <div className="flex flex-col items-center space-y-1">
                <Truck className="w-5 h-5 text-stone-700" />
                <span>Fast Nationwide Shipping</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-stone-700" />
                <span>100% Authentic Fabric</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <RefreshCw className="w-5 h-5 text-stone-700" />
                <span>Easy 7-Day Exchange</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Checkout Form Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        directProduct={{
          name: product.name,
          price: formattedTotalPrice,
          quantity: quantity,
        }}
      />
    </div>
  );
}