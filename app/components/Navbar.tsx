'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { User, Heart, ShoppingBag, X, Trash2, MessageCircle, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';
import CheckoutModal from './CheckoutModal';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [announcementText, setAnnouncementText] = useState('FREE SHIPPING NATIONWIDE ❖ SHOP NEW ARRIVALS');
  const [supportPhone, setSupportPhone] = useState('');

  // DYNAMIC LOGO STATES
  const [logoType, setLogoType] = useState<'text' | 'image'>('text');
  const [logoText, setLogoText] = useState('TTS');
  const [logoImage, setLogoImage] = useState('');
  const [logoSize, setLogoSize] = useState('55');

  const { cart, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  const { wishlist, removeFromWishlist, isWishlistOpen, setIsWishlistOpen } = useWishlist();
  
  // LIVE PRODUCTS FROM CONTEXT
  const productContext = useProducts() as any;
  const products = productContext?.products || [];

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Load Initial Settings & Logo From LocalStorage
    const loadSettings = () => {
      const savedAnn = localStorage.getItem('tts_announcement');
      if (savedAnn) setAnnouncementText(savedAnn);

      const savedPhone = localStorage.getItem('tts_support_phone');
      if (savedPhone !== null) setSupportPhone(savedPhone);

      const savedLogoType = localStorage.getItem('tts_logo_type');
      if (savedLogoType) setLogoType(savedLogoType as any);

      const savedLogoText = localStorage.getItem('tts_logo_text');
      if (savedLogoText) setLogoText(savedLogoText);

      const savedLogoImg = localStorage.getItem('tts_logo_image');
      if (savedLogoImg) setLogoImage(savedLogoImg);

      const savedLogoSize = localStorage.getItem('tts_logo_size');
      if (savedLogoSize) setLogoSize(savedLogoSize);
    };

    loadSettings();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', loadSettings);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', loadSettings);
    };
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalWishlistItems = wishlist.length;

  const filteredProducts = searchQuery.trim() === '' 
    ? [] 
    : products.filter((product: any) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const handleProductSelect = (id: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(`/product/${id}`);
  };

  const handleCartItemClick = (id: string) => {
    setIsCartOpen(false);
    router.push(`/product/${id}`);
  };

  // Format phone number safely for WhatsApp
  let formattedPhone = supportPhone.trim().replace(/[^0-9]/g, '');
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '92' + formattedPhone.slice(1);
  }

  const currentHeight = parseInt(logoSize) || 55;

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-stone-200/50' 
            : 'bg-transparent'
        }`}
      >
        <div className="bg-[#121212] text-white text-[11px] font-bold tracking-[0.2em] uppercase py-2.5 overflow-hidden relative select-none border-b border-stone-800">
          <div className="animate-marquee-smooth">
            <div className="flex items-center space-x-12 px-6 shrink-0">
              <span className="text-white">{announcementText}</span>
              <span className="text-white font-black">{announcementText}</span>
              <span className="text-white">{announcementText}</span>
            </div>
            <div className="flex items-center space-x-12 px-6 shrink-0">
              <span className="text-white">{announcementText}</span>
              <span className="text-white font-black">{announcementText}</span>
              <span className="text-white">{announcementText}</span>
            </div>
          </div>
        </div>

        <nav className="w-full font-sans py-3">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            
            {/* DYNAMIC BRAND LOGO WITH ADJUSTABLE SIZE */}
            <Link href="/" className="flex items-center shrink-0">
              {logoType === 'image' && logoImage ? (
                <div 
                  className="relative transition-all duration-300 flex items-center" 
                  style={{ 
                    height: `${currentHeight}px`, 
                    width: `${currentHeight * 3.5}px` 
                  }}
                >
                  <Image src={logoImage} alt="Brand Logo" fill className="object-contain object-left" priority />
                </div>
              ) : (
                <span className="font-serif text-2xl md:text-3xl font-normal tracking-[0.2em] text-stone-900 hover:text-amber-900 transition-all duration-300 italic uppercase">
                  {logoText || 'TTS'}
                </span>
              )}
            </Link>

            {/* FULL NAVIGATION LINKS */}
            <div className="hidden md:flex items-center space-x-8 text-xs tracking-widest font-medium uppercase text-stone-900">
              <Link href="/" className="hover:opacity-75 transition">Home</Link>
              <Link href="/ladies" className="hover:opacity-75 transition">Ladies</Link>
              <Link href="/kids" className="hover:opacity-75 transition">Kids</Link>
              <Link href="/new-arrivals" className="hover:opacity-75 transition">New Arrivals</Link>
              <Link href="#" className="hover:opacity-75 transition">Collections</Link>
              <Link href="#" className="hover:opacity-75 transition">About Us</Link>
              <Link href="/contact" className="hover:opacity-75 transition">Contact Us</Link>
            </div>

            <div className="flex items-center space-x-5 text-stone-900">
              <button 
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search" 
                className="hover:opacity-75 transition p-1 cursor-pointer"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>

              <Link href="/admin" aria-label="Admin Dashboard" className="hover:opacity-75 transition p-1" title="Go to Admin Panel">
                <User className="w-5 h-5 stroke-[1.5]" />
              </Link>

              <button 
                onClick={() => setIsWishlistOpen(true)}
                aria-label="Wishlist" 
                className="hover:opacity-75 transition p-1 relative cursor-pointer"
              >
                <Heart className="w-5 h-5 stroke-[1.5]" />
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-700 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalWishlistItems}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Cart"
                className="hover:opacity-75 transition p-1 relative cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* DYNAMIC FLOATING WHATSAPP BUTTON */}
      {formattedPhone !== '' && (
        <a
          href={`https://wa.me/${formattedPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:scale-110 hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
        </a>
      )}

      {/* SEARCH MODAL OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-[#FDFBF7] w-full max-w-2xl rounded-xl shadow-2xl p-6 relative text-stone-900 border border-stone-200">
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 p-1 cursor-pointer"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>

            <h3 className="font-serif text-lg tracking-widest uppercase mb-4 text-stone-800">
              Search Products
            </h3>

            <div className="relative flex items-center">
              <Search className="absolute left-3 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Type dress name (e.g., Lawn, Luxury, Kids)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-white border border-stone-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-stone-800 transition"
              />
            </div>

            {searchQuery.trim() !== '' && (
              <div className="mt-4 max-h-60 overflow-y-auto divide-y divide-stone-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product: any) => {
                    const productImage = product.image || (product.images && product.images[0]) || '/poster1.jpg';
                    return (
                      <div
                        key={product.id}
                        onClick={() => handleProductSelect(product.id)}
                        className="flex items-center space-x-4 py-3 px-2 hover:bg-stone-100 rounded-lg cursor-pointer transition"
                      >
                        <div className="relative w-12 h-14 rounded overflow-hidden bg-stone-200 shrink-0">
                          <Image
                            src={productImage}
                            alt={product.name}
                            fill
                            className="object-cover object-top"
                          />
                        </div>
                        <div>
                          <h4 className="font-serif text-xs md:text-sm text-stone-900 font-medium">
                            {product.name}
                          </h4>
                          <p className="text-[10px] uppercase text-stone-500">{product.category}</p>
                          <p className="text-xs font-semibold text-amber-900 mt-0.5">{product.price}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-stone-500 py-6 text-center">
                    No products found matching &quot;{searchQuery}&quot;
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* WISHLIST DRAWER */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isWishlistOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsWishlistOpen(false)}
      />

      <aside
        className={`fixed top-0 right-0 w-full max-w-md h-full bg-[#181818] text-white z-50 shadow-2xl transition-transform duration-300 ease-in-out transform ${
          isWishlistOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col justify-between p-6`}
      >
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <h2 className="font-serif text-lg tracking-[0.2em] font-medium uppercase">
            YOUR WISHLIST ({totalWishlistItems})
          </h2>
          <button
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close Wishlist"
            className="text-stone-400 hover:text-white transition p-1 cursor-pointer"
          >
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto py-4 space-y-4">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <p className="text-stone-400 text-xs tracking-[0.25em] font-medium uppercase">
                YOUR WISHLIST IS EMPTY
              </p>
            </div>
          ) : (
            wishlist.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-stone-800/80 pb-3">
                <div 
                  onClick={() => {
                    setIsWishlistOpen(false);
                    router.push(`/product/${item.id}`);
                  }}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <div className="relative w-14 h-16 rounded overflow-hidden bg-stone-800">
                    <Image src={item.image} alt={item.name} fill className="object-cover object-top group-hover:scale-105 transition" />
                  </div>
                  <div>
                    <h4 className="text-xs font-serif tracking-wide group-hover:text-amber-400 transition">{item.name}</h4>
                    <p className="text-[10px] text-amber-500">{item.price}</p>
                  </div>
                </div>
                <button onClick={() => removeFromWishlist(item.id)} className="text-stone-500 hover:text-red-400 transition p-1 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-stone-800 pt-4">
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="w-full bg-stone-100 hover:bg-white text-stone-900 text-xs font-semibold tracking-widest uppercase py-3.5 transition duration-300 rounded-sm cursor-pointer"
          >
            Continue Browsing
          </button>
        </div>
      </aside>

      {/* CART DRAWER */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      <aside
        className={`fixed top-0 right-0 w-full max-w-md h-full bg-[#181818] text-white z-50 shadow-2xl transition-transform duration-300 ease-in-out transform ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col justify-between p-6`}
      >
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <h2 className="font-serif text-lg tracking-[0.2em] font-medium uppercase">
            YOUR CART ({totalCartItems})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Cart"
            className="text-stone-400 hover:text-white transition p-1 cursor-pointer"
          >
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <p className="text-stone-400 text-xs tracking-[0.25em] font-medium uppercase">
                YOUR CART IS EMPTY
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-stone-800/80 pb-3">
                <div 
                  onClick={() => handleCartItemClick(item.id)}
                  className="flex items-center space-x-3 cursor-pointer group flex-1"
                >
                  <div className="relative w-14 h-16 rounded overflow-hidden bg-stone-800 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover object-top group-hover:scale-105 transition" />
                  </div>
                  <div>
                    <h4 className="text-xs font-serif tracking-wide group-hover:text-amber-400 transition line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] text-stone-400 mt-0.5">{item.price} <span className="text-amber-500 font-semibold">x{item.quantity}</span></p>
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="text-stone-500 hover:text-red-400 transition p-1 ml-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-stone-800 pt-4 space-y-2">
          {cart.length > 0 && (
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold tracking-widest uppercase py-3.5 transition duration-300 rounded-sm shadow-md cursor-pointer"
            >
              Proceed to Checkout
            </button>
          )}
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium tracking-widest uppercase py-3 transition duration-300 rounded-sm cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </aside>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}