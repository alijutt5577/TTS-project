'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '../context/ProductContext';
import { useBanners } from '../context/BannerContext';
import { useSettings } from '../context/SettingsContext';
import { storage } from '../lib/firebase';
import { ref, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';
import { 
  Plus, Package, ShoppingBag, Trash2, ArrowLeft, Lock, LogOut, 
  DollarSign, TrendingUp, Users, Settings, Megaphone, Upload, Search, Key, Edit3, X, Image as ImageIcon, UserCheck, Headset, MessageSquare, Menu, Loader2
} from 'lucide-react';

export default function AdminDashboard() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const productContext = useProducts() as any;
  const productList = productContext?.products || [];
  const addProduct = productContext?.addProduct || (() => {});
  const deleteProduct = productContext?.deleteProduct || (() => {});
  const editProduct = productContext?.editProduct || (() => {});

  const bannerContext = useBanners() as any;
  const dbHero = bannerContext?.heroBanners || [];
  const dbMobileHero = bannerContext?.mobileHeroBanners || [];
  const dbLadies = bannerContext?.ladiesCollection || '';
  const dbKids = bannerContext?.kidsFestiveCollection || '';
  const dbNewArr = bannerContext?.newArrivals || '';
  const updateBanners = bannerContext?.updateBanners || (async () => {});

  const settingsContext = useSettings() as any;
  const dbAnn = settingsContext?.announcementText || '';
  const dbStatus = settingsContext?.storeStatus ?? true;
  const dbPhone = settingsContext?.supportPhone || '';
  const dbEmail = settingsContext?.contactEmail || '';
  const dbLoc = settingsContext?.contactLocation || '';
  const dbHrs = settingsContext?.contactHours || '';
  const dbUsr = settingsContext?.adminUser || 'admin';
  const dbPwd = settingsContext?.adminPass || 'admin123';
  const dbOrders = settingsContext?.orders || [];
  const dbInq = settingsContext?.inquiries || [];
  const updateSettings = settingsContext?.updateSettings || (async () => {});
  const updateAnnouncement = settingsContext?.updateAnnouncement || (async () => {});
  const updateContactSupport = settingsContext?.updateContactSupport || (async () => {});
  const updateStoreSettings = settingsContext?.updateStoreSettings || (async () => {});
  const updateOrderStatus = settingsContext?.updateOrderStatus || (async () => {});
  const deleteOrder = settingsContext?.deleteOrder || (async () => {});
  const deleteInquiry = settingsContext?.deleteInquiry || (async () => {});

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'add' | 'orders' | 'inquiries' | 'banners' | 'announcement' | 'contact' | 'settings'>('orders');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [announcementText, setAnnouncementText] = useState('FREE SHIPPING NATIONWIDE ❖ 100% UNSTITCHED LUXURY FABRIC');
  const [storeStatus, setStoreStatus] = useState(true);
  const [supportPhone, setSupportPhone] = useState('');
  
  const [contactEmail, setContactEmail] = useState('support@todaytrendshop.com');
  const [contactLocation, setContactLocation] = useState('Faisalabad, Punjab, Pakistan');
  const [contactHours, setContactHours] = useState('24/7 hours');

  const [adminUsername, setAdminUsername] = useState('admin');
  const [newUsername, setNewUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [newPassword, setNewPassword] = useState('');

  const [logoType, setLogoTextOrImg] = useState<'text' | 'image'>('text');
  const [logoText, setLogoText] = useState('TTS');
  const [logoImage, setLogoImage] = useState('');
  const [logoSize, setLogoSize] = useState('55');
  
  const [heroBanners, setHeroBanners] = useState<string[]>(['/herobanners.jpg']);
  const [mobileHeroBanners, setMobileHeroBanners] = useState<string[]>(['/herobanners.jpg']);
  const [ladiesCollection, setLadiesCollection] = useState('');
  const [kidsFestiveCollection, setKidsFestiveCollection] = useState('');
  const [newArrivals, setNewArrivals] = useState('');

  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductUnits, setNewProductUnits] = useState('10');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['New Arrivals']);
  const [imagePreviews, setImagePreviews] = useState<string[]>(['/poster1.jpg']);

  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editUnits, setEditUnits] = useState('10');
  const [editCategories, setEditCategories] = useState<string[]>([]);
  const [editImages, setEditImages] = useState<string[]>([]);

  useEffect(() => {
    if (dbHero && dbHero.length > 0) setHeroBanners(dbHero);
    if (dbMobileHero && dbMobileHero.length > 0) setMobileHeroBanners(dbMobileHero);
    if (dbLadies) setLadiesCollection(dbLadies);
    if (dbKids) setKidsFestiveCollection(dbKids);
    if (dbNewArr) setNewArrivals(dbNewArr);
  }, [dbHero, dbMobileHero, dbLadies, dbKids, dbNewArr]);

  useEffect(() => {
    if (dbAnn) setAnnouncementText(dbAnn);
    if (dbStatus !== undefined) setStoreStatus(dbStatus);
    if (dbPhone !== undefined) setSupportPhone(dbPhone);
    if (dbEmail) setContactEmail(dbEmail);
    if (dbLoc) setContactLocation(dbLoc);
    if (dbHrs) setContactHours(dbHrs);
    if (dbUsr) setAdminUsername(dbUsr);
    if (dbPwd) setAdminPassword(dbPwd);
  }, [dbAnn, dbStatus, dbPhone, dbEmail, dbLoc, dbHrs, dbUsr, dbPwd]);

  if (!isMounted) {
    return <div className="min-h-screen bg-[#181818]" />;
  }

  const compressImage = (file: File, maxWidth = 1200, quality = 0.75): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const [isUploading, setIsUploading] = useState(false);

  const uploadToStorage = async (dataOrFile: string | File, folder = 'banners'): Promise<string> => {
    if (typeof dataOrFile === 'string') {
      if (!dataOrFile.startsWith('data:')) {
        return dataOrFile;
      }
      try {
        const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
        const storageRef = ref(storage, fileName);
        const snapshot = await uploadString(storageRef, dataOrFile, 'data_url');
        return await getDownloadURL(snapshot.ref);
      } catch (err) {
        console.warn('Firebase Storage upload warning, using compressed fallback:', err);
        return dataOrFile;
      }
    } else {
      try {
        const fileExt = dataOrFile.name.split('.').pop() || 'jpg';
        const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const storageRef = ref(storage, fileName);
        const snapshot = await uploadBytes(storageRef, dataOrFile);
        return await getDownloadURL(snapshot.ref);
      } catch (err) {
        console.warn('Firebase Storage upload warning:', err);
        return await compressImage(dataOrFile);
      }
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to delete this customer order?')) {
      await deleteOrder(orderId);
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      await deleteInquiry(inquiryId);
    }
  };

  const handleSaveAnnouncement = async () => {
    if (updateAnnouncement) await updateAnnouncement(announcementText);
    await updateSettings({ announcementText });
    alert('Announcement ticker updated & saved to Firestore Database LIVE!');
  };

  const handleSaveContactDetails = async () => {
    if (updateContactSupport) {
      await updateContactSupport({ supportPhone, contactEmail, contactLocation, contactHours });
    }
    await updateSettings({ supportPhone, contactEmail, contactLocation, contactHours });
    alert('Contact Support Details updated & saved to Firestore Database LIVE!');
  };

  const handleSaveBanners = async () => {
    setIsUploading(true);
    try {
      const finalHeroBanners = await Promise.all(
        heroBanners.map(b => uploadToStorage(b, 'hero_banners'))
      );
      const finalMobileHeroBanners = await Promise.all(
        mobileHeroBanners.map(b => uploadToStorage(b, 'mobile_hero_banners'))
      );
      const finalLadies = await uploadToStorage(ladiesCollection, 'posters');
      const finalKids = await uploadToStorage(kidsFestiveCollection, 'posters');
      const finalNewArr = await uploadToStorage(newArrivals, 'posters');

      await updateBanners({
        heroBanners: finalHeroBanners,
        mobileHeroBanners: finalMobileHeroBanners,
        ladiesCollection: finalLadies,
        kidsFestiveCollection: finalKids,
        newArrivals: finalNewArr
      });

      setHeroBanners(finalHeroBanners);
      setMobileHeroBanners(finalMobileHeroBanners);
      setLadiesCollection(finalLadies);
      setKidsFestiveCollection(finalKids);
      setNewArrivals(finalNewArr);

      alert('All Banners uploaded to Firebase Storage & URLs saved to Firestore LIVE!');
    } catch (error) {
      console.error("Banner update error:", error);
      alert('Error updating banners. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleMultipleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      try {
        const uploadedUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const compressed = await compressImage(files[i], 1200, 0.75);
          const storageUrl = await uploadToStorage(compressed, 'hero_banners');
          uploadedUrls.push(storageUrl);
        }
        setHeroBanners(prev => [...prev, ...uploadedUrls]);
      } catch (err) {
        console.error('Failed uploading hero banners:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleMultipleMobileHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      try {
        const uploadedUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const compressed = await compressImage(files[i], 800, 0.72);
          const storageUrl = await uploadToStorage(compressed, 'mobile_hero_banners');
          uploadedUrls.push(storageUrl);
        }
        setMobileHeroBanners(prev => [...prev, ...uploadedUrls]);
      } catch (err) {
        console.error('Failed uploading mobile hero banners:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveHeroBanner = (index: number) => {
    if (heroBanners.length <= 1) {
      alert('At least one Hero Banner is required!');
      return;
    }
    setHeroBanners(heroBanners.filter((_, idx) => idx !== index));
  };

  const handleRemoveMobileHeroBanner = (index: number) => {
    if (mobileHeroBanners.length <= 1) {
      alert('At least one Mobile Hero Banner is required!');
      return;
    }
    setMobileHeroBanners(mobileHeroBanners.filter((_, idx) => idx !== index));
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>, setFunction: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const compressed = await compressImage(file, 1000, 0.75);
        const storageUrl = await uploadToStorage(compressed, 'posters');
        setFunction(storageUrl);
      } catch (err) {
        console.error('Failed uploading banner poster:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveSettings = async () => {
    let updatePayload: any = { supportPhone, storeStatus };
    let alertMsg = 'Store settings updated successfully!';

    if (newUsername.trim() !== '') {
      updatePayload.adminUser = newUsername.trim();
      setAdminUsername(newUsername.trim());
      setNewUsername('');
      alertMsg = 'Admin Credentials updated successfully!';
    }

    if (newPassword.trim() !== '') {
      updatePayload.adminPass = newPassword.trim();
      setAdminPassword(newPassword.trim());
      setNewPassword('');
      alertMsg = 'Admin Credentials updated successfully!';
    }

    if (updateStoreSettings) await updateStoreSettings(updatePayload);
    await updateSettings(updatePayload);
    alert(alertMsg);
  };

  const handleCategoryToggle = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length === 1) {
        alert('At least one category must be selected!');
        return;
      }
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleEditCategoryToggle = (cat: string) => {
    if (editCategories.includes(cat)) {
      if (editCategories.length === 1) {
        alert('At least one category must be selected!');
        return;
      }
      setEditCategories(editCategories.filter(c => c !== cat));
    } else {
      setEditCategories([...editCategories, cat]);
    }
  };

  const handleMultipleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressed = await compressImage(files[i], 1200, 0.85);
        newImages.push(compressed);
      }
      setImagePreviews((prev) => [...prev.filter(img => img !== '/poster1.jpg'), ...newImages]);
    }
  };

  const handleEditMultipleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressed = await compressImage(files[i], 1200, 0.85);
        newImages.push(compressed);
      }
      setEditImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleOpenEditModal = (product: any) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditUnits(product.units !== undefined ? String(product.units) : '10');
  
    if (product.images && Array.isArray(product.images)) {
      setEditImages(product.images);
    } else if (product.image) {
      setEditImages([product.image]);
    } else {
      setEditImages(['/poster1.jpg']);
    }

    if (product.category) {
      const splitCats = product.category.split(',').map((c: string) => c.trim());
      setEditCategories(splitCats);
    } else {
      setEditCategories(['New Arrivals']);
    }
  };

  const handleSaveEditedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName || !editPrice) {
      alert('Please fill all fields!');
      return;
    }

    const updatedData = {
      ...editingProduct,
      name: editName,
      price: editPrice.startsWith('PKR') ? editPrice : `PKR ${editPrice}`,
      units: parseInt(editUnits) || 0,
      category: editCategories.join(', '),
      image: editImages[0] || '/poster1.jpg',
      images: editImages,
    };

    if (typeof editProduct === 'function') {
      editProduct(updatedData);
    } else {
      deleteProduct(editingProduct.id);
      addProduct(updatedData);
    }

    alert('Product updated successfully!');
    setEditingProduct(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (loginEmail === adminUsername || loginEmail === 'admin@todaytrendshop.com') &&
      loginPassword === adminPassword
    ) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Username or Password!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginEmail('');
    setLoginPassword('');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) {
      alert('Please fill all fields!');
      return;
    }

    addProduct({
      name: newProductName,
      price: newProductPrice.startsWith('PKR') ? newProductPrice : `PKR ${newProductPrice}`,
      units: parseInt(newProductUnits) || 10,
      category: selectedCategories.join(', '),
      image: imagePreviews[0] || '/poster1.jpg',
      images: imagePreviews,
    });

    alert('Product added & LIVE on website!');
    setNewProductName('');
    setNewProductPrice('');
    setNewProductUnits('10');
    setSelectedCategories(['New Arrivals']);
    setImagePreviews(['/poster1.jpg']);
    setActiveTab('products');
  };

  const filteredCatalog = productList.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = dbOrders.reduce((sum: number, o: any) => {
    const priceNum = parseInt(o.total?.replace(/[^0-9]/g, '') || '0', 10) || 0;
    return sum + priceNum;
  }, 0);

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#181818] text-white flex items-center justify-center p-4">
        <div className="bg-[#242424] w-full max-w-md rounded-2xl p-8 border border-stone-800 shadow-2xl relative">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-amber-900/40 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl tracking-widest uppercase italic text-amber-500">
              TTS Admin Panel
            </h1>
            <p className="text-stone-400 text-xs mt-1">Enter credentials to access store control</p>
          </div>

          {loginError && (
            <div className="bg-red-900/40 border border-red-700 text-red-200 text-xs p-3 rounded mb-4 text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest font-semibold text-stone-300 mb-1">
                Username / Email
              </label>
              <input
                type="text"
                required
                placeholder="admin"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest font-semibold text-stone-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-800 hover:bg-amber-700 text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded transition shadow-md mt-2 cursor-pointer"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-stone-500 hover:text-stone-300 text-xs underline transition">
              ← Return to Main Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F6F0] text-stone-900 flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* MOBILE TOP HEADER BAR */}
      <div className="md:hidden bg-[#181818] text-white px-4 py-3 flex items-center justify-between shrink-0 border-b border-stone-800 z-30">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="text-white p-1 hover:text-amber-500 transition cursor-pointer"
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif text-lg tracking-widest italic text-amber-500">TTS Control</span>
        </div>
        <Link href="/" className="text-stone-400 hover:text-white transition text-xs flex items-center space-x-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Shop</span>
        </Link>
      </div>

      {/* SIDEBAR OVERLAY FOR MOBILE */}
      {isMobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside className={`fixed md:relative top-0 left-0 w-72 md:w-64 bg-[#181818] text-white p-6 flex flex-col justify-between shrink-0 h-full z-50 transition-transform duration-300 ease-in-out ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div>
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-2xl tracking-widest italic text-amber-500">TTS Control</h1>
            <div className="flex items-center space-x-2">
              <button onClick={() => setIsMobileSidebarOpen(false)} className="md:hidden text-stone-400 hover:text-white p-1">
                <X className="w-6 h-6" />
              </button>
              <Link href="/" className="hidden md:block text-stone-400 hover:text-white transition p-1" title="Back to Shop">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            <button
              onClick={() => { setActiveTab('dashboard'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-amber-900 text-white' : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => { setActiveTab('products'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'products' ? 'bg-amber-900 text-white' : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products ({productList.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('add'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'add' ? 'bg-amber-900 text-white' : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>

            <button
              onClick={() => { setActiveTab('orders'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'orders' ? 'bg-amber-900 text-white' : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders ({dbOrders.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('inquiries'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'inquiries' ? 'bg-amber-900 text-white' : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquiries ({dbInq.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('banners'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'banners' ? 'bg-amber-900 text-white' : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Logo & Banners</span>
            </button>

            <button
              onClick={() => { setActiveTab('announcement'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'announcement' ? 'bg-amber-900 text-white' : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Announcement Bar</span>
            </button>

            <button
              onClick={() => { setActiveTab('contact'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'contact' ? 'bg-amber-900 text-white' : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Headset className="w-4 h-4" />
              <span>Contact Support</span>
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'settings' ? 'bg-amber-900 text-white' : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Store Settings</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-stone-800 flex items-center justify-between">
          <span className="text-[10px] text-stone-500 uppercase tracking-widest">Admin Online</span>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 text-xs flex items-center space-x-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-full">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="border-b border-stone-300 pb-4">
              <h2 className="font-serif text-2xl font-semibold tracking-wide">Store Analytics Overview</h2>
              <p className="text-xs text-stone-500">Live metrics and performance summary</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-amber-100 text-amber-900 rounded-lg">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-500">Total Sales Value</p>
                  <h3 className="text-xl font-bold text-stone-900 mt-1">PKR {totalRevenue.toLocaleString()}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-blue-100 text-blue-900 rounded-lg">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-500">Total Orders</p>
                  <h3 className="text-xl font-bold text-stone-900 mt-1">{dbOrders.length}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-purple-100 text-purple-900 rounded-lg">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-500">Active Dresses</p>
                  <h3 className="text-xl font-bold text-stone-900 mt-1">{productList.length}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-green-100 text-green-900 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-500">Store Status</p>
                  <h3 className="text-sm font-bold text-green-700 mt-1">{storeStatus ? 'Online & Active' : 'Maintenance Mode'}</h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: INQUIRIES MANAGEMENT */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="border-b border-stone-300 pb-4">
              <h2 className="font-serif text-2xl font-semibold tracking-wide">Customer Contact Inquiries</h2>
              <p className="text-xs text-stone-500">View and respond to inquiries submitted via Contact Us form</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              {dbInq.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500 uppercase tracking-widest">
                  No customer inquiries received yet.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-100 text-[10px] font-bold uppercase tracking-wider text-stone-600 border-b border-stone-200">
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Subject & Order ID</th>
                      <th className="p-4">Message</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-xs text-stone-800">
                    {dbInq.map((iq: any) => (
                      <tr key={iq.id} className="hover:bg-stone-50">
                        <td className="p-4 font-mono text-[11px] text-stone-500">{iq.date}</td>
                        <td className="p-4">
                          <p className="font-semibold text-stone-900">{iq.name}</p>
                          <p className="text-[10px] text-amber-900 font-medium">{iq.phone}</p>
                        </td>
                        <td className="p-4">
                          <span className="bg-stone-100 px-2 py-0.5 rounded text-[10px] font-bold text-stone-700 block w-max">
                            {iq.subject}
                          </span>
                          <p className="text-[10px] text-stone-400 mt-1">Ref Order: {iq.orderId || 'N/A'}</p>
                        </td>
                        <td className="p-4 max-w-xs text-stone-700 leading-relaxed">
                          {iq.message}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleDeleteInquiry(iq.id)}
                            className="text-stone-400 hover:text-red-600 transition p-1.5 cursor-pointer"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB: LOGO, MULTI HERO BANNERS & POSTERS MANAGER */}
        {activeTab === 'banners' && (
          <div className="max-w-3xl bg-white rounded-xl border border-stone-200 p-6 md:p-8 shadow-sm space-y-6">
            <div className="border-b border-stone-200 pb-3">
              <h2 className="font-serif text-2xl font-semibold">Store Logo & Banners Manager</h2>
              <p className="text-xs text-stone-500">Update website Header Logo, Hero Banner Slider and Collection Posters</p>
            </div>

            <div className="space-y-4 border-b border-stone-200 pb-6">
              <h4 className="text-xs uppercase font-bold text-amber-900 tracking-wider">Website Header Brand Logo</h4>
  
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="logoType"
                    checked={logoType === 'text'}
                    onChange={() => setLogoTextOrImg('text')}
                  />
                  <span>Text Logo</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="logoType"
                    checked={logoType === 'image'}
                    onChange={() => setLogoTextOrImg('image')}
                  />
                  <span>Image Photo Logo</span>
                </label>
              </div>

              {logoType === 'text' ? (
                <div>
                  <label className="block text-[11px] uppercase font-semibold text-stone-700 mb-1">Logo Text Name</label>
                  <input
                    type="text"
                    value={logoText}
                    onChange={(e) => setLogoText(e.target.value)}
                    placeholder="e.g. TODAYTRENDSHOP"
                    className="w-full border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-800"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="flex-1 border-2 border-dashed border-stone-300 hover:border-stone-800 rounded-lg p-3 text-center cursor-pointer bg-stone-50 hover:bg-stone-100 transition">
                      <span className="text-xs font-semibold text-stone-700">Click to Select Logo Image</span>
                      <input type="file" accept="image/*" onChange={(e) => handleBannerUpload(e, setLogoImage)} className="hidden" />
                    </label>
                    {logoImage && (
                      <div className="relative rounded overflow-hidden border bg-stone-100 shrink-0 p-1 flex items-center justify-center min-w-[100px]" style={{ height: `${logoSize}px` }}>
                        <Image src={logoImage} alt="Logo Preview" fill className="object-contain" />
                      </div>
                    )}
                  </div>

                  <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] uppercase font-bold text-stone-700">
                        Adjust Logo Size (Height)
                      </label>
                      <span className="text-xs font-mono font-bold text-amber-900">{logoSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="120"
                      value={logoSize}
                      onChange={(e) => setLogoSize(e.target.value)}
                      className="w-full accent-amber-900 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* MULTI HERO SLIDER BANNERS (DESKTOP) */}
            <div className="space-y-3 border-b border-stone-200 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs uppercase font-bold text-stone-800">
                    💻 Desktop Hero Slider Banners ({heroBanners.length})
                  </label>
                  <p className="text-[10px] text-stone-500">Upload widescreen banners for desktop screens</p>
                </div>
              </div>

              <label className="border-2 border-dashed border-stone-300 hover:border-stone-800 rounded-lg p-4 text-center cursor-pointer bg-stone-50 hover:bg-stone-100 transition block">
                <Upload className="w-5 h-5 text-stone-500 mx-auto mb-1" />
                <span className="text-xs font-semibold text-stone-700">Click to Select & Add Desktop Hero Banners</span>
                <input type="file" accept="image/*" multiple onChange={handleMultipleHeroUpload} className="hidden" />
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                {heroBanners.map((banner, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden border border-stone-300 bg-stone-100 h-24">
                    <Image src={banner} alt={`Desktop Banner ${index + 1}`} fill className="object-cover" />
                    <span className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHeroBanner(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition cursor-pointer"
                      title="Remove Banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* MULTI MOBILE HERO SLIDER BANNERS */}
            <div className="space-y-3 border-b border-stone-200 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs uppercase font-bold text-amber-900">
                    📱 Mobile Responsive Hero Banners ({mobileHeroBanners.length})
                  </label>
                  <p className="text-[10px] text-stone-500">Upload separate portrait banners optimized for mobile screens (e.g. 1080x1350)</p>
                </div>
              </div>

              <label className="border-2 border-dashed border-stone-300 hover:border-stone-800 rounded-lg p-4 text-center cursor-pointer bg-stone-50 hover:bg-stone-100 transition block">
                <Upload className="w-5 h-5 text-stone-500 mx-auto mb-1" />
                <span className="text-xs font-semibold text-stone-700">Click to Select & Add Mobile Hero Banners</span>
                <input type="file" accept="image/*" multiple onChange={handleMultipleMobileHeroUpload} className="hidden" />
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                {mobileHeroBanners.map((banner, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden border border-stone-300 bg-stone-100 h-28">
                    <Image src={banner} alt={`Mobile Banner ${index + 1}`} fill className="object-cover" />
                    <span className="absolute top-1 left-1 bg-amber-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Mobile #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMobileHeroBanner(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition cursor-pointer"
                      title="Remove Mobile Banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* COLLECTION POSTERS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-[11px] uppercase font-bold text-stone-800 mb-1">Ladies Collection Poster</label>
                <label className="border border-dashed border-stone-300 rounded-lg p-3 text-center cursor-pointer bg-stone-50 hover:bg-stone-100 block mb-2">
                  <span className="text-[10px] font-semibold text-stone-700">Upload Photo</span>
                  <input type="file" accept="image/*" onChange={(e) => handleBannerUpload(e, setLadiesCollection)} className="hidden" />
                </label>
                <div className="relative w-full h-36 rounded-lg overflow-hidden border bg-stone-200">
                  {ladiesCollection ? (
                    <Image src={ladiesCollection} alt="Ladies Poster" fill className="object-cover object-top" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-stone-400">No Image</div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-stone-800 mb-1">Kids Festive Poster</label>
                <label className="border border-dashed border-stone-300 rounded-lg p-3 text-center cursor-pointer bg-stone-50 hover:bg-stone-100 block mb-2">
                  <span className="text-[10px] font-semibold text-stone-700">Upload Photo</span>
                  <input type="file" accept="image/*" onChange={(e) => handleBannerUpload(e, setKidsFestiveCollection)} className="hidden" />
                </label>
                <div className="relative w-full h-36 rounded-lg overflow-hidden border bg-stone-200">
                  {kidsFestiveCollection ? (
                    <Image src={kidsFestiveCollection} alt="Kids Poster" fill className="object-cover object-top" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-stone-400">No Image</div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-stone-800 mb-1">New Arrivals Poster</label>
                <label className="border border-dashed border-stone-300 rounded-lg p-3 text-center cursor-pointer bg-stone-50 hover:bg-stone-100 block mb-2">
                  <span className="text-[10px] font-semibold text-stone-700">Upload Photo</span>
                  <input type="file" accept="image/*" onChange={(e) => handleBannerUpload(e, setNewArrivals)} className="hidden" />
                </label>
                <div className="relative w-full h-36 rounded-lg overflow-hidden border bg-stone-200">
                  {newArrivals ? (
                    <Image src={newArrivals} alt="New Arrivals Poster" fill className="object-cover object-top" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-stone-400">No Image</div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveBanners}
              disabled={isUploading}
              className="bg-[#3D2B1F] hover:bg-[#2A1D14] text-white text-xs uppercase tracking-widest font-semibold py-3.5 px-6 rounded transition shadow cursor-pointer mt-4 flex items-center gap-2 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading to Firebase Storage & Saving...
                </>
              ) : (
                'Save Logo & All Banners to Database'
              )}
            </button>
          </div>
        )}

        {/* TAB: CONTACT SUPPORT EDIT PAGE */}
        {activeTab === 'contact' && (
          <div className="max-w-xl bg-white rounded-xl border border-stone-200 p-6 md:p-8 shadow-sm space-y-6">
            <div className="border-b border-stone-200 pb-3">
              <h2 className="font-serif text-2xl font-semibold">Contact Support Page Details</h2>
              <p className="text-xs text-stone-500">Edit contact cards & details shown on Contact Us page</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                  WhatsApp Support Phone Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 03210000000"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                  Support Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. support@todaytrendshop.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                  Main Location / Outlet Address *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lahore, Punjab, Pakistan"
                  value={contactLocation}
                  onChange={(e) => setContactLocation(e.target.value)}
                  className="w-full border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                  Working Hours / Days *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Monday – Saturday (10:00 AM – 8:00 PM PKT)"
                  value={contactHours}
                  onChange={(e) => setContactHours(e.target.value)}
                  className="w-full border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-800"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveContactDetails}
              className="bg-[#3D2B1F] hover:bg-[#2A1D14] text-white text-xs uppercase tracking-widest font-semibold py-3.5 px-6 rounded transition shadow cursor-pointer"
            >
              Save Contact Page Details
            </button>
          </div>
        )}

        {/* PRODUCTS CATALOG TAB WITH SOLD OUT BADGE */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-stone-300 pb-4 gap-4">
              <div>
                <h2 className="font-serif text-2xl font-semibold tracking-wide">Products Catalog</h2>
                <p className="text-xs text-stone-500">Search, edit or remove catalog dresses</p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3" />
                  <input
                    type="text"
                    placeholder="Search dress..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-stone-800"
                  />
                </div>

                <button
                  onClick={() => setActiveTab('add')}
                  className="bg-[#3D2B1F] hover:bg-[#2A1D14] text-white text-xs font-semibold uppercase tracking-widest px-4 py-2.5 rounded shadow flex items-center space-x-2 transition cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCatalog.map((product: any) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-14 h-16 rounded overflow-hidden bg-stone-100 shrink-0">
                      <Image src={product.image} alt={product.name} fill className="object-cover object-top" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-amber-800 uppercase tracking-widest">{product.category}</span>
                      <h4 className="font-serif text-xs font-semibold text-stone-900 line-clamp-1">{product.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs font-bold text-stone-800">{product.price}</p>
  
                        {product.units === 0 || product.units === '0' ? (
                          <span className="text-[9px] bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            Sold Out
                          </span>
                        ) : (
                          <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-600 font-medium">
                            Units: {product.units !== undefined ? product.units : 10}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="text-stone-400 hover:text-amber-800 transition p-2 cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-stone-400 hover:text-red-600 transition p-2 cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDIT PRODUCT MODAL */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl relative border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="font-serif text-lg font-semibold text-stone-900">Edit Product Details</h3>
                <button 
                  onClick={() => setEditingProduct(null)}
                  className="text-stone-400 hover:text-stone-800 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditedProduct} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-stone-700 mb-1">Dress Title *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-stone-700 mb-1">Price (PKR) *</label>
                    <input
                      type="text"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-semibold text-stone-700 mb-1">Stock Units *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editUnits}
                      onChange={(e) => setEditUnits(e.target.value)}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-stone-700 mb-2">Category *</label>
                  <div className="flex flex-wrap gap-2">
                    {['New Arrivals', 'Ladies', 'Kids', 'Best Sellers'].map((cat) => (
                      <label
                        key={cat}
                        className={`px-3 py-1.5 rounded border text-xs font-semibold cursor-pointer transition ${
                          editCategories.includes(cat)
                            ? 'bg-[#3D2B1F] text-white border-[#3D2B1F]'
                            : 'bg-stone-50 text-stone-700 border-stone-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={editCategories.includes(cat)}
                          onChange={() => handleEditCategoryToggle(cat)}
                          className="hidden"
                        />
                        <span>{editCategories.includes(cat) ? '✓ ' : ''}{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-stone-700 mb-1">Product Gallery Photos (Multiple)</label>
                  <label className="border border-dashed border-stone-300 p-3 rounded block text-center cursor-pointer text-xs font-semibold bg-stone-50 hover:bg-stone-100 mb-2">
                    Click to Upload More Photos
                    <input type="file" accept="image/*" multiple onChange={handleEditMultipleImageChange} className="hidden" />
                  </label>
  
                  <div className="flex flex-wrap gap-2">
                    {editImages.map((img, idx) => (
                      <div key={idx} className="relative w-14 h-16 rounded overflow-hidden border bg-stone-100">
                        <Image src={img} alt={`Preview ${idx}`} fill className="object-cover object-top" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 border border-stone-300 rounded text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#3D2B1F] text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#2A1D14] transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ADD PRODUCT FORM */}
        {activeTab === 'add' && (
          <div className="max-w-2xl bg-[#ffffff] rounded-xl shadow-sm border border-stone-200 p-6 md:p-8 space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h2 className="font-serif text-2xl font-semibold tracking-wide">Add New Luxury Dress</h2>
              <p className="text-xs text-stone-500">Fill in dress details to list on website</p>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">Dress Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Embroidered Lawn 3-Piece"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full border border-stone-300 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-stone-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">Price (PKR) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6990"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full border border-stone-300 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 15"
                    value={newProductUnits}
                    onChange={(e) => setNewProductUnits(e.target.value)}
                    className="w-full border border-stone-300 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-stone-800"
                  />
                </div>
              </div>

              {/* MULTI-SELECT CATEGORIES */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">
                  Category (Select Multiple) *
                </label>
                <div className="flex flex-wrap gap-3">
                  {['New Arrivals', 'Ladies', 'Kids', 'Best Sellers'].map((cat) => (
                    <label
                      key={cat}
                      className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition ${
                        selectedCategories.includes(cat)
                          ? 'bg-[#3D2B1F] text-white border-[#3D2B1F]'
                          : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                        className="hidden"
                      />
                      <span>{selectedCategories.includes(cat) ? '✓ ' : ''}{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* MULTIPLE IMAGES UPLOAD */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                  Product Gallery Photos (Multiple Select) *
                </label>
  
                <div className="space-y-3 pt-1">
                  <label className="border-2 border-dashed border-stone-300 hover:border-stone-800 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer bg-stone-50 hover:bg-stone-100 transition">
                    <Upload className="w-6 h-6 text-stone-500 mb-1" />
                    <span className="text-xs font-semibold text-stone-700">Click to Select Multiple Photos from Gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleImageChange}
                      className="hidden"
                    />
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {imagePreviews.map((img, index) => (
                      <div key={index} className="relative w-16 h-20 rounded-lg overflow-hidden border border-stone-300 bg-stone-200 shrink-0">
                        <Image
                          src={img}
                          alt={`Preview ${index}`}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#3D2B1F] hover:bg-[#2A1D14] text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded transition shadow-md mt-6 cursor-pointer"
              >
                Save & List Product
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: ORDERS MANAGEMENT WITH PRODUCT THUMBNAILS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="border-b border-stone-300 pb-4">
              <h2 className="font-serif text-2xl font-semibold tracking-wide">Customer Orders & Deliveries</h2>
              <p className="text-xs text-stone-500">Track and update customer order status</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-[10px] font-bold uppercase tracking-wider text-stone-600 border-b border-stone-200">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Ordered Items</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-xs text-stone-800">
                  {dbOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-stone-50">
                      <td className="p-4 font-mono font-bold text-amber-900">{order.id}</td>
                      <td className="p-4">
                        <p className="font-semibold">{order.customer}</p>
                        <p className="text-[10px] text-stone-500">{order.phone} • {order.city}</p>
                        <p className="text-[10px] text-stone-400 italic mt-0.5">{order.address}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col space-y-2">
                          {order.itemDetails && Array.isArray(order.itemDetails) ? (
                            order.itemDetails.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <div className="relative w-10 h-12 rounded overflow-hidden bg-stone-100 border shrink-0">
                                  <Image
                                    src={item.image || '/poster1.jpg'}
                                    alt={item.name}
                                    fill
                                    className="object-cover object-top"
                                  />
                                </div>
                                <span className="text-xs text-stone-800 font-medium">
                                  {item.name} <span className="font-bold text-amber-900">(x{item.quantity})</span>
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-stone-700 font-medium">{order.items}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-stone-900">{order.total}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded border focus:outline-none cursor-pointer ${
                              order.status === 'New' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                              order.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                              order.status === 'Dispatched' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800 border-green-300' :
                              'bg-red-100 text-red-800 border-red-300'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Pending">Pending</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-stone-400 hover:text-red-600 transition p-1.5 cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ANNOUNCEMENT BAR */}
        {activeTab === 'announcement' && (
          <div className="max-w-xl bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="border-b border-stone-200 pb-3">
              <h2 className="font-serif text-xl font-semibold">Top Announcement Ticker</h2>
              <p className="text-xs text-stone-500">Change moving header announcement text</p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">Ticker Text *</label>
              <textarea
                rows={3}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full border border-stone-300 rounded p-3 text-xs focus:outline-none focus:border-stone-800"
              />
            </div>

            <button
              onClick={handleSaveAnnouncement}
              className="bg-[#3D2B1F] hover:bg-[#2A1D14] text-white text-xs uppercase tracking-widest font-semibold py-3 px-6 rounded transition shadow cursor-pointer"
            >
              Save Announcement
            </button>
          </div>
        )}

        {/* TAB 6: STORE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-xl bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-6">
            <div className="border-b border-stone-200 pb-3">
              <h2 className="font-serif text-xl font-semibold">Store Settings & Security</h2>
              <p className="text-xs text-stone-500">Configure core parameters and credentials</p>
            </div>

            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h4 className="text-xs font-bold uppercase">Store Online Status</h4>
                <p className="text-[10px] text-stone-500">Toggle whether customer checkout is open</p>
              </div>
              <button
                type="button"
                onClick={() => setStoreStatus(!storeStatus)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  storeStatus ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                {storeStatus ? 'Active' : 'Disabled'}
              </button>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                Support WhatsApp Number
              </label>
              <input
                type="text"
                placeholder="Leave blank to disable WhatsApp button"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-800"
              />
            </div>

            <div className="pt-2 border-t border-stone-100 space-y-4">
              <div className="flex items-center space-x-2 text-amber-900">
                <UserCheck className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase">Change Admin Username</h4>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-medium text-stone-600 mb-1">
                  New Admin Username / Email (Current: <span className="font-bold text-stone-800">{adminUsername}</span>)
                </label>
                <input
                  type="text"
                  placeholder="Enter new username (leave empty to keep current)"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-800"
                />
              </div>

              <div className="flex items-center space-x-2 text-amber-900 pt-2">
                <Key className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase">Change Admin Password</h4>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-medium text-stone-600 mb-1">
                  New Admin Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password (leave empty to keep current)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-800"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveSettings}
              className="bg-[#3D2B1F] hover:bg-[#2A1D14] text-white text-xs uppercase tracking-widest font-semibold py-3 px-6 rounded transition shadow cursor-pointer"
            >
              Save All Settings
            </button>
          </div>
        )}

      </main>
    </div>
  );
}