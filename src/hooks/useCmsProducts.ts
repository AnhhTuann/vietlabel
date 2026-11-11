import { useEffect, useState } from 'react';
import { PRODUCT_CATEGORIES, PRODUCTS_LIST, type ProductItem } from '../data/products';
import { api } from '../services/api';

interface CmsProduct {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  images?: string[];
  specs?: Record<string, string>;
  isActive: boolean;
}

function mapCmsProduct(product: CmsProduct): ProductItem {
  const existing = PRODUCTS_LIST.find(
    (item) => item.id === product.id || item.slug === product.slug,
  );
  const category =
    PRODUCT_CATEGORIES.find((item) => item.id === product.categoryId) ||
    PRODUCT_CATEGORIES.find((item) => item.id === existing?.categoryId) ||
    PRODUCT_CATEGORIES[0];
  const specs = product.specs || {};
  const gallery = product.images?.filter(Boolean) || [];
  const heroImage = gallery[0] || existing?.heroImage || '/images/vietlabel/hero-banner.webp';

  return {
    id: product.id,
    slug: product.slug,
    categoryId: category.id,
    categorySlug: category.slug,
    categoryNameVi: category.nameVi,
    categoryNameEn: category.nameEn,
    subcategoryId: existing?.subcategoryId || '',
    nameVi: product.name,
    nameEn: product.name,
    code: existing?.code || product.id.toUpperCase(),
    descriptionVi: product.description || existing?.descriptionVi || '',
    descriptionEn: product.description || existing?.descriptionEn || '',
    specs: {
      materialVi: specs['Chất liệu'] || existing?.specs.materialVi || '',
      materialEn: specs['Chất liệu'] || existing?.specs.materialEn || '',
      dimensionsVi: specs['Kích thước'] || existing?.specs.dimensionsVi || '',
      dimensionsEn: specs['Kích thước'] || existing?.specs.dimensionsEn || '',
      printTechniqueVi: specs['Kỹ thuật in'] || existing?.specs.printTechniqueVi || '',
      printTechniqueEn: specs['Kỹ thuật in'] || existing?.specs.printTechniqueEn || '',
      finishingVi: specs['Gia công'] || existing?.specs.finishingVi || '',
      finishingEn: specs['Gia công'] || existing?.specs.finishingEn || '',
      moq: specs['Số lượng tối thiểu'] || existing?.specs.moq || 'Liên hệ',
      leadTimeVi: specs['Thời gian sản xuất'] || existing?.specs.leadTimeVi || 'Theo quy cách',
      leadTimeEn:
        specs['Thời gian sản xuất'] || existing?.specs.leadTimeEn || 'Based on specifications',
    },
    featuresVi: existing?.featuresVi || [],
    featuresEn: existing?.featuresEn || [],
    applicationsVi: existing?.applicationsVi || [],
    applicationsEn: existing?.applicationsEn || [],
    heroImage,
    gallery: gallery.length > 0 ? gallery : existing?.gallery || [heroImage],
    contentHtml: existing?.contentHtml,
    isFeatured: existing?.isFeatured,
  };
}

export function useCmsProducts() {
  const [products, setProducts] = useState<ProductItem[]>(PRODUCTS_LIST);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api
      .get('/cms/products')
      .then(({ data }) => {
        if (!isMounted || !Array.isArray(data)) return;
        setProducts(data.filter((product: CmsProduct) => product.isActive).map(mapCmsProduct));
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, isLoading };
}
