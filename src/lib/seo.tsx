import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  ogUrl?: string;
  noindex?: boolean;
  structuredData?: Record<string, unknown>;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Vietlabel | Nhà sản xuất bao bì giấy & tem nhãn chuyên nghiệp B2B',
  description = 'Công ty Cổ phần Bao bì & Tem nhãn Vietlabel - Đối tác chiến lược cung cấp giải pháp bao bì tối ưu, hộp giấy, túi giấy, thùng carton, tem nhãn cuộn, POSM đạt chuẩn FSC, ISO 9001, HACCP, G7.',
  keywords = 'sản xuất bao bì giấy, tem nhãn decal, in hộp giấy, túi giấy kraft, thùng carton, bao bì B2B, FSC, Vietlabel',
  canonical,
  ogType = 'website',
  ogImage = '/images/vietlabel/logo.png',
  ogUrl,
  noindex = false,
  structuredData,
  article,
}) => {
  const fullTitle = title.includes('Vietlabel') ? title : `${title} | Vietlabel`;
  const siteUrl = ogUrl || canonical || 'https://vietlabel.vn';

  const defaultOrgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Công ty Cổ phần Bao bì & Tem nhãn Vietlabel',
    alternateName: 'Vietlabel Packaging Corp',
    url: 'https://vietlabel.vn',
    logo: 'https://vietlabel.vn/images/vietlabel/logo.png',
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
    sameAs: [
      'https://www.facebook.com/vietlabel.vn',
      'https://zalo.me/0868968089',
    ],
  };

  const breadcrumbSchema = canonical ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: 'https://vietlabel.vn',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: canonical,
      },
    ],
  } : null;

  const articleSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: [ogImage],
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime,
    author: {
      '@type': 'Organization',
      name: article.author || 'Vietlabel',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vietlabel',
      logo: {
        '@type': 'ImageObject',
        url: 'https://vietlabel.vn/images/vietlabel/logo.png',
      },
    },
  } : null;

  const allStructuredData = [
    structuredData || defaultOrgSchema,
    breadcrumbSchema,
    articleSchema,
  ].filter(Boolean);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Language and locale */}
      <meta name="language" content="Vietnamese" />
      <meta httpEquiv="content-language" content="vi" />

      {/* Additional SEO */}
      <meta name="author" content="Vietlabel Packaging Corp" />
      <meta name="theme-color" content="#1a3a7c" />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Vietlabel" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:locale" content="vi_VN" />

      {/* Article specific OG tags */}
      {article && (
        <>
          {article.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags && article.tags.map((tag, i) => (
            <meta key={i} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@vietlabel" />

      {/* JSON-LD Structured Data */}
      {allStructuredData.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
