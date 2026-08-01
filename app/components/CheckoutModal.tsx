'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, CheckCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  directProduct?: {
    name: string;
    price: string;
    quantity: number;
    image?: string;
  };
}

export default function CheckoutModal({ isOpen, onClose, directProduct }: CheckoutModalProps) {
  const { cart, clearCart } = useCart();
  const { storeStatus } = useSettings();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const activeItems = directProduct ? [directProduct] : cart;

  const totalPrice = activeItems.reduce((sum, item) => sum + (parseInt(item.price.replace(/[^0-9]/g, ''), 10) || 0) * item.quantity, 0);
  const formattedTotal = `PKR ${totalPrice.toLocaleString()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !city || !address) {
      alert('Please fill in all required shipping details!');
      return;
    }

    setLoading(true);

    try {
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const itemDetails = activeItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '/poster1.jpg'
      }));

      await addDoc(collection(db, 'orders'), {
        id: orderId,
        customer: name,
        phone: phone,
        city: city,
        address: address,
        total: formattedTotal,
        items: `${activeItems.length} item(s)`,
        itemDetails: itemDetails,
        status: 'New',
        date: new Date().toLocaleString(),
      });

      if (!directProduct) {
        clearCart();
      }
      setSubmitted(true);
    } catch (error) {
      console.error("Error saving order to Firestore:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FDFBF7] w-full max-w-lg rounded-2xl p-6 md:p-8 shadow-2xl relative border border-stone-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 p-1 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {!storeStatus ? (
          <div className="text-center py-8 space-y-4">
            <h3 className="font-serif text-xl font-semibold text-red-600 uppercase">Store is Temporarily Closed</h3>
            <p className="text-xs text-stone-600">We are currently not accepting new orders. Please check back later.</p>
          </div>
        ) : submitted ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            <h3 className="font-serif text-2xl font-semibold uppercase">Order Placed Successfully!</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Thank you for shopping with TTS. Your order has been registered in our system and our dispatch team will contact you soon.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 bg-[#3D2B1F] text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-xl font-semibold uppercase tracking-wide">Secure Checkout (COD)</h2>
              <p className="text-xs text-stone-500 mt-1">Fill in your shipping address for Cash on Delivery</p>
            </div>

            <div className="bg-stone-100 p-4 rounded-xl space-y-2 max-h-40 overflow-y-auto">
              <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Order Summary</p>
              {activeItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-stone-800">
                  <span className="line-clamp-1">{item.name} (x{item.quantity})</span>
                  <span className="font-bold">{item.price}</span>
                </div>
              ))}
              <div className="border-t border-stone-200 pt-2 flex justify-between text-xs font-bold text-amber-900">
                <span>Total Amount:</span>
                <span>{formattedTotal}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-semibold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Ali"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-stone-300 rounded px-3 py-2.5 text-xs bg-white focus:outline-none focus:border-stone-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-stone-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="03001234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-stone-300 rounded px-3 py-2.5 text-xs bg-white focus:outline-none focus:border-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-stone-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lahore / Faisalabad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-stone-300 rounded px-3 py-2.5 text-xs bg-white focus:outline-none focus:border-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-stone-700 mb-1">Complete Delivery Address *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="House #, Street name, Area / Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-stone-300 rounded p-3 text-xs bg-white focus:outline-none focus:border-stone-800 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded transition shadow-md cursor-pointer flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{loading ? 'Processing Order...' : `Confirm Order (${formattedTotal})`}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}