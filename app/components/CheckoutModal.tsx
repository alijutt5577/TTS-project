'use client';

import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
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
    images?: string[];
  };
}

export default function CheckoutModal({ isOpen, onClose, directProduct }: CheckoutModalProps) {
  const { cart, clearCart } = useCart();
  const productContext = useProducts() as any;
  const productList = productContext?.products || [];
  const reduceStock = productContext?.reduceStock;

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    address: '',
    paymentMethod: 'Cash on Delivery',
  });

  if (!isOpen) return null;

  // Helper function to find accurate image from product list or item object
  const getAccurateImage = (item: any) => {
    if (item.image && typeof item.image === 'string' && item.image.trim() !== '') {
      return item.image;
    }
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      return item.images[0];
    }
    // Match with catalog products if available
    const matched = productList.find((p: any) => p.name === item.name || p.id === item.id);
    if (matched) {
      return matched.image || (matched.images && matched.images[0]) || '/poster1.jpg';
    }
    return '/poster1.jpg';
  };

  // Calculate order items WITH ACCURATE IMAGES
  const itemsToOrder = directProduct 
    ? [{ 
        name: directProduct.name, 
        price: directProduct.price, 
        quantity: directProduct.quantity, 
        image: getAccurateImage(directProduct) 
      }] 
    : cart.map(item => ({ 
        name: item.name, 
        price: item.price, 
        quantity: item.quantity, 
        image: getAccurateImage(item) 
      }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.city || !formData.address) {
      alert('Please fill in all details!');
      return;
    }

    // 1. AUTOMATICALLY REDUCE STOCK UNITS
    if (typeof reduceStock === 'function') {
      reduceStock(itemsToOrder);
    }

    // Prepare items text
    let orderItemsText = itemsToOrder
      .map((item) => `${item.name} (x${item.quantity})`)
      .join(', ');

    let totalAmountText = directProduct 
      ? directProduct.price 
      : `PKR ${cart.reduce((sum, item) => sum + (parseInt(item.price.replace(/[^0-9]/g, ''), 10) || 0) * item.quantity, 0).toLocaleString()}`;

    // 2. SAVE ORDER WITH 'NEW' STATUS FOR ADMIN PANEL
    const newOrder = {
      id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
      customer: formData.fullName,
      phone: formData.phone,
      city: formData.city,
      address: formData.address,
      total: totalAmountText,
      items: orderItemsText,
      itemDetails: itemsToOrder,
      date: new Date().toISOString().split('T')[0],
      status: 'New',
    };

    try {
      const existingOrders = JSON.parse(localStorage.getItem('tts_orders') || '[]');
      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem('tts_orders', JSON.stringify(updatedOrders));
      window.dispatchEvent(new Event('storage'));
    } catch (storageErr) {
      console.error('Storage limit error safely handled');
    }

    // 3. SEND EMAIL NOTIFICATION VIA EMAILJS (Updated with correct template ID 'template_alo2sbs')
    try {
      const templateParams = {
        order_id: newOrder.id,
        customer_name: formData.fullName,
        customer_phone: formData.phone,
        customer_city: formData.city,
        customer_address: formData.address,
        total_amount: totalAmountText,
        order_items: orderItemsText,
      };

      emailjs.send(
        'service_uyvkdps',
        'template_alo2sbs',
        templateParams,
        '3yWFiHp6MIEaS24Qj'
      ).then((response) => {
        console.log('Order notification email sent successfully!', response.status, response.text);
      }).catch((err) => {
        console.warn('EmailJS request failed silently without breaking user flow:', err);
      });
    } catch (emailErr) {
      console.warn('Email execution caught safely');
    }

    // 4. WHATSAPP MESSAGE REDIRECT
    const savedPhone = typeof window !== 'undefined' ? localStorage.getItem('tts_support_phone') : null;
    let rawPhone = savedPhone ? savedPhone.trim().replace(/[^0-9]/g, '') : '';

    if (rawPhone.startsWith('0')) {
      rawPhone = '92' + rawPhone.slice(1);
    }

    let whatsappItemsText = itemsToOrder
      .map((item) => {
        let line = `• *${item.name}* (x${item.quantity}) - ${item.price}`;
        if (item.image && item.image.startsWith('http')) {
          line += `\n   🖼️ Photo: ${item.image}`;
        }
        return line;
      })
      .join('\n');

    const message = `🛍️ *NEW ORDER CONFIRMED - TODAYTRENDSHOP*\n\n` +
      `🆔 *Order ID:* ${newOrder.id}\n` +
      `👤 *Customer Name:* ${formData.fullName}\n` +
      `📞 *Phone:* ${formData.phone}\n` +
      `🏙️ *City:* ${formData.city}\n` +
      `📍 *Address:* ${formData.address}\n` +
      `💵 *Payment Method:* ${formData.paymentMethod}\n\n` +
      `📦 *ORDER ITEMS:*\n${whatsappItemsText}\n\n` +
      `💰 *Total:* ${totalAmountText}\n` +
      `🚚 *Shipping:* FREE NATIONWIDE\n\n` +
      `Please confirm my order. Thank you!`;

    if (rawPhone !== '') {
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${rawPhone}?text=${encodedMessage}`, '_blank');
    } else {
      alert(`Order successfully placed! Your Order ID is ${newOrder.id}.`);
    }
    
    // Clear Form & Cart
    if (!directProduct) {
      clearCart();
    }
    setFormData({ fullName: '', phone: '', city: '', address: '', paymentMethod: 'Cash on Delivery' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] text-[#2C2623] w-full max-w-lg rounded-xl shadow-2xl p-6 md:p-8 relative border border-stone-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 p-1 transition cursor-pointer"
        >
          <X className="w-6 h-6 stroke-[1.5]" />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-amber-900 font-semibold mb-1">Quick Checkout</p>
          <h2 className="font-serif text-2xl tracking-wide uppercase text-stone-900">
            Delivery Details
          </h2>
          <div className="h-[1px] w-12 bg-amber-900/40 mx-auto mt-2"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ali Raza"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-white border border-stone-300 rounded px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-800 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 mb-1">WhatsApp / Phone *</label>
              <input
                type="tel"
                required
                placeholder="03001234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-800 transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 mb-1">City *</label>
              <input
                type="text"
                required
                placeholder="e.g. Lahore"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-800 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 mb-1">Complete Delivery Address *</label>
            <textarea
              required
              rows={2}
              placeholder="House #, Street #, Sector/Area..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-800 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 mb-1">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full bg-white border border-stone-300 rounded px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-800 transition cursor-pointer"
            >
              <option value="Cash on Delivery">Cash on Delivery (COD)</option>
              <option value="Bank Transfer / JazzCash">Bank Transfer / JazzCash</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded transition duration-300 shadow-md flex items-center justify-center space-x-2 mt-4 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Confirm Order Via WhatsApp</span>
          </button>
        </form>

      </div>
    </div>
  );
}