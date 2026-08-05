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
  startAfter 
} from 'firebase/firestore';

const ProductContext = createContext<any>(null);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        const q = query(collection(db, 'products'), limit(12));
        const querySnapshot = await getDocs(q);
        
        const items = querySnapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));

        setProducts(items);

        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastDoc(lastVisible);

        if (querySnapshot.docs.length < 12) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching products from Firestore: ", error);
      }
    };

    fetchInitialProducts();
  }, []);

  const loadMoreProducts = async () => {
    if (!lastDoc || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const q = query(collection(db, 'products'), startAfter(lastDoc), limit(12));
      const querySnapshot = await getDocs(q);
      
      const nextItems = querySnapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setProducts((prevProducts) => [...prevProducts, ...nextItems]);

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastVisible);

      if (querySnapshot.docs.length < 12) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more products: ", error);
    }
    setLoadingMore(false);
  };

  const addProduct = async (product: any) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date().toISOString(),
      });
      
      // Foran state mein add karein taake admin panel aur home par nazar aaye
      setProducts((prevProducts) => [
        { id: docRef.id, ...product },
        ...prevProducts
      ]);
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
      setProducts((prev) => prev.map(p => p.id === id ? updatedProduct : p));
    } catch (error) {
      console.error("Error updating product: ", error);
      alert('Failed to update product in database.');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts((prev) => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting product: ", error);
      alert('Failed to delete product from database.');
    }
  };

  const reduceStock = async (orderedItems: any[]) => {
    try {
      for (const item of orderedItems) {
        const matchingProduct = products.find((p) => p.name === item.name || p.id === item.id);
        if (matchingProduct) {
          const currentUnits = parseInt(matchingProduct.units, 10) || 0;
          const orderedQty = parseInt(item.quantity, 10) || 1;
          const newUnits = Math.max(0, currentUnits - orderedQty);
          
          const productRef = doc(db, 'products', matchingProduct.id);
          await updateDoc(productRef, { units: newUnits });
        }
      }
    } catch (error) {
      console.error("Error reducing stock: ", error);
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      loadMoreProducts, 
      hasMore, 
      loadingMore, 
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