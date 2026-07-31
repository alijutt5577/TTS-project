import type { Metadata } from 'next';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProductProvider } from './context/ProductContext';
import { BannerProvider } from './context/BannerContext';
import { SettingsProvider } from './context/SettingsContext';

export const metadata: Metadata = {
  title: 'TodayTrendShop - Premium Pakistani Suits',
  description: 'Shop luxury unstitched ladies and kids collection.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ProductProvider>
          <BannerProvider>
            <SettingsProvider>
              <CartProvider>
                <WishlistProvider>
                  <Navbar />
                  <main>{children}</main>
                  <Footer />
                </WishlistProvider>
              </CartProvider>
            </SettingsProvider>
          </BannerProvider>
        </ProductProvider>
      </body>
    </html>
  );
}