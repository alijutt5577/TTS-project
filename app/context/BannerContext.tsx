'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface BannerContextType {
  heroBanners: string[];
  mobileHeroBanners: string[];
  ladiesCollection: string;
  kidsFestiveCollection: string;
  newArrivals: string;
  updateBanners: (data: {
    heroBanners: string[];
    mobileHeroBanners: string[];
    ladiesCollection: string;
    kidsFestiveCollection: string;
    newArrivals: string;
  }) => Promise<void>;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const BannerProvider = ({ children }: { children: React.ReactNode }) => {
  const [heroBanners, setHeroBanners] = useState<string[]>(['/herobanners.jpg']);
  const [mobileHeroBanners, setMobileHeroBanners] = useState<string[]>(['/herobanners.jpg']);
  const [ladiesCollection, setLadiesCollection] = useState('/poster1.jpg');
  const [kidsFestiveCollection, setKidsFestiveCollection] = useState('/poster2.jpg');
  const [newArrivals, setNewArrivals] = useState('/poster3.jpg');

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
          if (pData['ladies collection'] && pData['ladies collection'].trim() !== '') {
            setLadiesCollection(pData['ladies collection']);
          }
          if (pData['kids festive collection'] && pData['kids festive collection'].trim() !== '') {
            setKidsFestiveCollection(pData['kids festive collection']);
          }
          if (pData['new arrivals'] && pData['new arrivals'].trim() !== '') {
            setNewArrivals(pData['new arrivals']);
          }
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
    ladiesCollection: string;
    kidsFestiveCollection: string;
    newArrivals: string;
  }) => {
    try {
      await setDoc(doc(db, 'settings', 'store_banners'), {
        heroBanners: data.heroBanners,
        mobileHeroBanners: data.mobileHeroBanners
      }, { merge: true });

      const posterPayload = {
        'ladies collection': data.ladiesCollection || '',
        'kids festive collection': data.kidsFestiveCollection || '',
        'new arrivals': data.newArrivals || '',
      };

      await setDoc(doc(db, 'settings', 'store_posters'), posterPayload, { merge: true });

      setHeroBanners(data.heroBanners);
      setMobileHeroBanners(data.mobileHeroBanners);
      if (data.ladiesCollection) setLadiesCollection(data.ladiesCollection);
      if (data.kidsFestiveCollection) setKidsFestiveCollection(data.kidsFestiveCollection);
      if (data.newArrivals) setNewArrivals(data.newArrivals);
    } catch (error) {
      console.error("Error updating banners/posters:", error);
      throw error;
    }
  };

  return (
    <BannerContext.Provider value={{ heroBanners, mobileHeroBanners, ladiesCollection, kidsFestiveCollection, newArrivals, updateBanners }}>
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