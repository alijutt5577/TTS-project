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
  query,
  limit,
  startAfter // Naya import paging ke liye
} from 'firebase/firestore';

const ProductContext = createContext<any>(null);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<any[]>([]);
  
  // Paging ke liye naye states
  const [lastDoc, setLastDoc] = useState<any>(null); // Aakhri product ko yaad rakhne ke liye
  const [hasMore, setHasMore] = useState<boolean>(true); // Check karne ke liye ke mazeed products hain ya nahi
  const [loadingMore, setLoadingMore] = useState<boolean>(false); // Load More button ka loading state

  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        // Pehli dafa sirf 12 products load honge
        const q = query(collection(db, 'products'), limit(12));
        const querySnapshot = await getDocs(q);
        
        const items = querySnapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));

        setProducts(items);

        // Aakhri document ko save kar lein agle page ke liye
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastDoc(lastVisible);

        // Agar 12 se kam products aaye hain, iska matlab mazeed products nahi hain
        if (querySnapshot.docs.length < 12) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching products from Firestore: ", error);
      }
    };

    fetchInitialProducts();
  }, []);

  // 'Load More' button ke liye function
  const loadMoreProducts = async () => {
    if (!lastDoc || !hasMore) return;
    
    setLoadingMore(true);
    try {
      // Pichle aakhri document ke baad se agle 12 products laayein
      const q = query(collection(db, 'products'), startAfter(lastDoc), limit(12));
      const querySnapshot = await getDocs(q);
      
      const nextItems = querySnapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      // Naye products ko purane products ki list mein jod dein
      setProducts((prevProducts) => [...prevProducts, ...nextItems]);

      // Naya aakhri document save karein
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastVisible);

      // Agar mazeed products nahi hain toh Load More band kar dein
      if (querySnapshot.docs.length < 12) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more products: ", error);
    }
    setLoadingMore(false);
  };

  // ... (Baqi addProduct, editProduct, deleteProduct, reduceStock waise hi rahenge) ...

  return (
    <ProductContext.Provider value={{ 
      products, 
      loadMoreProducts, // Naya function provider mein add kiya
      hasMore,          // UI mein button hide/show karne ke liye
      loadingMore,      // Button ka loading state
      // addProduct, editProduct, deleteProduct, reduceStock...
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);