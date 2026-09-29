export interface CertificateItem {
  id: string;
  name: string;
  code: string;
  issuerVi: string;
  issuerEn: string;
  scopeVi: string;
  scopeEn: string;
  validity: string;
  badgeText: string;
  image: string;
  descriptionVi: string;
  descriptionEn: string;
}

export const CERTIFICATES: CertificateItem[] = [
  {
    id: 'iso-9001',
    name: 'ISO 9001:2015',
    code: 'VN.FSMS.2023.089',
    issuerVi: 'Tổ chức Chứng nhận Quốc tế SGS Thụy Sĩ',
    issuerEn: 'SGS International Certification (Switzerland)',
    scopeVi: 'Hệ thống Quản lý Chất lượng Sản xuất Bao bì Giấy, Hộp Cứng và In ấn Thương Mại',
    scopeEn: 'Quality Management System for Paper Packaging, Rigid Boxes and Commercial Printing',
    validity: '2023 - 2026',
    badgeText: 'CHẤT LƯỢNG TOÀN DIỆN',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000&auto=format&fit=crop',
    descriptionVi: 'Chứng minh hệ thống kiểm soát chất lượng từ khâu tiếp nhận nguyên liệu giấy, quy trình in ấn khép kín, bế dán đến đóng gói kiểm tra KCS trước khi xuất xưởng.',
    descriptionEn: 'Validates strict end-to-end quality controls spanning raw material inspection, closed-loop press management, and final KCS outbound auditing.',
  },
  {
    id: 'fsc-coc',
    name: 'FSC® Chain-of-Custody (CoC)',
    code: 'FSC-C148920 / SGSCH-COC-0921',
    issuerVi: 'Hội đồng Quản lý Rừng Thế giới (Forest Stewardship Council)',
    issuerEn: 'Forest Stewardship Council (FSC Global)',
    scopeVi: 'Chuỗi hành trình sản phẩm bao bì giấy từ nguồn rừng trồng có trách nhiệm môi trường',
    scopeEn: 'Chain of Custody tracking paper fiber from certified sustainably managed forests',
    validity: '2022 - 2027',
    badgeText: 'BẢO VỆ RỪNG XANH',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop',
    descriptionVi: 'Đảm bảo 100% nguyên liệu giấy sử dụng tại nhà máy Vietlabel có nguồn gốc hợp pháp, không khai thác rừng nguyên sinh và hỗ trợ phục hồi hệ sinh thái bền vững.',
    descriptionEn: 'Guarantees that 100% of paperboards used in Vietlabel facilities originate from verifiable, legal, and non-deforestation sources.',
  },
  {
    id: 'ecovadis',
    name: 'EcoVadis Sustainability Silver Rating',
    code: 'EV-MED-2024-VN',
    issuerVi: 'Tổ chức Đánh giá Phát triển Bền vững Doanh nghiệp Toàn cầu EcoVadis (Pháp)',
    issuerEn: 'EcoVadis Corporate Social Responsibility Rating (France)',
    scopeVi: 'Môi trường, Lao động & Quyền con người, Đạo đức kinh doanh và Thu mua bền vững',
    scopeEn: 'Environment, Labor & Human Rights, Business Ethics, and Sustainable Procurement',
    validity: '2024 - 2027',
    badgeText: 'TRÁCH NHIỆM XÃ HỘI',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop',
    descriptionVi: 'Xếp hạng top 15% các nhà sản xuất bao bì giấy trên thế giới về chỉ số trách nhiệm xã hội doanh nghiệp (CSR) và giảm thiểu dấu chân carbon trong chuỗi cung ứng.',
    descriptionEn: 'Ranked in the top 15% of global packaging manufacturers for ESG compliance, CSR practices, and supply chain decarbonization.',
  },
  {
    id: 'haccp',
    name: 'HACCP Codex Alimentarius',
    code: 'HACCP-REV-2020-AP',
    issuerVi: 'TÜV Rheinland (CHLB Đức)',
    issuerEn: 'TÜV Rheinland (Germany)',
    scopeVi: 'Phân tích Mối nguy và Điểm kiểm soát tới hạn cho Bao bì tiếp xúc trực tiếp Thực phẩm',
    scopeEn: 'Hazard Analysis and Critical Control Points for Direct Food Contact Packaging',
    validity: '2023 - 2026',
    badgeText: 'AN TOÀN THỰC PHẨM',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop',
    descriptionVi: 'Cam kết túi giấy bánh mì, hộp thức ăn nhanh, khay giấy thực phẩm không chứa độc tố vi sinh, không kim loại nặng và hóa chất di cư theo quy định an toàn vệ sinh.',
    descriptionEn: 'Certifies bakery bags and food cartons are totally free of microbial contaminants, heavy metal migration, and hazardous dyes.',
  },
  {
    id: 'g7-master',
    name: 'G7® Master Idealliance Certified Facility',
    code: 'G7-MC-2024-789',
    issuerVi: 'Tổ chức Tiêu chuẩn Đồ họa Quốc tế Idealliance (Hoa Kỳ)',
    issuerEn: 'Idealliance International Graphic Standards (USA)',
    scopeVi: 'Chuẩn hóa Cân bằng Xám và Quản lý Màu sắc In ấn Offset & Kỹ thuật số theo ISO 12647-2',
    scopeEn: 'Standardized Gray Balance & Color Consistency in Offset Printing per ISO 12647-2',
    validity: '2024 - 2026',
    badgeText: 'CHUẨN MÀU TUYỆT ĐỐI',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop',
    descriptionVi: 'Đảm bảo màu sắc in thực tế trùng khớp tuyệt đối 99.5% với bản thiết kế kỹ thuật số, loại bỏ sai lệch màu sắc giữa các đợt in định kỳ qua nhiều năm.',
    descriptionEn: 'Guarantees printed Delta-E color tolerances match proof designs with 99.5% chromatic consistency across batch runs.',
  },
];
