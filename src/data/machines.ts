export interface MachineItem {
  id: string;
  name: string;
  model: string;
  origin: string;
  categoryVi: string;
  categoryEn: string;
  capacityVi: string;
  capacityEn: string;
  purposeVi: string;
  purposeEn: string;
  specsVi: string[];
  specsEn: string[];
  image: string;
  isFeatured?: boolean;
}

export const MACHINES_LIST: MachineItem[] = [
  {
    id: 'm-01',
    name: 'Máy in Offset Heidelberg Speedmaster XL 106-6+L',
    model: 'Speedmaster XL 106-6+L UV Peak Performance',
    origin: 'Đức (Germany)',
    categoryVi: 'In Offset Tốc Độ Cao',
    categoryEn: 'High-Speed Offset Printing',
    capacityVi: '18,000 tờ / giờ',
    capacityEn: '18,000 sheets / hour',
    purposeVi: 'In hộp giấy mỹ phẩm, hộp thực phẩm, túi giấy cao cấp với độ phủ màu đồng nhất và sấy khô UV tức thì.',
    purposeEn: 'Printing luxury folding cartons, food packaging, and retail bags with micro-dot registration and instant UV curing.',
    specsVi: [
      '6 cụm màu in kết hợp 1 trạm tráng phủ vec-ni tự động',
      'Hệ thống đo quang phổ Inpress Control 3 tự động chỉnh màu trên đường chạy',
      'Định lượng giấy xử lý: từ 0.03mm đến 1.0mm (carton dày)',
      'Hỗ trợ mực in UV và mực gốc dầu đậu nành an toàn thực phẩm',
    ],
    specsEn: [
      '6 color units plus 1 inline automated coating unit',
      'Inpress Control 3 spectrophotometer self-adjusts ink density on-the-fly',
      'Paper thickness handling from 0.03mm to 1.0mm heavy board',
      'Full compatibility with UV curing and soy-based food-safe inks',
    ],
    image: '/images/vietlabel/factory-machine1.jpg',
    isFeatured: true,
  },
  {
    id: 'm-02',
    name: 'Máy bế tự động Bobst Novacut 106 E',
    model: 'Novacut 106 E Autoplaten',
    origin: 'Thụy Sĩ (Switzerland)',
    categoryVi: 'Gia Công Bế Định Hình',
    categoryEn: 'Precision Die-Cutting',
    capacityVi: '8,000 tờ / giờ',
    capacityEn: '8,000 sheets / hour',
    purposeVi: 'Bế đứt, bế gân cấn, răng cưa chính xác tuyệt đối từng milimet cho mọi kết cấu hộp giấy và khay trưng bày.',
    purposeEn: 'High-speed blanking, creasing, and perforating with microscopic tolerances for complex box geometries.',
    specsVi: [
      'Áp lực bế tối đa lên tới 2.6 MN (260 tấn)',
      'Khổ giấy xử lý tối đa 1,060 x 760 mm',
      'Bộ phận loại bỏ phoi rìa tự động (Automatic waste stripping)',
      'Tích hợp cảm biến quang học phát hiện lệch giấy từng micro giây',
    ],
    specsEn: [
      'Cutting force up to 2.6 MN (260 metric tons)',
      'Maximum sheet size: 1,060 x 760 mm',
      'Integrated high-speed dynamic waste stripping station',
      'Optical photo-eye alignment corrects skewed sheets in microseconds',
    ],
    image: '/images/vietlabel/factory-machine2.jpg',
    isFeatured: true,
  },
  {
    id: 'm-03',
    name: 'Máy gấp dán hộp tự động Bobst Expertfold 110 A2',
    model: 'Expertfold 110 A2 High Speed Folder-Gluer',
    origin: 'Thụy Sĩ (Switzerland)',
    categoryVi: 'Dán Hộp Tự Động',
    categoryEn: 'Automated Folding & Gluing',
    capacityVi: '450 mét / phút (tương đương 45,000 hộp / giờ)',
    capacityEn: '450 meters / min (~45,000 boxes / hour)',
    purposeVi: 'Gấp và dán các loại hộp đáy gài tự động (crash-lock bottom), hộp 4 góc, 6 góc và hộp phong bì bưu điện.',
    purposeEn: 'Continuous folding and gluing of crash-lock bottom cartons, 4-corner, 6-corner boxes, and courier envelopes.',
    specsVi: [
      'Hệ thống phun keo lạnh Valco Melton điện tử đa điểm',
      'Đầu đọc mã vạch quét kiểm tra chống lẫn lộn mẫu mã 100%',
      'Cơ chế chống trầy xước màng mờ và màng metallized',
      'Định lượng giấy từ 100gsm đến sóng N, F, E',
    ],
    specsEn: [
      'Valco Melton electronic multi-channel cold glue extrusion',
      'Inline 100% 2D/1D barcode scanner to prevent packaging mix-ups',
      'Anti-scuff belts protective against delicate matte and foil films',
      'Paperboard capability from 100gsm to micro-flutes N, F, E',
    ],
    image: '/images/vietlabel/factory-5s.webp',
    isFeatured: true,
  },
  {
    id: 'm-04',
    name: 'Máy ép kim & dập nổi tự động Masterwork MK 1060ST',
    model: 'Masterwork MK 1060ST Hot Foil Stamping',
    origin: 'Nhật Bản / Đức liên doanh',
    categoryVi: 'Ép Kim & Hiệu Ứng Bề Mặt',
    categoryEn: 'Hot Foil Stamping & Embossing',
    capacityVi: '7,500 tờ / giờ',
    capacityEn: '7,500 sheets / hour',
    purposeVi: 'Ép màng nhũ vàng, bạc, hologram 3D và dập nổi dập chìm đồng bộ trên bao bì cao cấp chống giả.',
    purposeEn: 'Applying metallic gold, silver, holographic foils, and synchronized blind embossing on anti-counterfeit packaging.',
    specsVi: [
      '12 vùng kiểm soát nhiệt độ độc lập bằng PID kỹ thuật số',
      '3 trục luồn cuộn nhũ dọc và 2 trục ngang giảm lãng phí nhũ',
      'Độ chính xác định vị ép nhũ ±0.05 mm',
    ],
    specsEn: [
      '12 individual heating zones digitally managed via PID controllers',
      '3 longitudinal and 2 transverse foil pull shafts saving foil trim',
      'Stamping positioning accuracy within ±0.05 mm',
    ],
    image: '/images/vietlabel/factory-appreciation.webp',
    isFeatured: true,
  },
  {
    id: 'm-05',
    name: 'Máy bồi giấy sóng tự động tốc độ cao Meiguang 1650',
    model: 'Meiguang 1650 Semi-Servo Flute Laminator',
    origin: 'Đài Loan (Taiwan)',
    categoryVi: 'Bồi Thùng Carton Sóng',
    categoryEn: 'Corrugated Flute Laminating',
    capacityVi: '12,000 tờ / giờ',
    capacityEn: '12,000 sheets / hour',
    purposeVi: 'Bồi tờ in Offset chất lượng cao lên sóng carton 3 lớp và 5 lớp (E, B, C, EB, BC) với độ phẳng mịn tuyệt đối.',
    purposeEn: 'Laminating printed graphic sheets onto 3-ply and 5-ply corrugated flutes with bubble-free, warp-free flat output.',
    specsVi: [
      'Khổ bồi tối đa 1,650 x 1,650 mm',
      'Công nghệ định vị mắt thần servo giảm sai lệch dưới 1.5mm',
      'Bộ phận sấy nhiệt định hình chống cong vênh sau khi bồi',
    ],
    specsEn: [
      'Maximum laminating width: 1,650 x 1,650 mm',
      'High-precision optical servo registration within 1.5mm tolerance',
      'Inline heated pressing conveyer ensures warp-free board stability',
    ],
    image: '/images/vietlabel/hero-banner.webp',
    isFeatured: true,
  },
];
