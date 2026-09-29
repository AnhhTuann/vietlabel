import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingContact } from './FloatingContact';
import { QuoteModal } from '../ui/QuoteModal';

export const Layout: React.FC = () => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(undefined);

  const handleOpenQuote = (product?: string) => {
    setSelectedProduct(product);
    setIsQuoteOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-slate-800 antialiased selection:bg-amber-500 selection:text-white">
      <Header onOpenQuoteModal={handleOpenQuote} />

      <main className="flex-grow">
        <Outlet context={{ onOpenQuoteModal: handleOpenQuote }} />
      </main>

      <Footer />
      <FloatingContact onOpenQuoteModal={() => handleOpenQuote()} />

      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        defaultProduct={selectedProduct}
      />
    </div>
  );
};
