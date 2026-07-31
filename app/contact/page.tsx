'use client';

import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Mail, MapPin, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const { supportPhone, contactEmail, contactLocation, contactHours } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    orderId: '',
    subject: 'Order Status Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  let cleanPhone = (supportPhone || '').trim().replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '92' + cleanPhone.slice(1);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.message) {
      alert('Please fill in all required fields!');
      return;
    }

    try {
      // SAVE INQUIRY TO FIRESTORE DATABASE
      await addDoc(collection(db, 'inquiries'), {
        name: formData.name,
        phone: formData.phone,
        orderId: formData.orderId || 'N/A',
        subject: formData.subject,
        message: formData.message,
        date: new Date().toLocaleString(),
      });

      // OPEN WHATSAPP IF PHONE NUMBER IS CONFIGURED
      if (cleanPhone !== '') {
        const waMsg = `📩 *NEW CONTACT INQUIRY - TTS*\n\n` +
          `👤 *Name:* ${formData.name}\n` +
          `📞 *Phone:* ${formData.phone}\n` +
          `🆔 *Order ID:* ${formData.orderId || 'N/A'}\n` +
          `🏷️ *Subject:* ${formData.subject}\n\n` +
          `💬 *Message:* ${formData.message}`;

        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`, '_blank');
      }

      setSubmitted(true);
      setFormData({ name: '', phone: '', orderId: '', subject: 'Order Status Inquiry', message: '' });
    } catch (error) {
      console.error("Error saving inquiry to database:", error);
      alert("Failed to send inquiry. Please try again.");
    }
  };

  return (
    <div className="bg-[#FDFBF7] text-[#2C2623] min-h-screen pt-32 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-amber-900 font-semibold mb-2">
            Get In Touch
          </p>
          <h1 className="font-serif text-3xl md:text-5xl tracking-widest uppercase">
            Contact Support
          </h1>
          <div className="h-[1px] w-12 bg-amber-900/40 mx-auto mt-4 mb-4"></div>
          <p className="text-xs md:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
            Have questions regarding your order, size customization, or shipping? We&apos;re here to assist you every step of the way.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm text-center">
            <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider mb-1">WhatsApp Chat</h3>
            <p className="text-[11px] text-stone-500 mb-3">Instant order updates & queries</p>
            {cleanPhone ? (
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-amber-900 underline hover:text-amber-800"
              >
                Chat Now →
              </a>
            ) : (
              <span className="text-xs font-semibold text-stone-400">Available Online</span>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm text-center">
            <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider mb-1">Email Us</h3>
            <p className="text-[11px] text-stone-500 mb-2">For inquiries & feedback</p>
            <p className="text-xs font-bold text-stone-800 break-all">{contactEmail}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm text-center">
            <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider mb-1">Location</h3>
            <p className="text-[11px] text-stone-500 mb-2">Main Studio Outlet</p>
            <p className="text-xs font-bold text-stone-800">{contactLocation}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm text-center">
            <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider mb-1">Working Hours</h3>
            <p className="text-[11px] text-stone-500 mb-2">Operational Days</p>
            <p className="text-xs font-bold text-stone-800">{contactHours}</p>
          </div>
        </div>

        {/* Main Grid: Form & FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Inquiry Form */}
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="font-serif text-xl font-semibold tracking-wide uppercase">Send Us A Message</h2>
              <p className="text-xs text-stone-500 mt-1">Fill out the form below and we will get back to you shortly.</p>
            </div>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
                <h4 className="font-serif text-base font-semibold text-green-900">Message Sent Successfully!</h4>
                <p className="text-xs text-stone-600">Thank you for reaching out. Your inquiry has been saved to the database and our team will contact you soon.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold text-amber-900 underline uppercase tracking-wider cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ali Raza"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-stone-300 rounded px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="03001234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-stone-300 rounded px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">Order ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. ORD-101"
                      value={formData.orderId}
                      onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                      className="w-full border border-stone-300 rounded px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full border border-stone-300 rounded px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-800 cursor-pointer"
                  >
                    <option value="Order Status Inquiry">Order Status Inquiry</option>
                    <option value="Size & Customization">Size & Customization</option>
                    <option value="Exchange / Return Request">Exchange / Return Request</option>
                    <option value="Wholesale / Custom Orders">Wholesale / Custom Orders</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your query details here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full border border-stone-300 rounded p-3 text-xs text-stone-900 focus:outline-none focus:border-stone-800 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#3D2B1F] hover:bg-[#2A1D14] text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded transition shadow flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* FAQs Accordion */}
          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-amber-900 font-semibold mb-1">Help Center</p>
              <h2 className="font-serif text-2xl font-semibold uppercase tracking-wide">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-white p-5 rounded-xl border border-stone-200">
                <h4 className="font-bold text-stone-900 mb-1">How long does nationwide shipping take?</h4>
                <p className="text-stone-600 leading-relaxed">
                  All standard orders are dispatched within 24 hours and delivered nationwide across Pakistan within 3 to 5 business days.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200">
                <h4 className="font-bold text-stone-900 mb-1">What is your exchange policy?</h4>
                <p className="text-stone-600 leading-relaxed">
                  We offer a hassle-free 7-day exchange policy. If there is any defect or sizing issue, contact us on WhatsApp with pictures of the package within 7 days.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200">
                <h4 className="font-bold text-stone-900 mb-1">Is Cash on Delivery (COD) available?</h4>
                <p className="text-stone-600 leading-relaxed">
                  Yes, Cash on Delivery is available all across Pakistan. You can pay the courier rider upon receiving your parcel.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200">
                <h4 className="font-bold text-stone-900 mb-1">Can I customize dress measurements?</h4>
                <p className="text-stone-600 leading-relaxed">
                  Yes, for stitched collections you can discuss custom measurements with our team on WhatsApp prior to placing your order.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}