'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot 
} from 'firebase/firestore';

const ProductContext = createContext<any>(null);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<any[]>([]);

  // Real-time synchronization from Firebase Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const items = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));
      setProducts(items);
    }, (error) => {
      console.error("Error fetching products from Firestore: ", error);
    });

    return () => unsubscribe();
  }, []);

  const addProduct = async (product: any) => {
    try {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date().toISOString(),
      });
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
    } catch (error) {
      console.error("Error updating product: ", error);
      alert('Failed to update product in database.');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
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
    <ProductContext.Provider value={{ products, addProduct, editProduct, deleteProduct, reduceStock }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);