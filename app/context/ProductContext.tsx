'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext<any>(null);

// DEMO / HARDCODED PRODUCTS ARE COMPLETELY REMOVED
const defaultProducts: any[] = [];

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('tts_catalog_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProducts(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setProducts([]);
      }
    } else {
      setProducts([]);
      localStorage.setItem('tts_catalog_products', JSON.stringify([]));
    }

    const handleStorage = () => {
      const updated = localStorage.getItem('tts_catalog_products');
      if (updated) {
        try {
          const parsed = JSON.parse(updated);
          if (Array.isArray(parsed)) setProducts(parsed);
        } catch (e) {}
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const saveAndSetProducts = (newProducts: any[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem('tts_catalog_products', JSON.stringify(newProducts));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      alert('Storage Full! Please use smaller images or remove older products.');
    }
  };

  const addProduct = (product: any) => {
    const newProduct = { ...product, id: Date.now().toString() };
    const updated = [newProduct, ...products];
    saveAndSetProducts(updated);
  };

  const editProduct = (updatedProduct: any) => {
    const updated = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    saveAndSetProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveAndSetProducts(updated);
  };

  const reduceStock = (orderedItems: any[]) => {
    let updated = [...products];
    orderedItems.forEach((item) => {
      const index = updated.findIndex((p) => p.name === item.name || p.id === item.id);
      if (index !== -1) {
        const currentUnits = parseInt(updated[index].units, 10) || 0;
        const orderedQty = parseInt(item.quantity, 10) || 1;
        const newUnits = Math.max(0, currentUnits - orderedQty);
        updated[index] = { ...updated[index], units: newUnits };
      }
    });
    saveAndSetProducts(updated);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, editProduct, deleteProduct, reduceStock }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);