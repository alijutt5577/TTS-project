'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Hide Footer completely on Admin panel pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <footer className="bg-[#1C1917] text-stone-300 pt-16 pb-8 border-t border-stone-800 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-white italic">
              TODAYTRENDSHOP
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Elegance in every stitch. Discover premium Pakistani ladies and kids unstitched & luxury stitched ensembles.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link href="/ladies" className="hover:text-white transition">Ladies Collection</Link></li>
              <li><Link href="/kids" className="hover:text-white transition">Kids Festive Suits</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-white transition">New Arrivals</Link></li>
              <li><Link href="#" className="hover:text-white transition">Collections</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link href="#" className="hover:text-white transition">Track Your Order</Link></li>
              <li><Link href="#" className="hover:text-white transition">Shipping Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition">Exchanges & Return Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-4">
              Newsletter
            </h4>
            <p className="text-xs text-stone-400 mb-3">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-stone-900 border border-stone-700 text-xs px-3 py-2 w-full text-white focus:outline-none focus:border-stone-500 rounded-l-sm"
              />
              <button
                type="submit"
                className="bg-[#3D2B1F] hover:bg-[#2A1D14] text-white text-xs px-4 py-2 uppercase tracking-wider rounded-r-sm transition cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-stone-800 text-center text-[11px] text-stone-500">
          © {new Date().getFullYear()} TodayTrendShop. All rights reserved.
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON WITH OFFICIAL LOGO */}
      <a
        href="https://wa.me/923000000000" 
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-7 h-7"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>
    </>
  );
}