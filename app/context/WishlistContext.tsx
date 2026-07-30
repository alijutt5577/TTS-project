'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistItem {
  id: string;
  name: string;
  price: string;
  image?: string;
  images?: string[];
  category?: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  toggleWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('tts_wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        setWishlist([]);
      }
    }
  }, []);

  const saveWishlistToStorage = (updatedWishlist: WishlistItem[]) => {
    setWishlist(updatedWishlist);
    try {
      localStorage.setItem('tts_wishlist', JSON.stringify(updatedWishlist));
    } catch (error) {
      console.warn('LocalStorage quota exceeded.');
    }
  };

  const toggleWishlist = (product: WishlistItem) => {
    const exists = wishlist.some((item) => item.id === product.id);
    let updatedWishlist;

    // Use exact product image without any wrong poster fallbacks
    const exactImage = product.image || (product.images && product.images[0]) || '';

    if (exists) {
      updatedWishlist = wishlist.filter((item) => item.id !== product.id);
    } else {
      updatedWishlist = [...wishlist, { ...product, image: exactImage }];
    }

    saveWishlistToStorage(updatedWishlist);
  };

  const removeFromWishlist = (id: string) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== id);
    saveWishlistToStorage(updatedWishlist);
  };

  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};