'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

interface SettingsContextType {
  announcementText: string;
  storeStatus: boolean;
  supportPhone: string;
  contactEmail: string;
  contactLocation: string;
  contactHours: string;
  adminUser: string;
  adminPass: string;
  orders: any[];
  inquiries: any[];
  updateAnnouncement: (text: string) => Promise<void>;
  updateContactSupport: (data: any) => Promise<void>;
  updateStoreSettings: (data: any) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  deleteInquiry: (inqId: string) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [announcementText, setAnnouncementText] = useState('FREE SHIPPING NATIONWIDE ❖ 100% UNSTITCHED LUXURY FABRIC');
  const [storeStatus, setStoreStatus] = useState(true);
  const [supportPhone, setSupportPhone] = useState('923046667449');
  const [contactEmail, setContactEmail] = useState('support@todaytrendshop.com');
  const [contactLocation, setContactLocation] = useState('Faisalabad, Punjab, Pakistan');
  const [contactHours, setContactHours] = useState('24/7 hours');
  const [adminUser, setAdminUser] = useState('admin');
  const [adminPass, setAdminPass] = useState('admin123');
  const [orders, setOrders] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const annDoc = await getDoc(doc(db, 'announcements', 'current'));
        if (annDoc.exists() && annDoc.data().text) {
          setAnnouncementText(annDoc.data().text);
        }

        const contactDoc = await getDoc(doc(db, 'contact_support', 'details'));
        if (contactDoc.exists()) {
          const data = contactDoc.data();
          if (data.supportPhone !== undefined) setSupportPhone(data.supportPhone);
          if (data.contactEmail) setContactEmail(data.contactEmail);
          if (data.contactLocation) setContactLocation(data.contactLocation);
          if (data.contactHours) setContactHours(data.contactHours);
        }

        const storeDoc = await getDoc(doc(db, 'store_settings', 'config'));
        if (storeDoc.exists()) {
          const data = storeDoc.data();
          if (data.storeStatus !== undefined) setStoreStatus(data.storeStatus);
          if (data.supportPhone !== undefined) setSupportPhone(data.supportPhone);
          if (data.adminUser) setAdminUser(data.adminUser);
          if (data.adminPass) setAdminPass(data.adminPass);
        }

        const ordersSnap = await getDocs(collection(db, 'orders'));
        setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const inqSnap = await getDocs(collection(db, 'inquiries'));
        setInquiries(inqSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

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
    } catch (error) {
      console.error("Error updating announcement:", error);
    }
  };

  const updateContactSupport = async (data: any) => {
    try {
      await setDoc(doc(db, 'contact_support', 'details'), data, { merge: true });
      if (data.supportPhone !== undefined) setSupportPhone(data.supportPhone);
      if (data.contactEmail) setContactEmail(data.contactEmail);
      if (data.contactLocation) setContactLocation(data.contactLocation);
      if (data.contactHours) setContactHours(data.contactHours);
    } catch (error) {
      console.error("Error updating contact support:", error);
    }
  };

  const updateStoreSettings = async (data: any) => {
    try {
      await setDoc(doc(db, 'store_settings', 'config'), data, { merge: true });
      if (data.storeStatus !== undefined) setStoreStatus(data.storeStatus);
      if (data.supportPhone !== undefined) setSupportPhone(data.supportPhone);
      if (data.adminUser) setAdminUser(data.adminUser);
      if (data.adminPass) setAdminPass(data.adminPass);
    } catch (error) {
      console.error("Error updating store settings:", error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrders(orders.filter(o => o.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const deleteInquiry = async (inqId: string) => {
    try {
      await deleteDoc(doc(db, 'inquiries', inqId));
      setInquiries(inquiries.filter(i => i.id !== inqId));
    } catch (error) {
      console.error("Error deleting inquiry:", error);
    }
  };

  return (
    <SettingsContext.Provider value={{
      announcementText, storeStatus, supportPhone, contactEmail, contactLocation, contactHours,
      adminUser, adminPass, orders, inquiries, updateAnnouncement, updateContactSupport, 
      updateStoreSettings, updateOrderStatus, deleteOrder, deleteInquiry
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