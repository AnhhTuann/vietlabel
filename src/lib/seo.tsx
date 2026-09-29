import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  structuredData?: Record<string, unknown>;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Vietlabel | Nhà sản xuất bao bì giấy & tem nhãn chuyên nghiệp B2B',
  description = 'Công ty Cổ phần Bao bì & Tem nhãn Vietlabel - Đối tác chiến lược cung cấp giải pháp bao bì tối ưu, hộp giấy, túi giấy, thùng carton, tem nhãn cuộn, POSM đạt chuẩn FSC, ISO 9001, HACCP, G7.',
  keywords = 'sản xuất bao bì giấy, tem nhãn decal, in hộp giấy, túi giấy kraft, thùng carton, bao bì B2B, FSC, Vietlabel',
  canonical,
  ogType = 'website',
  ogImage = '/og-image.jpg',
  structuredData,
}) => {
  const fullTitle = title.includes('Vietlabel') ? title : `${title} | Vietlabel`;

  const defaultOrgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Công ty Cổ phần Bao bì & Tem nhãn Vietlabel',
    alternateName: 'Vietlabel Packaging Corp',
    url: 'https://vietlabel.vn',
    logo: 'https://vietlabel.vn/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-28-3765-8888',
      contactType: 'sales',
      areaServed: 'VN',
      availableLanguage: ['Vietnamese', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Khu công nghiệp Tân Bình mở rộng, Đường CN13',
      addressLocality: 'Bình Tân, TP. Hồ Chí Minh',
      addressRegion: 'TP. Hồ Chí Minh',
      postalCode: '700000',
      addressCountry: 'VN',
    },
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Vietlabel" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultOrgSchema)}
      </script>
    </Helmet>
  );
};
