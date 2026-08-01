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
  updateBanners: (data: {
    heroBanners: string[];
    mobileHeroBanners: string[];
    poster1: string;
    poster2: string;
    poster3: string;
  }) => Promise<void>;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const BannerProvider = ({ children }: { children: React.ReactNode }) => {
  const [heroBanners, setHeroBanners] = useState<string[]>(['/herobanners.jpg']);
  const [mobileHeroBanners, setMobileHeroBanners] = useState<string[]>(['/herobanners.jpg']);
  const [poster1, setPoster1] = useState('/poster1.jpg');
  const [poster2, setPoster2] = useState('/poster2.jpg');
  const [poster3, setPoster3] = useState('/poster3.jpg');

  useEffect(() => {
    const fetchBannersAndPosters = async () => {
      try {
        const bannerDoc = await getDoc(doc(db, 'settings', 'store_banners'));
        if (bannerDoc.exists()) {
          const data = bannerDoc.data();
          if (data.heroBanners && Array.isArray(data.heroBanners) && data.heroBanners.length > 0) {
            setHeroBanners(data.heroBanners);
          }
          if (data.mobileHeroBanners && Array.isArray(data.mobileHeroBanners) && data.mobileHeroBanners.length > 0) {
            setMobileHeroBanners(data.mobileHeroBanners);
          }
        }

        const posterDoc = await getDoc(doc(db, 'settings', 'store_posters'));
        if (posterDoc.exists()) {
          const pData = posterDoc.data();
          if (pData.poster1 && pData.poster1.trim() !== '') setPoster1(pData.poster1);
          if (pData.poster2 && pData.poster2.trim() !== '') setPoster2(pData.poster2);
          if (pData.poster3 && pData.poster3.trim() !== '') setPoster3(pData.poster3);
        }
      } catch (error) {
        console.error("Error fetching banners/posters:", error);
      }
    };

    fetchBannersAndPosters();
  }, []);

  const updateBanners = async (data: {
    heroBanners: string[];
    mobileHeroBanners: string[];
    poster1: string;
    poster2: string;
    poster3: string;
  }) => {
    try {
      await setDoc(doc(db, 'settings', 'store_banners'), {
        heroBanners: data.heroBanners,
        mobileHeroBanners: data.mobileHeroBanners
      }, { merge: true });

      await setDoc(doc(db, 'settings', 'store_posters'), {
        poster1: data.poster1 || '/poster1.jpg',
        poster2: data.poster2 || '/poster2.jpg',
        poster3: data.poster3 || '/poster3.jpg',
      }, { merge: true });

      setHeroBanners(data.heroBanners);
      setMobileHeroBanners(data.mobileHeroBanners);
      setPoster1(data.poster1 || '/poster1.jpg');
      setPoster2(data.poster2 || '/poster2.jpg');
      setPoster3(data.poster3 || '/poster3.jpg');
    } catch (error) {
      console.error("Error updating banners/posters:", error);
      throw error;
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