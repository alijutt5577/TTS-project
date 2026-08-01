'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ShoppingBag, PartyPopper } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useProducts } from '../context/ProductContext';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  directProduct?: {
    id?: string;
    name: string;
    price: string;
    quantity: number;
    image?: string;
    units?: number;
  };
}

export default function CheckoutModal({ isOpen, onClose, directProduct }: CheckoutModalProps) {
  const { cart, clearCart } = useCart();
  const { storeStatus, supportPhone } = useSettings();
  const productContext = useProducts() as any;
  const productsList = productContext?.products || [];
  const editProduct = productContext?.editProduct || (() => {});

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignedOrderId, setAssignedOrderId] = useState('');

  if (!isOpen) return null;

  const activeItems = directProduct ? [directProduct] : cart;

  const totalPrice = activeItems.reduce((sum, item) => {
    const rawPrice = parseInt(item.price.replace(/[^0-9]/g, ''), 10) || 0;
    return sum + rawPrice;
  }, 0);
  const formattedTotal = `PKR ${totalPrice.toLocaleString()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !city || !address) {
      alert('Please fill in all required shipping details!');
      return;
    }

    setLoading(true);

    try {
      // SEQUENTIAL ZERO-BASED ORDER ID GENERATOR (0000, 0001, 0002...)
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const nextNum = ordersSnapshot.size;
      const orderId = String(nextNum).padStart(4, '0');
      setAssignedOrderId(orderId);
      
      const itemDetails = activeItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '/poster1.jpg'
      }));

      // 1. Save Order to Firestore
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

      // 2. Send Email via EmailJS
      try {
        const emailParams = {
          order_id: orderId,
          customer_name: name,
          customer_phone: phone,
          customer_city: city,
          customer_address: address,
          order_total: formattedTotal,
          order_items: activeItems.map(i => `${i.name} (x${i.quantity})`).join(', ')
        };

        await emailjs.send(
          'service_uyvkdps',
          'template_alo2sbs',
          emailParams,
          '3yWFiHp6MIEaS24Qj'
        );
      } catch (emailErr) {
        console.error("EmailJS sending failed:", emailErr);
      }

      // 3. WHATSAPP AUTO MESSAGE REDIRECT
      if (supportPhone && supportPhone.trim() !== '') {
        const waNumber = supportPhone.replace(/[^0-9]/g, '');
        const waMessage = `*New Order Received!*%0A*Order No:* ${orderId}%0A*Customer:* ${name}%0A*Phone:* ${phone}%0A*City:* ${city}%0A*Address:* ${address}%0A*Items:* ${activeItems.map(i => `${i.name} (x${i.quantity})`).join(', ')}%0A*Total:* ${formattedTotal}`;
        
        window.open(`https://wa.me/${waNumber}?text=${waMessage}`, '_blank');
      }

      // 4. Deduct Stock Units
      if (directProduct && productsList.length > 0) {
        const foundProd = productsList.find((p: any) => 
          (directProduct.id && p.id === directProduct.id) || 
          p.name.toLowerCase() === directProduct.name.toLowerCase()
        );

        if (foundProd && foundProd.id) {
          const currentUnits = parseInt(foundProd.units ?? 10, 10);
          const orderedQty = directProduct.quantity || 1;
          const newUnits = Math.max(0, currentUnits - orderedQty);

          editProduct({ ...foundProd, units: newUnits });

          await updateDoc(doc(db, 'products', foundProd.id), {
            units: newUnits
          });
        }
      } else if (!directProduct && cart.length > 0 && productsList.length > 0) {
        for (const cartItem of cart) {
          const foundProd = productsList.find((p: any) => 
            (cartItem.id && p.id === cartItem.id) || 
            p.name.toLowerCase() === cartItem.name.toLowerCase()
          );

          if (foundProd && foundProd.id) {
            const currentUnits = parseInt(foundProd.units ?? 10, 10);
            const orderedQty = cartItem.quantity || 1;
            const newUnits = Math.max(0, currentUnits - orderedQty);

            editProduct({ ...foundProd, units: newUnits });

            await updateDoc(doc(db, 'products', foundProd.id), {
              units: newUnits
            });
          }
        }
      }

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
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
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
          <div className="text-center py-8 space-y-5 animate-fade-in">
            <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <PartyPopper className="w-8 h-8 animate-bounce" />
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-900 bg-amber-100/60 px-3 py-1 rounded-full">
                Order Confirmed Successfully
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold uppercase tracking-wide text-stone-900">
                Congratulations! 🎉
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed px-4">
                Thank you for shopping with <span className="font-bold text-stone-900">TTS</span>. Your order no (<span className="font-mono font-bold text-amber-900">{assignedOrderId}</span>) has been successfully placed.
              </p>
            </div>

            <div className="bg-stone-100 p-4 rounded-xl text-left space-y-1 text-xs text-stone-700 max-w-xs mx-auto border border-stone-200">
              <p className="font-bold text-[11px] uppercase tracking-wider text-stone-900 mb-1">Shipping Details:</p>
              <p><span className="text-stone-500">Name:</span> {name}</p>
              <p><span className="text-stone-500">Phone:</span> {phone}</p>
              <p><span className="text-stone-500">City:</span> {city}</p>
              <p><span className="text-stone-500">Total:</span> <span className="font-bold text-amber-900">{formattedTotal} (COD)</span></p>
            </div>

            <p className="text-[11px] text-stone-500 italic">
              Our customer support team will call you shortly for order verification.
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-2 bg-[#3D2B1F] hover:bg-[#2A1D14] text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-lg shadow-md cursor-pointer transition"
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

            <div className="bg-stone-100 p-4 rounded-xl space-y-2 max-h-40 overflow-y-auto border border-stone-200">
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