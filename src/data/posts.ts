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
  {
    id: 'post-4',
    slug: 'tem-nhan-nong-san-ca-phe-ocop-kraft-sinh-hoc',
    category: 'du-an-noi-bat',
    categoryNameVi: 'Dự án OCOP',
    categoryNameEn: 'OCOP Projects',
    titleVi: 'Tem nhãn Nông sản & Cà phê OCOP chất liệu Kraft sinh học tự nhiên đạt chuẩn 4-5 sao',
    titleEn: 'Eco Kraft Organic Coffee & Agricultural OCOP Specialty Labels (4-5 Star Standard)',
    summaryVi: 'Giải pháp tem nhãn cuộn decal giấy Kraft mộc chống thấm kết hợp màng bio tự hủy giúp cà phê OCOP xuất khẩu khẳng định giá trị thương hiệu.',
    summaryEn: 'Eco Kraft roll label solutions with moisture resistance and biodegradable coatings empowering Vietnamese specialty coffee exporters.',
    date: '01 Tháng 04, 2026',
    readTimeVi: '4 phút đọc',
    readTimeEn: '4 min read',
    author: 'Võ Minh Nhật - Chuyên viên Giải pháp Bao bì OCOP',
    image: '/images/vietlabel/label-cafe-ocop.webp',
    contentVi: [
      'Chương trình Mỗi Xã Một Sản Phẩm (OCOP) đang tạo động lực mạnh mẽ cho các đặc sản nông sản Việt Nam vươn ra thị trường quốc tế. Tuy nhiên, rào cản lớn nhất của nhiều HTX và doanh nghiệp là bao bì và tem nhãn chưa đạt chuẩn xuất khẩu.',
      'Vietlabel cung cấp giải pháp tem cuộn giấy Kraft nguyên sinh kết hợp công nghệ in Flexo 6 màu kháng ẩm, bảo đảm độ bám dính trên túi giấy đựng cà phê rang xay và hộp quà tặng nông sản.',
      'Tem nhãn đạt chứng nhận an toàn tiếp xúc thực phẩm HACCP và chứng chỉ chuỗi hành trình rừng FSC CoC.',
    ],
    contentEn: [
      'The One Commune One Product (OCOP) initiative has propelled Vietnamese agricultural specialties onto global retail shelves. Packaging aesthetics and compliance remain crucial for market success.',
      'Vietlabel provides FSC-certified virgin Kraft roll labels with 6-color UV Flexo barrier inks, ensuring unyielding adhesion on roasted coffee pouches and gift packaging.',
      'All materials comply rigorously with international food-contact HACCP standards and FSC CoC certifications.',
    ],
    isFeatured: true,
  },
  {
    id: 'post-5',
    slug: 'vietlabel-tu-hao-dong-hanh-cung-th-true-milk',
    category: 'du-an-noi-bat',
    categoryNameVi: 'Dự án Nổi bật',
    categoryNameEn: 'Featured Projects',
    titleVi: 'Vietlabel tự hào đồng hành cùng TH True Milk',
    titleEn: 'Vietlabel Proudly Partners with TH True Milk',
    summaryVi: 'Vietlabel vinh dự được chọn là đối tác cung cấp tem nhãn và bao bì cho TH True Milk, một trong những thương hiệu sữa tươi sạch hàng đầu Việt Nam.',
    summaryEn: 'Vietlabel is honored to be selected as the label and packaging partner for TH True Milk, one of Vietnam leading fresh milk brands.',
    date: '15 Tháng 01, 2026',
    readTimeVi: '3 phút đọc',
    readTimeEn: '3 min read',
    author: 'Vietlabel Team',
    image: '/images/vietlabel/blog/true-milk.webp',
    contentVi: [
      'TH True Milk là thương hiệu sữa tươi sạch được yêu thích tại Việt Nam với quy trình sản xuất đạt chuẩn quốc tế. Vietlabel vinh dự được đồng hành cùng TH True Milk trong việc cung cấp giải pháp tem nhãn chất lượng cao.',
      'Các sản phẩm tem nhãn của Vietlabel cho TH True Milk sử dụng chất liệu giấy cao cấp, công nghệ in hiện đại, đảm bảo độ bền và thẩm mỹ cho sản phẩm.',
      'Đội ngũ kỹ thuật của Vietlabel luôn làm việc chặt chẽ với TH True Milk để đảm bảo mỗi sản phẩm tem nhãn đều đạt chuẩn chất lượng cao nhất.',
    ],
    contentEn: [
      'TH True Milk is a beloved fresh milk brand in Vietnam with international standard production processes. Vietlabel is honored to partner with TH True Milk in providing high-quality label solutions.',
      'Vietlabel labels for TH True Milk use premium paper materials and modern printing technology, ensuring durability and aesthetics for the products.',
      'Vietlabel technical team works closely with TH True Milk to ensure every label product meets the highest quality standards.',
    ],
    isFeatured: true,
  },
  {
    id: 'post-6',
    slug: 'van-hoa-vietlabel-chuc-mung-sinh-nhat-thang-1',
    category: 'hoat-dong-cong-ty',
    categoryNameVi: 'Hoạt động Công ty',
    categoryNameEn: 'Company Activities',
    titleVi: 'Văn hóa Vietlabel: Chúc mừng sinh nhật các thành viên tháng 1',
    titleEn: 'Vietlabel Culture: Celebrating January Birthdays',
    summaryVi: 'Tháng 1 là tháng khởi đầu của một năm mới đầy năng lượng. Vietlabel tổ chức lễ chúc mừng sinh nhật cho các thành viên có sinh nhật trong tháng 1.',
    summaryEn: 'January marks the beginning of an energetic new year. Vietlabel organized a birthday celebration for members born in January.',
    date: '10 Tháng 01, 2026',
    readTimeVi: '2 phút đọc',
    readTimeEn: '2 min read',
    author: 'HR Department',
    image: '/images/vietlabel/blog/sinh-nhat-thang-1.webp',
    contentVi: [
      'Đầu năm mới, Vietlabel tổ chức buổi lễ chúc mừng sinh nhật ấm cúng cho các thành viên có sinh nhật trong tháng 1. Đây là dịp để mọi người gắn kết và chia sẻ niềm vui.',
      'Buổi lễ có sự tham gia của toàn thể nhân viên, với những món quà ý nghĩa và lời chúc tốt đẹp nhất dành cho các thành viên nhân dịp sinh nhật.',
      'Văn hóa Vietlabel luôn đề cao sự gắn kết và chăm sóc nhân viên, tạo môi trường làm việc tích cực và hạnh phúc.',
    ],
    contentEn: [
      'At the beginning of the new year, Vietlabel organized a cozy birthday celebration for members born in January. This is an opportunity for everyone to bond and share joy.',
      'The ceremony was attended by all employees, with meaningful gifts and best wishes for the members on their birthday.',
      'Vietlabel culture always emphasizes employee bonding and care, creating a positive and happy working environment.',
    ],
    isFeatured: false,
  },
  {
    id: 'post-7',
    slug: 'decal-sua-la-gi',
    category: 'nganh-bao-bi',
    categoryNameVi: 'Kiến thức Ngành',
    categoryNameEn: 'Industry Knowledge',
    titleVi: 'Decal sữa là gì? Ứng dụng của decal sữa trong bao bì',
    titleEn: 'What is Decal Milk? Applications in Packaging',
    summaryVi: 'Decal sữa là loại tem nhãn chất liệu giấy cao cấp, được sử dụng rộng rãi trong ngành bao bì thực phẩm và dược phẩm.',
    summaryEn: 'Decal milk is a premium paper label material, widely used in food and pharmaceutical packaging.',
    date: '05 Tháng 01, 2026',
    readTimeVi: '4 phút đọc',
    readTimeEn: '4 min read',
    author: 'Technical Team',
    image: '/images/vietlabel/label-dairy.webp',
    contentVi: [
      'Decal sữa là loại tem nhãn được làm từ chất liệu giấy cao cấp, có độ bám dính tốt và chịu nước. Loại decal này thường được sử dụng cho các sản phẩm thực phẩm, dược phẩm cần độ an toàn cao.',
      'Ưu điểm của decal sữa: độ bám dính tốt, chịu nước, an toàn cho thực phẩm, in ấn sắc nét.',
      'Ứng dụng: tem nhãn sữa, tem nhãn thực phẩm chức năng, tem nhãn dược phẩm, tem nhãn nước giải khát.',
    ],
    contentEn: [
      'Decal milk is a label made from premium paper material with good adhesion and water resistance. This type of decal is often used for food and pharmaceutical products requiring high safety.',
      'Advantages of decal milk: good adhesion, water resistance, food-safe, sharp printing.',
      'Applications: milk labels, nutraceutical labels, pharmaceutical labels, beverage labels.',
    ],
    isFeatured: false,
  },
];
