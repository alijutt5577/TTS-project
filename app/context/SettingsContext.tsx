'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

interface SettingsContextType {
  announcementText: string;
  storeStatus: boolean;
  supportPhone: string;
  contactEmail: string;
  contactLocation: string;
  contactHours: string;
  adminUser: string;
  adminPass: string;
  logoType: 'text' | 'image';
  logoText: string;
  logoImage: string;
  logoSize: string;
  orders: any[];
  inquiries: any[];
  updateAnnouncement: (text: string) => Promise<void>;
  updateContactSupport: (data: any) => Promise<void>;
  updateStoreSettings: (data: any) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  deleteInquiry: (inqId: string) => Promise<void>;
  updateLogoSettings: (data: { logoType?: 'text' | 'image'; logoText?: string; logoImage?: string; logoSize?: string }) => Promise<void>;
  deleteLogoImage: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [announcementText, setAnnouncementText] = useState(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('cache_announcementText');
      if (cached) return cached;
    }
    return 'FREE SHIPPING NATIONWIDE ❖ 100% UNSTITCHED LUXURY FABRIC';
  });

  const [storeStatus, setStoreStatus] = useState(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('cache_storeStatus');
      if (cached !== null) return cached === 'true';
    }
    return true;
  });

  const [supportPhone, setSupportPhone] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cache_supportPhone') || '923046667449';
    }
    return '923046667449';
  });

  const [contactEmail, setContactEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cache_contactEmail') || 'support@todaytrendshop.com';
    }
    return 'support@todaytrendshop.com';
  });

  const [contactLocation, setContactLocation] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cache_contactLocation') || 'Faisalabad, Punjab, Pakistan';
    }
    return 'Faisalabad, Punjab, Pakistan';
  });

  const [contactHours, setContactHours] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cache_contactHours') || '24/7 hours';
    }
    return '24/7 hours';
  });

  const [adminUser, setAdminUser] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cache_adminUser') || 'admin';
    }
    return 'admin';
  });

  const [adminPass, setAdminPass] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cache_adminPass') || 'admin123';
    }
    return 'admin123';
  });

  // LOGO SETTINGS STATES
  const [logoType, setLogoType] = useState<'text' | 'image'>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('cache_logoType') || localStorage.getItem('tts_logo_type');
      if (cached === 'image' || cached === 'text') return cached;
    }
    return 'text';
  });

  const [logoText, setLogoText] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cache_logoText') || localStorage.getItem('tts_logo_text') || 'TTS';
    }
    return 'TTS';
  });

  const [logoImage, setLogoImage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cache_logoImage') || localStorage.getItem('tts_logo_image') || '';
    }
    return '';
  });

  const [logoSize, setLogoSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cache_logoSize') || localStorage.getItem('tts_logo_size') || '55';
    }
    return '55';
  });

  const [orders, setOrders] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('cache_orders');
      if (cached) {
        try { return JSON.parse(cached); } catch (e) {}
      }
    }
    return [];
  });

  const [inquiries, setInquiries] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('cache_inquiries');
      if (cached) {
        try { return JSON.parse(cached); } catch (e) {}
      }
    }
    return [];
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const annDoc = await getDoc(doc(db, 'announcements', 'current'));
        if (annDoc.exists() && annDoc.data().text) {
          const text = annDoc.data().text;
          setAnnouncementText(text);
          localStorage.setItem('cache_announcementText', text);
        }

        const contactDoc = await getDoc(doc(db, 'contact_support', 'details'));
        if (contactDoc.exists()) {
          const data = contactDoc.data();
          if (data.supportPhone !== undefined) {
            setSupportPhone(data.supportPhone);
            localStorage.setItem('cache_supportPhone', data.supportPhone);
          }
          if (data.contactEmail) {
            setContactEmail(data.contactEmail);
            localStorage.setItem('cache_contactEmail', data.contactEmail);
          }
          if (data.contactLocation) {
            setContactLocation(data.contactLocation);
            localStorage.setItem('cache_contactLocation', data.contactLocation);
          }
          if (data.contactHours) {
            setContactHours(data.contactHours);
            localStorage.setItem('cache_contactHours', data.contactHours);
          }
        }

        const storeDoc = await getDoc(doc(db, 'store_settings', 'config'));
        if (storeDoc.exists()) {
          const data = storeDoc.data();
          if (data.storeStatus !== undefined) {
            setStoreStatus(data.storeStatus);
            localStorage.setItem('cache_storeStatus', String(data.storeStatus));
          }
          if (data.supportPhone !== undefined) {
            setSupportPhone(data.supportPhone);
            localStorage.setItem('cache_supportPhone', data.supportPhone);
          }
          if (data.adminUser) {
            setAdminUser(data.adminUser);
            localStorage.setItem('cache_adminUser', data.adminUser);
          }
          if (data.adminPass) {
            setAdminPass(data.adminPass);
            localStorage.setItem('cache_adminPass', data.adminPass);
          }
        }

        // FETCH STORE LOGO DOCUMENT (settings/store-logo)
        const logoDoc = await getDoc(doc(db, 'settings', 'store-logo'));
        let logoData = logoDoc.exists() ? logoDoc.data() : null;
        if (!logoData) {
          const altLogoDoc = await getDoc(doc(db, 'settings', 'store_logo'));
          if (altLogoDoc.exists()) logoData = altLogoDoc.data();
        }

        if (logoData) {
          const lType = logoData.type || logoData.logoType || 'text';
          setLogoType(lType as any);
          localStorage.setItem('cache_logoType', lType);
          localStorage.setItem('tts_logo_type', lType);

          const lText = logoData.text || logoData.logoText || 'TTS';
          setLogoText(lText);
          localStorage.setItem('cache_logoText', lText);
          localStorage.setItem('tts_logo_text', lText);

          const lImg = logoData.url ?? logoData.logoImage ?? logoData.image ?? '';
          setLogoImage(lImg);
          localStorage.setItem('cache_logoImage', lImg);
          localStorage.setItem('tts_logo_image', lImg);

          const lSize = logoData.size || logoData.logoSize || '55';
          setLogoSize(lSize);
          localStorage.setItem('cache_logoSize', lSize);
          localStorage.setItem('tts_logo_size', lSize);
        }

        const ordersSnap = await getDocs(collection(db, 'orders'));
        const fetchedOrders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(fetchedOrders);
        localStorage.setItem('cache_orders', JSON.stringify(fetchedOrders));

        const inqSnap = await getDocs(collection(db, 'inquiries'));
        const fetchedInquiries = inqSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInquiries(fetchedInquiries);
        localStorage.setItem('cache_inquiries', JSON.stringify(fetchedInquiries));

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);

  const updateAnnouncement = async (text: string) => {
    try {
      await setDoc(doc(db, 'announcements', 'current'), { text }, { merge: true });
      setAnnouncementText(text);
      if (typeof window !== 'undefined') localStorage.setItem('cache_announcementText', text);
    } catch (error) {
      console.error("Error updating announcement:", error);
    }
  };

  const updateContactSupport = async (data: any) => {
    try {
      await setDoc(doc(db, 'contact_support', 'details'), data, { merge: true });
      if (data.supportPhone !== undefined) {
        setSupportPhone(data.supportPhone);
        if (typeof window !== 'undefined') localStorage.setItem('cache_supportPhone', data.supportPhone);
      }
      if (data.contactEmail) {
        setContactEmail(data.contactEmail);
        if (typeof window !== 'undefined') localStorage.setItem('cache_contactEmail', data.contactEmail);
      }
      if (data.contactLocation) {
        setContactLocation(data.contactLocation);
        if (typeof window !== 'undefined') localStorage.setItem('cache_contactLocation', data.contactLocation);
      }
      if (data.contactHours) {
        setContactHours(data.contactHours);
        if (typeof window !== 'undefined') localStorage.setItem('cache_contactHours', data.contactHours);
      }
    } catch (error) {
      console.error("Error updating contact support:", error);
    }
  };

  const updateStoreSettings = async (data: any) => {
    try {
      await setDoc(doc(db, 'store_settings', 'config'), data, { merge: true });
      if (data.storeStatus !== undefined) {
        setStoreStatus(data.storeStatus);
        if (typeof window !== 'undefined') localStorage.setItem('cache_storeStatus', String(data.storeStatus));
      }
      if (data.supportPhone !== undefined) {
        setSupportPhone(data.supportPhone);
        if (typeof window !== 'undefined') localStorage.setItem('cache_supportPhone', data.supportPhone);
      }
      if (data.adminUser) {
        setAdminUser(data.adminUser);
        if (typeof window !== 'undefined') localStorage.setItem('cache_adminUser', data.adminUser);
      }
      if (data.adminPass) {
        setAdminPass(data.adminPass);
        if (typeof window !== 'undefined') localStorage.setItem('cache_adminPass', data.adminPass);
      }
    } catch (error) {
      console.error("Error updating store settings:", error);
    }
  };

  const updateLogoSettings = async (data: {
    logoType?: 'text' | 'image';
    logoText?: string;
    logoImage?: string;
    logoSize?: string;
  }) => {
    try {
      const newType = data.logoType !== undefined ? data.logoType : logoType;
      const newText = data.logoText !== undefined ? data.logoText : logoText;
      const newImage = data.logoImage !== undefined ? data.logoImage : logoImage;
      const newSize = data.logoSize !== undefined ? data.logoSize : logoSize;

      const payload = {
        type: newType,
        logoType: newType,
        text: newText,
        logoText: newText,
        url: newImage,
        image: newImage,
        logoImage: newImage,
        size: newSize,
        logoSize: newSize,
        updatedAt: new Date().toISOString()
      };

      await Promise.all([
        setDoc(doc(db, 'settings', 'store-logo'), payload, { merge: true }),
        setDoc(doc(db, 'settings', 'store_logo'), payload, { merge: true })
      ]);

      setLogoType(newType);
      setLogoText(newText);
      setLogoImage(newImage);
      setLogoSize(newSize);

      if (typeof window !== 'undefined') {
        localStorage.setItem('cache_logoType', newType);
        localStorage.setItem('tts_logo_type', newType);
        localStorage.setItem('cache_logoText', newText);
        localStorage.setItem('tts_logo_text', newText);
        localStorage.setItem('cache_logoImage', newImage);
        localStorage.setItem('tts_logo_image', newImage);
        localStorage.setItem('cache_logoSize', newSize);
        localStorage.setItem('tts_logo_size', newSize);
      }
    } catch (error) {
      console.error("Error updating logo settings:", error);
      throw error;
    }
  };

  const deleteLogoImage = async () => {
    try {
      const payload = {
        type: 'text',
        logoType: 'text',
        text: logoText || 'TTS',
        logoText: logoText || 'TTS',
        url: '',
        image: '',
        logoImage: '',
        size: logoSize || '55',
        logoSize: logoSize || '55',
        updatedAt: new Date().toISOString()
      };

      await Promise.all([
        setDoc(doc(db, 'settings', 'store-logo'), payload, { merge: true }),
        setDoc(doc(db, 'settings', 'store_logo'), payload, { merge: true })
      ]);

      setLogoType('text');
      setLogoImage('');

      if (typeof window !== 'undefined') {
        localStorage.setItem('cache_logoType', 'text');
        localStorage.setItem('tts_logo_type', 'text');
        localStorage.setItem('cache_logoImage', '');
        localStorage.setItem('tts_logo_image', '');
      }
    } catch (error) {
      console.error("Error deleting logo image:", error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const q = query(collection(db, 'orders'), where('id', '==', orderId));
      const querySnapshot = await getDocs(q);
      for (const documentSnap of querySnapshot.docs) {
        await updateDoc(doc(db, 'orders', documentSnap.id), { status: newStatus });
      }
      const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      setOrders(updatedOrders);
      if (typeof window !== 'undefined') localStorage.setItem('cache_orders', JSON.stringify(updatedOrders));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const q = query(collection(db, 'orders'), where('id', '==', orderId));
      const querySnapshot = await getDocs(q);
      for (const documentSnap of querySnapshot.docs) {
        await deleteDoc(doc(db, 'orders', documentSnap.id));
      }
      const updatedOrders = orders.filter(o => o.id !== orderId);
      setOrders(updatedOrders);
      if (typeof window !== 'undefined') localStorage.setItem('cache_orders', JSON.stringify(updatedOrders));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const deleteInquiry = async (inqId: string) => {
    try {
      await deleteDoc(doc(db, 'inquiries', inqId));
      const updatedInquiries = inquiries.filter(i => i.id !== inqId);
      setInquiries(updatedInquiries);
      if (typeof window !== 'undefined') localStorage.setItem('cache_inquiries', JSON.stringify(updatedInquiries));
    } catch (error) {
      console.error("Error deleting inquiry:", error);
    }
  };

  return (
    <SettingsContext.Provider value={{
      announcementText, storeStatus, supportPhone, contactEmail, contactLocation, contactHours,
      adminUser, adminPass, logoType, logoText, logoImage, logoSize, orders, inquiries,
      updateAnnouncement, updateContactSupport, updateStoreSettings, updateOrderStatus, 
      deleteOrder, deleteInquiry, updateLogoSettings, deleteLogoImage
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};