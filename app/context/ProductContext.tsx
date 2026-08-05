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
  limit 
} from 'firebase/firestore';

const ProductContext = createContext<any>(null);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<any[]>([]);

  // Fetch products once on load instead of heavy real-time snapshot
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Limit to first 20 products for fast loading (Pagination can be added later)
        const q = query(collection(db, 'products'), limit(20));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));
        setProducts(items);
      } catch (error) {
        console.error("Error fetching products from Firestore: ", error);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (product: any) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date().toISOString(),
      });
      // Locally update state to avoid reloading
      setProducts(prev => [...prev, { id: docRef.id, ...product }]);
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
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
    } catch (error) {
      console.error("Error updating product: ", error);
      alert('Failed to update product in database.');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
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