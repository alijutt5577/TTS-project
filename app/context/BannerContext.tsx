'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface BannerContextType {
  heroBanners: string[];
  mobileHeroBanners: string[];
  poster1: string;
  poster2: string;
  poster3: string;
  updateBanners: (data: any) => Promise<void>;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const BannerProvider = ({ children }: { children: React.ReactNode }) => {
  const [heroBanners, setHeroBanners] = useState<string[]>([]);
  const [mobileHeroBanners, setMobileHeroBanners] = useState<string[]>([]);
  const [poster1, setPoster1] = useState('');
  const [poster2, setPoster2] = useState('');
  const [poster3, setPoster3] = useState('');

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const docRef = doc(db, 'settings', 'store_banners');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.heroBanners) setHeroBanners(data.heroBanners);
          if (data.mobileHeroBanners) setMobileHeroBanners(data.mobileHeroBanners);
          if (data.poster1) setPoster1(data.poster1);
          if (data.poster2) setPoster2(data.poster2);
          if (data.poster3) setPoster3(data.poster3);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  const updateBanners = async (newData: any) => {
    try {
      const docRef = doc(db, 'settings', 'store_banners');
      await setDoc(docRef, newData, { merge: true });
      if (newData.heroBanners) setHeroBanners(newData.heroBanners);
      if (newData.mobileHeroBanners) setMobileHeroBanners(newData.mobileHeroBanners);
      if (newData.poster1 !== undefined) setPoster1(newData.poster1);
      if (newData.poster2 !== undefined) setPoster2(newData.poster2);
      if (newData.poster3 !== undefined) setPoster3(newData.poster3);
    } catch (error) {
      console.error("Error updating banners:", error);
    }
  };

  return (
    <BannerContext.Provider value={{ heroBanners, mobileHeroBanners, poster1, poster2, poster3, updateBanners }}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBanners = () => {
  const context = useContext(BannerContext);
  if (!context) {
    throw new Error('useBanners must be used within a BannerProvider');
  }
  return context;
};