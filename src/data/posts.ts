export interface PostItem {
  id: string;
  slug: string;
  category: 'nganh-bao-bi' | 'du-an-noi-bat' | 'hoat-dong-cong-ty';
  categoryNameVi: string;
  categoryNameEn: string;
  titleVi: string;
  titleEn: string;
  summaryVi: string;
  summaryEn: string;
  date: string;
  readTimeVi: string;
  readTimeEn: string;
  author: string;
  image: string;
  contentVi: string[];
  contentEn: string[];
  isFeatured?: boolean;
}

export const POSTS_LIST: PostItem[] = [
  {
    id: 'post-1',
    slug: 'xu-huong-bao-bi-xanh-2026-tieu-chuan-fsc-va-esg',
    category: 'nganh-bao-bi',
    categoryNameVi: 'Xu hướng ngành',
    categoryNameEn: 'Industry Trends',
    titleVi: 'Xu hướng bao bì xanh 2026: Doanh nghiệp xuất khẩu trước rào cản ESG châu Âu',
    titleEn: 'Sustainable Packaging 2026: Navigating Strict EU ESG Directives for Global Exporters',
    summaryVi: 'Chỉ thị mới PPWR của Liên minh Châu Âu yêu cầu 100% bao bì phải tái chế hoặc phân hủy sinh học trước năm 2030. Doanh nghiệp Việt cần chuẩn bị những gì?',
    summaryEn: 'The new EU PPWR regulations mandate 100% recyclable or compostable packaging by 2030. How Vietnamese exporters can adapt strategically.',
    date: '24 Tháng 03, 2026',
    readTimeVi: '5 phút đọc',
    readTimeEn: '5 min read',
    author: 'Nguyễn Minh Tuấn - Giám đốc Kỹ thuật Vietlabel',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop',
    contentVi: [
      'Trong bối cảnh Quy định về Bao bì và Rác thải Bao bì (PPWR) của Liên minh Châu Âu chính thức bước vào giai đoạn thực thi nghiêm ngặt, các nhà sản xuất xuất khẩu vào thị trường EU và Bắc Mỹ đang đối mặt với những yêu cầu khắt khe chưa từng có.',
      'Không còn đơn thuần là chọn loại giấy có màu nâu mộc mạc, chứng nhận chuỗi hành trình FSC (Forest Stewardship Council) cùng việc hạn chế tối đa các màng nhựa khó bóc tách (non-separable laminates) là điều kiện tiên quyết để hàng hóa được thông quan.',
      'Tại Vietlabel, chúng tôi đã tiên phong đầu tư hệ sinh thái keo dán gốc nước (Water-based adhesive) và lớp phủ phân hủy sinh học thay thế màng nhựa truyền thống, giúp đối tác xuất khẩu tiết kiệm thuế carbon và tăng năng lực cạnh tranh.',
    ],
    contentEn: [
      'As the European Union Packaging and Packaging Waste Regulation (PPWR) takes full effect, global exporters into European markets encounter unprecedented compliance scrutiny.',
      'Sustainability is no longer merely aesthetic kraft coloring. FSC Chain-of-Custody certification and zero non-recyclable multi-layer plastics are mandatory requirements for customs clearance.',
      'At Vietlabel, we have pioneered water-based dispersion barrier coatings replacing conventional plastic laminates, equipping our clients to bypass carbon border tariffs effortlessly.',
    ],
    isFeatured: true,
  },
  {
    id: 'post-2',
    slug: 'du-an-thay-doi-dien-mao-bao-bi-hop-yen-sao-hoang-gia',
    category: 'du-an-noi-bat',
    categoryNameVi: 'Dự án nổi bật',
    categoryNameEn: 'Case Studies',
    titleVi: 'Case Study: Tái định vị thương hiệu Yến Sào Hoàng Gia qua cấu trúc hộp nam châm đa tầng',
    titleEn: 'Case Study: Rebranding Royal Bird’s Nest through a Multi-Tier Luxury Magnetic Rigid Box',
    summaryVi: 'Giải pháp cấu trúc hộp mở cánh bướm kết hợp ép kim hologram 3D đã giúp doanh số mùa Tết của khách hàng tăng trưởng 145% và giảm tỷ lệ móp méo trong chuyển phát nhanh xuống dưới 0.1%.',
    summaryEn: 'How an innovative butterfly-wing rigid opening with 3D hologram foil grew seasonal sales by 145% and reduced transit damage to sub-0.1%.',
    date: '15 Tháng 03, 2026',
    readTimeVi: '4 phút đọc',
    readTimeEn: '4 min read',
    author: 'Trần Thị Thu Thảo - Trưởng phòng R&D',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
    contentVi: [
      'Khách hàng Yến Sào Hoàng Gia tìm đến Vietlabel khi sản phẩm của họ gặp tình trạng bao bì cũ dễ bị làm giả, và khi chuyển phát nhanh các hũ thủy tinh thường xuyên bị xô lệch, nứt vỡ.',
      'Giải pháp từ Vietlabel: Thiết kế lại cấu trúc hộp cánh bướm với cốt carton đặc 3mm chịu lực 50kg, khay mút EVA định hình ôm khít 100% cổ hũ yến, đồng thời tích hợp tem chống giả vi mô.',
      'Kết quả đạt được: Doanh số quà tặng doanh nghiệp dịp Tết tăng vọt 145%, phản hồi khách hàng về độ sang trọng đạt điểm tuyệt đối 9.8/10.',
    ],
    contentEn: [
      'Royal Birds Nest approached Vietlabel facing twin challenges: high counterfeit vulnerability in open markets and excessive glass jar breakage during express courier transit.',
      'Our engineering team restructured a dual-door butterfly box with 3mm impact-resistant chipboard, custom CNC laser EVA cavities, and integrated microscopic hologram seals.',
      'The outcome: 145% year-over-year revenue surge during festive gifting seasons and a near-perfect 9.8/10 customer satisfaction index on luxury presentation.',
    ],
    isFeatured: true,
  },
  {
    id: 'post-3',
    slug: 'vietlabel-khanh-thanh-nha-may-so-2-cong-nghe-heidelberg-uv',
    category: 'hoat-dong-cong-ty',
    categoryNameVi: 'Hoạt động công ty',
    categoryNameEn: 'Company News',
    titleVi: 'Vietlabel khánh thành phân xưởng tự động hóa số 2 và đón nhận chứng chỉ G7 Master',
    titleEn: 'Vietlabel Inaugurates Automation Facility Phase 2 and Receives G7 Master Certification',
    summaryVi: 'Nâng tổng diện tích sản xuất lên quy mô hiện đại và đưa vào vận hành hệ thống in Flexo & Offset thế hệ mới nhất, sẵn sàng đáp ứng 10 triệu tem nhãn & bao bì mỗi năm.',
    summaryEn: 'Expanding floor operations with the commissioning of the latest automated printing lines, catering to 10M+ annual packaging & label units.',
    date: '02 Tháng 03, 2026',
    readTimeVi: '3 phút đọc',
    readTimeEn: '3 min read',
    author: 'Ban Truyền thông Vietlabel',
    image: '/images/vietlabel/team-vietlabel.webp',
    contentVi: [
      'Ngày 02/03/2026, Công ty Cổ phần Sản xuất Thương mại Vietlabel long trọng tổ chức lễ khánh thành phân xưởng sản xuất số 2, đánh dấu bước phát triển vượt bậc sau hơn 20 năm phục vụ ngành tem nhãn & bao bì.',
      'Tại buổi lễ, đại diện Tổ chức Idealliance (Hoa Kỳ) đã chính thức trao chứng nhận G7 Master Facility, khẳng định năng lực quản lý chuẩn màu sắc in ấn đạt độ chính xác tương đương các nhà in hàng đầu thế giới.',
    ],
    contentEn: [
      'On March 2, 2026, Vietlabel celebrated the ribbon-cutting of Facility Phase 2, marking a milestone across two decades in industrial packaging and labeling.',
      'During the opening, representatives from Idealliance USA conferred the prestigious G7 Master Facility certificate, recognizing world-class gray balance and chromatic fidelity.',
    ],
    isFeatured: true,
  },
];
