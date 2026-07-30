'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image?: string;
  images?: string[];
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('tts_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        setCart([]);
      }
    }
  }, []);

  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    try {
      localStorage.setItem('tts_cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.warn('LocalStorage quota exceeded. Cart updated in memory only.');
    }
  };

  const addToCart = (productToAdd: CartItem) => {
    const existingIndex = cart.findIndex((item) => item.id === productToAdd.id);
    let updatedCart = [...cart];

    // Strictly use the exact product image without any forced wrong fallbacks
    const exactImage = productToAdd.image || (productToAdd.images && productToAdd.images[0]) || '';

    if (existingIndex > -1) {
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: updatedCart[existingIndex].quantity + (productToAdd.quantity || 1),
      };
    } else {
      updatedCart.push({
        ...productToAdd,
        image: exactImage,
        quantity: productToAdd.quantity || 1,
      });
    }

    saveCartToStorage(updatedCart);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    saveCartToStorage(updatedCart);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};