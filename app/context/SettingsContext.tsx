'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

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
  updateSettings: (newSettings: any) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  deleteInquiry: (inqId: string) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [announcementText, setAnnouncementText] = useState('FREE SHIPPING NATIONWIDE ❖ 100% UNSTITCHED LUXURY FABRIC');
  const [storeStatus, setStoreStatus] = useState(true);
  const [supportPhone, setSupportPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('support@todaytrendshop.com');
  const [contactLocation, setContactLocation] = useState('Lahore, Punjab, Pakistan');
  const [contactHours, setContactHours] = useState('Monday – Saturday (10:00 AM – 8:00 PM PKT)');
  const [adminUser, setAdminUser] = useState('admin');
  const [adminPass, setAdminPass] = useState('admin123');
  const [orders, setOrders] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllSettings = async () => {
      try {
        // Fetch Store Configurations
        const docRef = doc(db, 'settings', 'store_config');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.announcementText) setAnnouncementText(data.announcementText);
          if (data.storeStatus !== undefined) setStoreStatus(data.storeStatus);
          if (data.supportPhone !== undefined) setSupportPhone(data.supportPhone);
          if (data.contactEmail) setContactEmail(data.contactEmail);
          if (data.contactLocation) setContactLocation(data.contactLocation);
          if (data.contactHours) setContactHours(data.contactHours);
          if (data.adminUser) setAdminUser(data.adminUser);
          if (data.adminPass) setAdminPass(data.adminPass);
        }

        // Fetch Orders from Firestore
        const ordersSnap = await getDocs(collection(db, 'orders'));
        const ordersList = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (ordersList.length > 0) setOrders(ordersList);

        // Fetch Inquiries from Firestore
        const inqSnap = await getDocs(collection(db, 'inquiries'));
        const inqList = inqSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (inqList.length > 0) setInquiries(inqList);

      } catch (error) {
        console.error("Error fetching settings from Firestore:", error);
      }
    };

    fetchAllSettings();
  }, []);

  const updateSettings = async (newData: any) => {
    try {
      const docRef = doc(db, 'settings', 'store_config');
      await setDoc(docRef, newData, { merge: true });

      if (newData.announcementText !== undefined) setAnnouncementText(newData.announcementText);
      if (newData.storeStatus !== undefined) setStoreStatus(newData.storeStatus);
      if (newData.supportPhone !== undefined) setSupportPhone(newData.supportPhone);
      if (newData.contactEmail !== undefined) setContactEmail(newData.contactEmail);
      if (newData.contactLocation !== undefined) setContactLocation(newData.contactLocation);
      if (newData.contactHours !== undefined) setContactHours(newData.contactHours);
      if (newData.adminUser !== undefined) setAdminUser(newData.adminUser);
      if (newData.adminPass !== undefined) setAdminPass(newData.adminPass);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
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
      adminUser, adminPass, orders, inquiries, updateSettings, updateOrderStatus, deleteOrder, deleteInquiry
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