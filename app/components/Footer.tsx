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
    <footer className="bg-[#1C1917] text-stone-300 pt-16 pb-8 border-t border-stone-800">
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
  );
}