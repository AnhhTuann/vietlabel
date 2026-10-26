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
    year: '2019',
    titleVi: 'Khởi đầu hành trình',
    titleEn: 'The Beginning',
    descVi: 'Thành lập xưởng sản xuất rộng 200 m² với đội ngũ 5 nhân viên tận tâm, nhiệt huyết và giàu tinh thần trách nhiệm.',
    descEn: 'Founded a 200 m² production workshop with a dedicated team of five, driven by enthusiasm and a strong sense of responsibility.',
  },
  {
    year: '2020',
    titleVi: 'Đổi mới công nghệ – Vững vàng vượt khó',
    titleEn: 'Technology Renewal – Resilience Through Challenges',
    descVi: 'Đầu tư máy in mới 6 màu, cải tạo nhà xưởng để duy trì hoạt động xuyên suốt và vững vàng vượt qua đại dịch COVID-19.',
    descEn: 'Invested in a new 6-color press and upgraded the workshop to maintain continuous operations through the COVID-19 pandemic.',
  },
  {
    year: '2021',
    titleVi: 'Xây dựng văn hóa – Hoàn thiện quy trình',
    titleEn: 'Building Culture – Strengthening Processes',
    descVi: 'Tham gia các khóa học quản trị của Koji, PDCA Việt Nam và chương trình cải tiến của Samsung, VASI – Hiệp hội Công nghiệp Hỗ trợ Việt Nam.',
    descEn: 'Joined management programs by Koji and PDCA Vietnam, along with improvement initiatives from Samsung and VASI, the Vietnam Association for Supporting Industries.',
  },
  {
    year: '2024',
    titleVi: 'Chuyển đổi số – Hướng tới nhà máy thông minh',
    titleEn: 'Digital Transformation – Toward a Smart Factory',
    descVi: 'Đẩy mạnh ứng dụng công nghệ số vào quy trình vận hành, từng bước hướng tới mô hình nhà máy thông minh.',
    descEn: 'Expanded the use of digital technology across operations, taking steady steps toward a smart-factory model.',
  },
  {
    year: '2026',
    titleVi: 'Đầu tư công nghệ – Nâng tầm chất lượng',
    titleEn: 'Technology Investment – Elevating Quality',
    descVi: 'Đầu tư máy in Flexo 10 màu, nâng cao chất lượng in ấn và đáp ứng yêu cầu ngày càng cao của khách hàng.',
    descEn: 'Invested in a 10-color Flexo press to enhance print quality and meet customers’ increasingly demanding requirements.',
  },
];

export const LEADERSHIP_TEAM: TeamMember[] = [
  {
    name: 'Ông Phạm Tuấn Thiên',
    roleVi: 'Chủ tịch HĐQT & Tổng Giám đốc',
    roleEn: 'Chairman & Chief Executive Officer',
    bioVi: 'Hơn 25 năm kinh nghiệm trong ngành in ấn và sản xuất công nghiệp giấy tại Việt Nam. Từng là cố vấn kỹ thuật cho nhiều hiệp hội in ấn quốc gia.',
    bioEn: 'Over 25 years of experience in printing and paper manufacturing in Vietnam. Former technical advisor to several national printing associations.',
    avatar: '/images/vietlabel/team/pham-tuan-thien.png',
    experience: '25+ năm kinh nghiệm',
  },
  {
    name: 'Ông Nguyễn Văn Sang',
    roleVi: 'Tổng Giám đốc sản xuất',
    roleEn: 'Chief Production Officer',
    bioVi: 'Kỹ sư tốt nghiệp Đại học Công nghệ Darmstadt (Đức), chuyên gia G7 Certified Expert phụ trách chuẩn hóa màu sắc và công nghệ in.',
    bioEn: 'Engineering graduate of TU Darmstadt in Germany and G7 Certified Expert, specializing in print color standards and technology.',
    avatar: '/images/vietlabel/team/nguyen-van-sang.jpg',
    experience: '15+ năm kinh nghiệm',
  },
];
