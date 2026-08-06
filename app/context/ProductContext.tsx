'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query 
} from 'firebase/firestore';

const ProductContext = createContext<any>(null);

const saveProductsCache = (items: any[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('cache_products', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save products cache to localStorage:', e);
    }
  }
};

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('cache_products');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });

  const [visibleCount, setVisibleCount] = useState<number>(8);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const q = query(collection(db, 'products'));
        const querySnapshot = await getDocs(q);
        
        const items = querySnapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));

        if (items.length > 0) {
          setProducts(items);
          saveProductsCache(items);
        }
      } catch (error) {
        console.error("Error fetching products from Firestore: ", error);
      }
    };

    fetchAllProducts();
  }, []);

  const loadMoreProducts = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const addProduct = async (product: any) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date().toISOString(),
      });
      
      const newProducts = [
        { id: docRef.id, ...product },
        ...products
      ];
      setProducts(newProducts);
      saveProductsCache(newProducts);
    } catch (error) {
      console.error("Error adding product: ", error);
      alert('Failed to add product to database.');
    }
  };

  const editProduct = async (updatedProduct: any) => {
    try {
      const { id, ...dataToUpdate } = updatedProduct;
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, dataToUpdate);
      const newProducts = products.map(p => p.id === id ? updatedProduct : p);
      setProducts(newProducts);
      saveProductsCache(newProducts);
    } catch (error) {
      console.error("Error updating product: ", error);
      alert('Failed to update product in database.');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      const newProducts = products.filter(p => p.id !== id);
      setProducts(newProducts);
      saveProductsCache(newProducts);
    } catch (error) {
      console.error("Error deleting product: ", error);
      alert('Failed to delete product from database.');
    }
  };

  const reduceStock = async (orderedItems: any[]) => {
    try {
      let updatedProducts = [...products];
      for (const item of orderedItems) {
        const matchingProduct = updatedProducts.find((p) => p.name === item.name || p.id === item.id);
        if (matchingProduct) {
          const currentUnits = parseInt(matchingProduct.units, 10) || 0;
          const orderedQty = parseInt(item.quantity, 10) || 1;
          const newUnits = Math.max(0, currentUnits - orderedQty);
          
          const productRef = doc(db, 'products', matchingProduct.id);
          await updateDoc(productRef, { units: newUnits });

          updatedProducts = updatedProducts.map(p => p.id === matchingProduct.id ? { ...p, units: newUnits } : p);
        }
      }
      setProducts(updatedProducts);
      saveProductsCache(updatedProducts);
    } catch (error) {
      console.error("Error reducing stock: ", error);
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      visibleCount, 
      loadMoreProducts, 
      addProduct, 
      editProduct, 
      deleteProduct, 
      reduceStock 
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);