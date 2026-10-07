import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { SEO } from '../lib/seo';
import { Hero } from '../components/home/Hero';
import { Stats } from '../components/home/Stats';
import { ProductCategories } from '../components/home/ProductCategories';
import { ValueTabs } from '../components/home/ValueTabs';
import { ClientMarquee } from '../components/home/ClientMarquee';
import { LabelSolutionsMarquee } from '../components/home/LabelSolutionsMarquee';
import { Solutions } from '../components/home/Solutions';
import { Certificates } from '../components/home/Certificates';
import { Machines } from '../components/home/Machines';
import { FeaturedPosts } from '../components/home/FeaturedPosts';
import { ContactSection } from '../components/home/ContactSection';

export const HomePage: React.FC = () => {
  const { onOpenQuoteModal } = useOutletContext<{ onOpenQuoteModal: (prod?: string) => void }>();

  return (
    <>
      <SEO
        title="Vietlabel | Nhà sản xuất bao bì giấy & tem nhãn chuyên nghiệp B2B"
        description="Công ty Cổ phần Sản xuất Thương mại Vietlabel: Nhà máy sản xuất tem nhãn cuộn decal, bao bì giấy, thùng carton đạt chuẩn quốc tế FSC, ISO 9001, G7 Master."
      />

      <Hero onOpenQuoteModal={() => onOpenQuoteModal()} />
      <Stats />
      <ProductCategories />
      <ValueTabs />
      <ClientMarquee />
      <LabelSolutionsMarquee />
      <Solutions />
      <Certificates />
      <Machines />
      <FeaturedPosts />
      <ContactSection />
    </>
  );
};
