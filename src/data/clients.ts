export interface ClientPartner {
  id: string;
  name: string;
  industryVi: string;
  industryEn: string;
  country: string;
  image?: string;
}

export const CLIENT_PARTNERS: ClientPartner[] = [
  { id: 'c1', name: 'Tập đoàn VinFast', industryVi: 'Ô tô & Xe máy điện', industryEn: 'Automotive & EVs', country: 'Vietnam', image: '/images/vietlabel/partner-vinfast.webp' },
  { id: 'c2', name: 'Tập đoàn Intel', industryVi: 'Bán dẫn & Công nghệ cao', industryEn: 'Semiconductors & Tech', country: 'USA', image: '/images/vietlabel/partner-intel.webp' },
  { id: 'c3', name: 'Tập đoàn Samsung', industryVi: 'Điện tử & Thiết bị thông minh', industryEn: 'Electronics', country: 'South Korea', image: '/images/vietlabel/partner-samsung.webp' },
  { id: 'c4', name: 'Unilever Vietnam', industryVi: 'Hóa mỹ phẩm & Chăm sóc gia đình', industryEn: 'FMCG & Personal Care', country: 'Global', image: '/images/vietlabel/partner-unilever.webp' },
  { id: 'c5', name: 'TH True Milk', industryVi: 'Sữa tươi sạch & Đồ uống', industryEn: 'Dairy & Beverages', country: 'Vietnam', image: '/images/vietlabel/partner-thmilk.webp' },
  { id: 'c6', name: 'Tập đoàn Thiên Long', industryVi: 'Văn phòng phẩm quốc gia', industryEn: 'Stationery', country: 'Vietnam', image: '/images/vietlabel/partner-thienlong.webp' },
  { id: 'c7', name: 'Tập đoàn Hyosung', industryVi: 'Sợi công nghiệp & Hóa chất', industryEn: 'Industrial Fibers & Chemical', country: 'South Korea', image: '/images/vietlabel/partner-hyosung.webp' },
  { id: 'c8', name: 'Masan Consumer', industryVi: 'Tiêu dùng nhanh & Thực phẩm', industryEn: 'FMCG & Food', country: 'Vietnam' },
  { id: 'c9', name: 'Pharmacity Pharmacy', industryVi: 'Chuỗi Dược phẩm & Nhà thuốc', industryEn: 'Pharmacy Retail', country: 'Vietnam' },
  { id: 'c10', name: 'Rohto-Mentholatum', industryVi: 'Dược mỹ phẩm chăm sóc da', industryEn: 'Pharmaceuticals', country: 'Japan' },
  { id: 'c11', name: 'Highlands Coffee', industryVi: 'Chuỗi F&B & Cà phê', industryEn: 'F&B Retail', country: 'Vietnam' },
  { id: 'c12', name: 'Kao Vietnam', industryVi: 'Mỹ phẩm & Hóa phẩm', industryEn: 'Cosmetics', country: 'Japan' },
  { id: 'c13', name: 'CP Group Vietnam', industryVi: 'Chế biến thực phẩm an toàn', industryEn: 'Agri-food', country: 'Thailand' },
  { id: 'c14', name: 'Nestlé Health Science', industryVi: 'Dinh dưỡng y học', industryEn: 'Nutrition', country: 'Switzerland' },
  { id: 'c15', name: 'Trung Nguyên Legend', industryVi: 'Cà phê năng lượng', industryEn: 'Coffee & Tea', country: 'Vietnam' },
  { id: 'c16', name: 'Tous Les Jours', industryVi: 'Chuỗi Bakery cao cấp', industryEn: 'Bakery Chain', country: 'South Korea' },
  { id: 'c17', name: 'Lock&Lock Living', industryVi: 'Gia dụng thông minh', industryEn: 'Housewares', country: 'South Korea' },
  { id: 'c18', name: 'Kinh Đô Mondelez', industryVi: 'Bánh kẹo quốc tế', industryEn: 'Confectionery', country: 'USA' },
  { id: 'c19', name: 'Canifa Fashion', industryVi: 'Thời trang & May mặc', industryEn: 'Apparel Retail', country: 'Vietnam' },
  { id: 'c20', name: 'Annam Gourmet', industryVi: 'Siêu thị cao cấp', industryEn: 'Gourmet Groceries', country: 'Vietnam' },
];

export const CLIENT_ROW_1 = CLIENT_PARTNERS.slice(0, 10);
export const CLIENT_ROW_2 = CLIENT_PARTNERS.slice(10, 20);
