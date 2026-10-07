import { 
  Wifi, 
  Flame, 
  Coffee, 
  Pill, 
  Droplet, 
  Settings, 
  Cpu, 
  Truck, 
  Shirt, 
  ShieldCheck, 
  Leaf, 
  Fish
} from 'lucide-react';

export const LABEL_SOLUTIONS = [
  {
    id: 'rfid',
    icon: Wifi,
    titleVi: 'TEM NHÃN THÔNG MINH RFID',
    titleEn: 'SMART RFID LABELS',
    descVi: 'Kết hợp nội dung in với chip RFID, hỗ trợ nhận diện, kiểm kê và theo dõi hàng hóa. Quy cách nhãn, loại chip và dữ liệu được lựa chọn phù hợp với sản phẩm và hệ thống quản lý của doanh nghiệp.',
    descEn: 'Combining printed content with RFID chips to support identification, inventory, and tracking. Label specifications, chip types, and data are tailored to products and business management systems.'
  },
  {
    id: 'heat-resistant',
    icon: Flame,
    titleVi: 'TEM NHÃN CHỊU NHIỆT ĐỘ CAO',
    titleEn: 'HIGH TEMPERATURE LABELS',
    descVi: 'Phục vụ các ứng dụng trong ngành thép, nhựa và sản xuất công nghiệp có yêu cầu về nhiệt độ. Vật liệu, keo và phương án in được lựa chọn theo mức nhiệt, thời gian tiếp xúc và bề mặt sử dụng.',
    descEn: 'Serving applications in the steel, plastics, and industrial manufacturing sectors with high-temperature requirements. Materials, adhesives, and printing methods are selected based on temperature levels, exposure time, and surface.'
  },
  {
    id: 'food-beverage',
    icon: Coffee,
    titleVi: 'TEM NHÃN THỰC PHẨM VÀ ĐỒ UỐNG',
    titleEn: 'FOOD & BEVERAGE LABELS',
    descVi: 'In nhãn cho thực phẩm đóng gói, nước giải khát, rượu bia và sản phẩm đông lạnh. Chú trọng màu sắc thương hiệu, độ rõ của thông tin và lựa chọn vật liệu phù hợp với bao bì, điều kiện bảo quản.',
    descEn: 'Labels for packaged foods, beverages, alcoholic drinks, and frozen products. Focuses on brand colors, clear information, and selecting materials suitable for packaging and storage conditions.'
  },
  {
    id: 'pharmaceutical',
    icon: Pill,
    titleVi: 'TEM NHÃN DƯỢC PHẨM',
    titleEn: 'PHARMACEUTICAL LABELS',
    descVi: 'In nhãn cho bao bì thuốc, chai lọ và sản phẩm chăm sóc sức khỏe. Ưu tiên chữ in rõ nét, bố cục dễ đọc, đồng thời bố trí phù hợp các thông tin như số lô, hạn sử dụng và mã nhận diện.',
    descEn: 'Labels for medicine packaging, bottles, and healthcare products. Prioritizes crisp text, readable layouts, and appropriate placement of information such as batch numbers, expiry dates, and identification codes.'
  },
  {
    id: 'cosmetics',
    icon: Droplet,
    titleVi: 'TEM NHÃN HÓA MỸ PHẨM',
    titleEn: 'COSMETIC & CHEMICAL LABELS',
    descVi: 'Giải pháp nhãn cho mỹ phẩm, sản phẩm chăm sóc cá nhân và hóa chất gia dụng. Kết hợp màu sắc, vật liệu và hiệu ứng hoàn thiện để thể hiện phong cách thương hiệu, phù hợp với hình dáng và bề mặt bao bì.',
    descEn: 'Labeling solutions for cosmetics, personal care products, and household chemicals. Combines colors, materials, and finishing effects to reflect brand style, tailored to packaging shapes and surfaces.'
  },
  {
    id: 'industrial',
    icon: Settings,
    titleVi: 'TEM NHÃN CÔNG NGHIỆP',
    titleEn: 'INDUSTRIAL LABELS',
    descVi: 'In nhãn cho dầu nhớt, hóa chất, máy móc và các sản phẩm công nghiệp. Vật liệu và keo dán được lựa chọn theo môi trường sử dụng, chú trọng khả năng đọc thông số, hướng dẫn và cảnh báo trên nhãn.',
    descEn: 'Labels for lubricants, chemicals, machinery, and industrial products. Materials and adhesives are selected based on usage environments, focusing on the readability of specifications, instructions, and warnings.'
  },
  {
    id: 'electronics',
    icon: Cpu,
    titleVi: 'TEM NHÃN ĐIỆN TỬ',
    titleEn: 'ELECTRONIC LABELS',
    descVi: 'Cung cấp nhãn thông số kỹ thuật, nhãn dây điện, nhãn hiển thị và mã nhận diện linh kiện. Chú trọng độ chính xác của kích thước, chi tiết in và khả năng đọc mã trên những bề mặt có diện tích hạn chế.',
    descEn: 'Provides technical specification labels, wire labels, display labels, and component ID codes. Emphasizes precise dimensions, printing details, and code readability on limited surface areas.'
  },
  {
    id: 'logistics',
    icon: Truck,
    titleVi: 'TEM NHÃN LOGISTICS VÀ VẬN CHUYỂN',
    titleEn: 'LOGISTICS & SHIPPING LABELS',
    descVi: 'In nhãn vận đơn, mã kiện hàng, nhãn kho và cảnh báo bảo quản. Nội dung được trình bày rõ ràng, quy cách phù hợp với thiết bị in và cách dán, hỗ trợ phân loại, giao nhận và theo dõi hàng hóa.',
    descEn: 'Shipping labels, package codes, warehouse labels, and storage warnings. Contents are clearly presented, with specs suited to printing and dispensing equipment, aiding in sorting, delivery, and tracking.'
  },
  {
    id: 'apparel',
    icon: Shirt,
    titleVi: 'TEM NHÃN NGÀNH MAY MẶC',
    titleEn: 'APPAREL LABELS',
    descVi: 'In nhãn kích cỡ, giá bán, thành phần, hướng dẫn bảo quản và thẻ treo sản phẩm. Thiết kế đồng bộ với nhận diện thương hiệu, lựa chọn chất liệu và cách hoàn thiện phù hợp với vị trí gắn nhãn.',
    descEn: 'Size labels, price tags, material composition, care instructions, and hangtags. Designed in sync with brand identity, selecting materials and finishing methods appropriate for label placement.'
  },
  {
    id: 'security',
    icon: ShieldCheck,
    titleVi: 'TEM NHÃN CHỐNG GIẢ VÀ BẢO HÀNH',
    titleEn: 'ANTI-COUNTERFEIT & WARRANTY LABELS',
    descVi: 'Các giải pháp nhãn niêm phong, tem bảo hành, hologram và mã xác thực phục vụ bảo vệ thương hiệu. Lựa chọn cấu trúc tem, dữ liệu và cách kiểm tra phù hợp với mục đích sử dụng của từng sản phẩm.',
    descEn: 'Tamper-evident seals, warranty labels, holograms, and authentication codes for brand protection. Selects label structures, data, and verification methods suited to each product\'s purpose.'
  },
  {
    id: 'eco',
    icon: Leaf,
    titleVi: 'TEM NHÃN PHÂN HỦY SINH HỌC',
    titleEn: 'BIODEGRADABLE LABELS',
    descVi: 'Giải pháp tem nhãn sử dụng vật liệu có khả năng phân hủy sinh học trong những điều kiện xác định. Vật liệu nền, keo và mực in cần được xem xét đồng bộ để phù hợp với bao bì và yêu cầu môi trường của sản phẩm.',
    descEn: 'Labeling solutions using biodegradable materials under specific conditions. Facestock, adhesives, and inks are considered cohesively to match the packaging and environmental requirements of the product.'
  },
  {
    id: 'agriculture',
    icon: Fish,
    titleVi: 'TEM NHÃN THỦY SẢN VÀ NÔNG NGHIỆP',
    titleEn: 'SEAFOOD & AGRICULTURE LABELS',
    descVi: 'In nhãn cho thủy hải sản, nông sản, thực phẩm đông lạnh và vật tư nông nghiệp. Chú trọng thông tin truy xuất, lựa chọn vật liệu và keo dán theo độ ẩm, nhiệt độ bảo quản và bề mặt bao bì.',
    descEn: 'Labels for seafood, agricultural produce, frozen foods, and farming supplies. Focuses on traceability information, selecting materials and adhesives based on humidity, storage temperatures, and packaging surfaces.'
  }
];
