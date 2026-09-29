export interface Milestone {
  year: string;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
}

export interface TeamMember {
  name: string;
  roleVi: string;
  roleEn: string;
  bioVi: string;
  bioEn: string;
  avatar: string;
  experience: string;
}

export const COMPANY_MILESTONES: Milestone[] = [
  {
    year: '2004',
    titleVi: 'Khởi đầu hành trình',
    titleEn: 'Foundational Beginnings',
    descVi: 'Thành lập xưởng in bao bì giấy đầu tiên tại Quận Tân Bình với 2 máy in offset 2 màu và 15 nhân sự tâm huyết.',
    descEn: 'Inception of our first printshop in Tan Binh with two 2-color presses and a passionate team of 15 artisans.',
  },
  {
    year: '2012',
    titleVi: 'Mở rộng quy mô & Đầu tư máy Heidelberg',
    titleEn: 'Scale Expansion & Heidelberg Acquisition',
    descVi: 'Chính thức chuyển đổi mô hình Công ty Cổ phần, xây dựng nhà máy 5,000m² và nhập khẩu dây chuyền Heidelberg 4 màu đầu tiên từ Đức.',
    descEn: 'Incorporated as a Joint Stock Company, opened a 5,000m² facility and acquired our first 4-color Heidelberg press from Germany.',
  },
  {
    year: '2018',
    titleVi: 'Đạt chuẩn quốc tế ISO 9001 & FSC',
    titleEn: 'International Accreditation: ISO 9001 & FSC',
    descVi: 'Nhận chứng nhận hệ thống quản lý chất lượng ISO 9001:2015 và chứng chỉ chuỗi hành trình rừng FSC CoC, mở đường xuất khẩu sang Mỹ và EU.',
    descEn: 'Achieved ISO 9001:2015 and FSC CoC certifications, initiating recurring export shipments to North America and Europe.',
  },
  {
    year: '2022',
    titleVi: 'Đạt chuẩn G7 Master & Mở rộng phân xưởng 2',
    titleEn: 'G7 Master Status & Facility Phase 2',
    descVi: 'Đầu tư dàn máy bế tự động Bobst Thụy Sĩ và đạt chứng nhận G7 Master kiểm soát màu sắc chuẩn xác toàn cầu.',
    descEn: 'Invested in high-speed Swiss Bobst die-cutting systems and earned G7 Master recognition for color fidelity.',
  },
  {
    year: '2026',
    titleVi: 'Hệ sinh thái bao bì xanh 15,000m²',
    titleEn: '15,000m² Eco-Packaging Hub',
    descVi: 'Vận hành toàn diện tổ hợp nhà xưởng thông minh đạt chứng nhận ESG EcoVadis Silver và công suất 10 triệu bao bì/năm.',
    descEn: 'Fully operational smart green hub certified under EcoVadis Silver ESG with 10M+ annual output capacity.',
  },
];

export const LEADERSHIP_TEAM: TeamMember[] = [
  {
    name: 'Ông Nguyễn Trọng Phát',
    roleVi: 'Chủ tịch HĐQT & Tổng Giám đốc',
    roleEn: 'Chairman & Chief Executive Officer',
    bioVi: 'Hơn 25 năm kinh nghiệm trong ngành in ấn và sản xuất công nghiệp giấy tại Việt Nam. Từng là cố vấn kỹ thuật cho nhiều hiệp hội in ấn quốc gia.',
    bioEn: 'Over 25 years leading printing technology and packaging manufacturing in Southeast Asia. Former technical advisor to national graphic arts councils.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    experience: '25+ năm kinh nghiệm',
  },
  {
    name: 'Bà Lê Hoàng Mai',
    roleVi: 'Phó Tổng Giám đốc Vận hành (COO)',
    roleEn: 'Chief Operating Officer (COO)',
    bioVi: 'Chuyên gia quản trị sản xuất tinh gọn Lean Six Sigma Black Belt, từng điều hành các nhà máy bao bì liên doanh quốc tế đạt năng suất vượt trội.',
    bioEn: 'Lean Six Sigma Black Belt manufacturing executive with an exemplary track record managing high-capacity multinational converting facilities.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    experience: '18+ năm kinh nghiệm',
  },
  {
    name: 'Kỹ sư Vũ Thành Nam',
    roleVi: 'Giám đốc Công nghệ & Quản lý Chất lượng (CTO / QA)',
    roleEn: 'Chief Technology & QA Director',
    bioVi: 'Kỹ sư tốt nghiệp Đại học Công nghệ Darmstadt (Đức), chuyên gia G7 Certified Expert phụ trách chuẩn hóa màu sắc và số hóa dây chuyền.',
    bioEn: 'Engineering graduate from TU Darmstadt (Germany), certified G7 Expert heading prepress calibration and smart factory digitalization.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    experience: '15+ năm kinh nghiệm',
  },
  {
    name: 'Bà Đặng Phương Thảo',
    roleVi: 'Giám đốc Phát triển Bền vững & ESG',
    roleEn: 'Director of ESG & Sustainability',
    bioVi: 'Tiến sĩ Kỹ thuật Môi trường, phụ trách chuyển đổi xanh, truy xuất nguồn gốc nguyên liệu FSC và chiến lược giảm phát thải Net-Zero.',
    bioEn: 'PhD in Environmental Engineering, steering circular supply chains, FSC fiber traceability, and corporate net-zero decarbonization.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
    experience: '12+ năm kinh nghiệm',
  },
];
