import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ChatWidget } from '../chat/ChatWidget';
import { MobileBottomNav } from './MobileBottomNav';
import { QuoteModal } from '../ui/QuoteModal';

export const Layout: React.FC = () => {
  const location = useLocation();
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      return;
    }

    const sections = document.querySelectorAll<HTMLElement>(
      'main section:not([data-scroll-reveal="off"])'
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target as HTMLElement;
            section.dataset.scrollReveal = 'visible';
            observer.unobserve(section);
          }
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px -40px 0px' }
    );

    sections.forEach((section) => {
      section.dataset.scrollReveal = 'pending';
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
      sections.forEach((section) => {
        delete section.dataset.scrollReveal;
      });
    };
  }, [location.pathname]);

  const handleOpenQuote = (product?: string) => {
    setSelectedProduct(product);
    setIsQuoteOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-slate-800 antialiased selection:bg-amber-500 selection:text-white pb-16 md:pb-0">
      <Header onOpenQuoteModal={handleOpenQuote} />

      <main className="flex-grow">
        <Outlet context={{ onOpenQuoteModal: handleOpenQuote }} />
      </main>

      <Footer />
      <ChatWidget />
      <MobileBottomNav onOpenQuoteModal={() => handleOpenQuote()} />

      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        defaultProduct={selectedProduct}
      />
    </div>
  );
};
