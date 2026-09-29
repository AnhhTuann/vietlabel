export interface JobPosition {
  id: string;
  titleVi: string;
  titleEn: string;
  departmentVi: string;
  departmentEn: string;
  locationVi: string;
  locationEn: string;
  typeVi: string;
  typeEn: string;
  salaryVi: string;
  salaryEn: string;
  deadline: string;
  experienceVi: string;
  experienceEn: string;
  responsibilitiesVi: string[];
  responsibilitiesEn: string[];
  requirementsVi: string[];
  requirementsEn: string[];
  benefitsVi: string[];
  benefitsEn: string[];
}

export const JOBS_LIST: JobPosition[] = [
  {
    id: 'job-1',
    titleVi: 'Kỹ sư Vận hành Máy in Offset Heidelberg (6 màu)',
    titleEn: 'Senior Heidelberg Offset Press Operator (6-Color)',
    departmentVi: 'Khối Sản xuất & Vận hành',
    departmentEn: 'Manufacturing & Operations',
    locationVi: 'Nhà máy KCN Tân Bình Mở Rộng, TP. HCM',
    locationEn: 'Tan Binh Industrial Park, HCMC',
    typeVi: 'Toàn thời gian (Theo ca)',
    typeEn: 'Full-time (Rotational shifts)',
    salaryVi: '18 - 25 Triệu VNĐ / tháng + Phụ cấp ca',
    salaryEn: '18 - 25M VND / month + Shift allowance',
    deadline: '30/04/2026',
    experienceVi: 'Tối thiểu 3 năm kinh nghiệm vận hành máy offset Heidelberg hoặc Komori',
    experienceEn: 'Min 3 years operating Heidelberg or Komori offset presses',
    responsibilitiesVi: [
      'Trực tiếp điều khiển và vận hành máy in Offset Heidelberg XL 106 theo lệnh sản xuất',
      'Cân chỉnh bản kẽm CTP, kiểm soát mực in, áp lực ép và hệ thống sấy UV theo tiêu chuẩn màu G7',
      'Kiểm tra chất lượng tờ in đầu tiên và giám sát mẫu kiểm tra KCS trong suốt ca chạy',
      'Thực hiện bảo dưỡng định kỳ và vệ sinh thiết bị theo quy trình 5S của nhà máy',
    ],
    responsibilitiesEn: [
      'Directly operate Heidelberg XL 106 multi-color press per production work orders',
      'Register CTP plates, calibrate ink fountains, impression pressure and UV dryers per G7 standards',
      'Sign off first-piece proofing and oversee inline KCS quality monitoring through run cycles',
      'Execute routine preventative maintenance and adhere to strict 5S factory housekeeping',
    ],
    requirementsVi: [
      'Tốt nghiệp Trung cấp/Cao đẳng chuyên ngành Kỹ thuật In ấn, Cơ khí hoặc tương đương',
      'Có khả năng thẩm định màu sắc nhạy bén (vượt qua bài kiểm tra Farnsworth-Munsell 100)',
      'Tinh thần trách nhiệm cao, cẩn trọng và chịu được áp lực tiến độ sản xuất',
    ],
    requirementsEn: [
      'Diploma in Graphic Arts, Printing Technology, Mechanical Engineering or equivalent',
      'Sharp color vision acuity (passing the Farnsworth-Munsell 100 Hue Test)',
      'Strong accountability, detail-oriented demeanor under manufacturing deadlines',
    ],
    benefitsVi: [
      'Lương thưởng tháng 13 + thưởng hiệu quả sản xuất theo quý',
      'Phụ cấp cơm trưa tại căn tin nhà máy đạt chuẩn ATTP, phụ cấp ca đêm hấp dẫn',
      'Tham gia BHXH, BHYT, BHTN và gói bảo hiểm sức khỏe Bảo Việt 24/7',
      'Được đào tạo nâng cao tay nghề định kỳ cùng chuyên gia kỹ thuật hãng Heidelberg Đức',
    ],
    benefitsEn: [
      '13th month bonus + quarterly production performance incentives',
      'Free meals at certified factory cafeteria + attractive night shift bonuses',
      'Comprehensive statutory social insurance + 24/7 private healthcare insurance',
      'Hands-on technical advancement certified by Heidelberg Germany engineers',
    ],
  },
  {
    id: 'job-2',
    titleVi: 'Chuyên viên Thiết kế Kết cấu Bao bì & Dựng mẫu 3D (Packaging Structural Designer)',
    titleEn: 'Packaging Structural Designer (3D CAD / ArtiosCAD)',
    departmentVi: 'Phòng Nghiên cứu & Phát triển (R&D)',
    departmentEn: 'Research & Development (R&D)',
    locationVi: 'Văn phòng Vietlabel, 266/6 Lê Thị Riêng, P. Thới An, Q. 12, TP. HCM',
    locationEn: 'Vietlabel Office, 266/6 Le Thi Rieng, Thoi An, Dist. 12, HCMC',
    typeVi: 'Toàn thời gian (Thứ 2 - Thứ 6 & sáng Thứ 7)',
    typeEn: 'Full-time (Mon - Fri & Sat morning)',
    salaryVi: '16 - 22 Triệu VNĐ / tháng (Thỏa thuận theo năng lực)',
    salaryEn: '16 - 22M VND / month (Negotiable based on portfolio)',
    deadline: '25/04/2026',
    experienceVi: 'Tối thiểu 2 năm kinh nghiệm thiết kế cấu trúc khuôn bế bao bì hộp giấy, POSM',
    experienceEn: 'Min 2 years in structural packaging CAD and die-cut development',
    responsibilitiesVi: [
      'Tiếp nhận yêu cầu từ bộ phận kinh doanh và khách hàng, nghiên cứu giải pháp kết cấu bao bì tối ưu',
      'Sử dụng phần mềm ArtiosCAD / AutoCAD để triển khai bản vẽ kỹ thuật khuôn bế chuẩn xác',
      'Vận hành máy cắt mẫu vi tính Kongsberg để cắt mẫu thử nghiệm thực tế (mockup sample)',
      'Tư vấn tối ưu hóa kích thước nhằm giảm tiêu hao nguyên liệu giấy và thể tích đóng pallet',
    ],
    responsibilitiesEn: [
      'Translate client requirements into high-performing, cost-efficient structural concepts',
      'Draft parametric dielines using ArtiosCAD / AutoCAD with high dimensional precision',
      'Operate Kongsberg digital sample cutting table to craft tangible pre-production prototypes',
      'Optimize layout impositions to cut board waste and palletize shipping volumes',
    ],
    requirementsVi: [
      'Thành thạo ArtiosCAD, AutoCAD, Adobe Illustrator, Photoshop',
      'Hiểu rõ đặc tính cơ lý các loại giấy: Ivory, Duplex, Kraft, Carton sóng E, B, C, BC',
      'Tư duy không gian 3 chiều tốt, sáng tạo và có niềm đam mê với chất liệu giấy',
    ],
    requirementsEn: [
      'Proficiency in ArtiosCAD, AutoCAD, Adobe Illustrator, and Photoshop',
      'Solid grasp of material mechanics: Ivory, Duplex, Kraft, and corrugated flutes',
      'Exceptional 3D spatial thinking, creative flair and passion for sustainable papercraft',
    ],
    benefitsVi: [
      'Môi trường làm việc năng động, trang thiết bị máy tính cấu hình cao và bàn vẽ chuyên dụng',
      'Review lương định kỳ 1 năm/lần hoặc đột xuất theo dự án sáng tạo xuất sắc',
      'Du lịch thường niên cùng công ty tại các resort cao cấp trong và ngoài nước',
    ],
    benefitsEn: [
      'High-spec design workstations, cutting-edge software suites, and agile collaborative space',
      'Annual salary reviews with merit bonuses for standout patented packaging creations',
      'Annual corporate retreat to luxury domestic and international destinations',
    ],
  },
  {
    id: 'job-3',
    titleVi: 'Chuyên viên Kinh doanh B2B - Ngành Bao bì Giấy (Sales Executive B2B)',
    titleEn: 'B2B Packaging Sales Executive (Corporate Accounts)',
    departmentVi: 'Phòng Phát triển Kinh doanh & Dự án',
    departmentEn: 'Business Development & Projects',
    locationVi: 'Văn phòng Vietlabel, 266/6 Lê Thị Riêng, P. Thới An, Q. 12, TP. HCM',
    locationEn: 'Vietlabel Office, 266/6 Le Thi Rieng, Thoi An, Dist. 12, HCMC',
    typeVi: 'Toàn thời gian',
    typeEn: 'Full-time',
    salaryVi: '12 - 18 Triệu lương cứng + Hoa hồng dự án (Thu nhập 25 - 50 Triệu)',
    salaryEn: '12 - 18M Base + Uncapped project commissions (25 - 50M total)',
    deadline: '15/05/2026',
    experienceVi: 'Ưu tiên ứng viên có từ 1-2 năm kinh nghiệm bán hàng B2B, in ấn hoặc FMCG',
    experienceEn: '1-2 years experience in B2B corporate sales, printing, or FMCG preferred',
    responsibilitiesVi: [
      'Tìm kiếm, tiếp cận và mở rộng mạng lưới khách hàng doanh nghiệp trong ngành F&B, dược phẩm, mỹ phẩm',
      'Phối hợp cùng kỹ thuật khảo sát nhu cầu, lên bảng báo giá và đàm phán hợp đồng cung ứng dài hạn',
      'Chăm sóc và đồng hành cùng các tài khoản khách hàng chiến lược (Key Accounts)',
    ],
    responsibilitiesEn: [
      'Prospect and onboard corporate accounts across F&B, cosmetics, pharma, and electronics',
      'Coordinate with technical estimators to draft proposals and negotiate annual supply contracts',
      'Nurture key client partnerships to drive recurring volume and long-term brand equity',
    ],
    requirementsVi: [
      'Kỹ năng giao tiếp, đàm phán và thuyết trình dự án tự tin trước ban lãnh đạo đối tác',
      'Khả năng đọc hiểu thông số kỹ thuật in ấn bao bì là một lợi thế lớn',
      'Có khả năng giao tiếp tiếng Anh cơ bản để làm việc với các tập đoàn FDI',
    ],
    requirementsEn: [
      'Confident presentation, consultative negotiation, and relationship-building acumen',
      'Ability to interpret packaging specs is a distinct advantage',
      'Working conversational English competency for FDI multinational accounts',
    ],
    benefitsVi: [
      'Chính sách hoa hồng cạnh tranh bậc nhất thị trường không giới hạn trần',
      'Được cấp sim điện thoại, phụ cấp tiếp khách và chi phí công tác minh bạch',
      'Lộ trình thăng tiến rõ ràng lên vị trí Trưởng nhóm Kinh doanh (Sales Team Leader) sau 12 tháng',
    ],
    benefitsEn: [
      'Uncapped commission structure among the highest in the packaging sector',
      'Corporate phone allowance, client entertainment budget, and travel expense support',
      'Fast-track promotion pathway to Sales Team Leader within 12 months for top performers',
    ],
  },
];
