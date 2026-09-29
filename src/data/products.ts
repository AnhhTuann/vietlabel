export interface ProductCategory {
  id: string;
  slug: string;
  nameVi: string;
  nameEn: string;
  shortDescVi: string;
  shortDescEn: string;
  iconName: string;
  subcategories: {
    id: string;
    slug: string;
    nameVi: string;
    nameEn: string;
    descriptionVi: string;
    descriptionEn: string;
  }[];
}

export interface ProductItem {
  id: string;
  slug: string;
  categoryId: string;
  categorySlug: string;
  categoryNameVi: string;
  categoryNameEn: string;
  subcategoryId: string;
  nameVi: string;
  nameEn: string;
  code: string;
  descriptionVi: string;
  descriptionEn: string;
  specs: {
    materialVi: string;
    materialEn: string;
    dimensionsVi: string;
    dimensionsEn: string;
    printTechniqueVi: string;
    printTechniqueEn: string;
    finishingVi: string;
    finishingEn: string;
    moq: string;
    leadTimeVi: string;
    leadTimeEn: string;
  };
  featuresVi: string[];
  featuresEn: string[];
  applicationsVi: string[];
  applicationsEn: string[];
  heroImage: string;
  gallery: string[];
  isFeatured?: boolean;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'hop-giay',
    slug: 'hop-giay',
    nameVi: 'Hộp giấy cao cấp',
    nameEn: 'Premium Paper Boxes',
    shortDescVi: 'Hộp cứng quà tặng, hộp mỹ phẩm, hộp mềm gấp, hộp dược phẩm với kỹ thuật ép kim, dập nổi tinh tế.',
    shortDescEn: 'Rigid gift boxes, cosmetic cartons, folding paperboard boxes with hot foil stamping and embossing.',
    iconName: 'Package',
    subcategories: [
      {
        id: 'hop-cung',
        slug: 'hop-cung',
        nameVi: 'Hộp cứng cao cấp (Rigid Box)',
        nameEn: 'Luxury Rigid Boxes',
        descriptionVi: 'Hộp bồi carton lạnh từ 2mm - 3mm, phủ giấy mỹ thuật cao cấp dành cho quà tặng doanh nghiệp, yến sào, rượu vang.',
        descriptionEn: 'Chipboard boxes wrapped with specialty art papers for corporate gifts, wines, and luxury goods.',
      },
      {
        id: 'hop-mem',
        slug: 'hop-mem',
        nameVi: 'Hộp mềm gấp xếp (Folding Carton)',
        nameEn: 'Folding Paperboard Cartons',
        descriptionVi: 'Giấy Ivory, Duplex, Bristol từ 250gsm - 400gsm phù hợp cho ngành dược phẩm, thực phẩm đóng gói, mỹ phẩm.',
        descriptionEn: 'Ivory, Duplex, Bristol paperboards for pharmaceuticals, packaged foods, and personal care.',
      },
      {
        id: 'hop-cua-so',
        slug: 'hop-cua-so',
        nameVi: 'Hộp cửa sổ trong suốt (Window Box)',
        nameEn: 'Clear Window Boxes',
        descriptionVi: 'Hộp giấy dán màng PET/PVC thân thiện để khách hàng nhìn thấy sản phẩm thực tế bên trong.',
        descriptionEn: 'Boxes with die-cut windows patched with eco PET/PVC film to showcase product contents.',
      },
    ],
  },
  {
    id: 'tui-giay',
    slug: 'tui-giay',
    nameVi: 'Túi giấy thời trang & quà tặng',
    nameEn: 'Paper Shopping Bags',
    shortDescVi: 'Túi giấy Kraft nâu thân thiện môi trường, túi giấy Ivory sang trọng có quai ruy băng, quai xoắn bền chắc.',
    shortDescEn: 'Eco-friendly natural kraft bags, luxury laminated shopping bags with grosgrain or twisted handles.',
    iconName: 'ShoppingBag',
    subcategories: [
      {
        id: 'tui-kraft',
        slug: 'tui-kraft',
        nameVi: 'Túi giấy Kraft môi trường',
        nameEn: 'Eco Kraft Paper Bags',
        descriptionVi: 'Sử dụng giấy Kraft nguyên sinh hoặc tái chế 100% đạt chuẩn FSC, phân hủy tự nhiên trong 90 ngày.',
        descriptionEn: '100% virgin or recycled kraft paper with FSC chain-of-custody, biodegradable in 90 days.',
      },
      {
        id: 'tui-shop',
        slug: 'tui-shop',
        nameVi: 'Túi giấy shop thời trang & mỹ phẩm',
        nameEn: 'Retail Fashion & Cosmetic Bags',
        descriptionVi: 'Giấy Couche hoặc Ivory cán màng mờ, quai ruy băng cao cấp, in offset chuẩn màu thương hiệu.',
        descriptionEn: 'Couche or Ivory paper with matte lamination, woven ribbon handles, brand color accuracy.',
      },
    ],
  },
  {
    id: 'tui-banh-mi',
    slug: 'tui-banh-mi',
    nameVi: 'Túi giấy thực phẩm & Bánh mì',
    nameEn: 'Food & Bakery Paper Bags',
    shortDescVi: 'Giấy thấm dầu mỡ, đạt chuẩn an toàn vệ sinh thực phẩm HACCP, giấy MG trắng và Kraft nâu chuyên dụng.',
    shortDescEn: 'Greaseproof and food-safe paper bags compliant with HACCP standards for bakeries and fast food.',
    iconName: 'UtensilsCrossed',
    subcategories: [
      {
        id: 'tui-chong-dau',
        slug: 'tui-chong-dau',
        nameVi: 'Túi giấy chống dầu mỡ',
        nameEn: 'Greaseproof Bags',
        descriptionVi: 'Giấy tráng PE sinh học hoặc giấy chống dầu tự nhiên dùng cho bánh ngọt, khoai tây chiên, gà rán.',
        descriptionEn: 'Bio-coated or naturally grease-resistant paper for pastries, fries, and hot food takeaways.',
      },
      {
        id: 'tui-day-vuong',
        slug: 'tui-day-vuong',
        nameVi: 'Túi giấy đáy vuông đựng bánh',
        nameEn: 'Square Bottom Bakery Bags',
        descriptionVi: 'Túi xếp hông đáy đứng vững vàng, giữ form dáng bánh mì baguette và thực phẩm chế biến sẵn.',
        descriptionEn: 'Gusseted flat bottom bags engineered to stand upright, ideal for baguettes and baked items.',
      },
    ],
  },
  {
    id: 'tem-nhan',
    slug: 'tem-nhan',
    nameVi: 'Tem nhãn Decal cuộn & tờ',
    nameEn: 'Decal & Adhesive Labels',
    shortDescVi: 'Decal giấy, decal nhựa trong, decal vỡ bảo hành, nhãn cuộn tự động dán tốc độ cao, mạ kim nhũ.',
    shortDescEn: 'Paper decals, transparent film labels, security warranty stickers, high-speed automated roll labels.',
    iconName: 'Tag',
    subcategories: [
      {
        id: 'nhan-cuon',
        slug: 'nhan-cuon',
        nameVi: 'Decal nhãn cuộn tự động',
        nameEn: 'Automated Roll Labels',
        descriptionVi: 'Nhãn in Flexo cuộn thích hợp cho máy dán nhãn tự động ngành đồ uống, dược phẩm và hóa mỹ phẩm.',
        descriptionEn: 'Flexo roll labels optimized for high-speed automated application in beverage and cosmetics lines.',
      },
      {
        id: 'decal-xi-kim',
        slug: 'decal-xi-kim',
        nameVi: 'Decal xi bạc & xi kim loại',
        nameEn: 'Metallic & Silver Decals',
        descriptionVi: 'Tem nhãn phủ ánh kim cao cấp, chống trầy xước và chịu nước cho thiết bị điện tử, máy móc.',
        descriptionEn: 'High-end metallic foil stickers resistant to abrasion, moisture, and extreme temperatures.',
      },
    ],
  },
  {
    id: 'khay-giay',
    slug: 'khay-giay',
    nameVi: 'Khay giấy định hình & Chống sốc',
    nameEn: 'Molded Pulp & Paper Trays',
    shortDescVi: 'Giải pháp thay thế xốp nhựa EPS, khay đựng nông sản, trái cây xuất khẩu, linh kiện điện tử sinh thái.',
    shortDescEn: 'Sustainable EPS foam alternatives: molded pulp trays for agricultural export and electronics cushioning.',
    iconName: 'Layers',
    subcategories: [
      {
        id: 'khay-trai-cay',
        slug: 'khay-trai-cay',
        nameVi: 'Khay giấy đựng nông sản & trái cây',
        nameEn: 'Fruit & Produce Paper Trays',
        descriptionVi: 'Khay giấy chống ẩm giữ tươi nông sản, chịu lực xếp chồng khi vận chuyển container lạnh.',
        descriptionEn: 'Moisture-resistant trays preserving produce freshness under refrigerated container transit.',
      },
      {
        id: 'khay-dinh-hinh',
        slug: 'khay-dinh-hinh',
        nameVi: 'Khay bột giấy định hình cao cấp',
        nameEn: 'Smooth Molded Pulp Inserts',
        descriptionVi: 'Khuôn ép bột giấy bề mặt mịn chuẩn xác cho thiết bị gia dụng thông minh và mỹ phẩm cao cấp.',
        descriptionEn: 'Precision-pressed smooth molded pulp inserts for smart home devices and luxury cosmetics.',
      },
    ],
  },
  {
    id: 'thung-carton',
    slug: 'thung-carton',
    nameVi: 'Thùng carton sóng 3 - 5 - 7 lớp',
    nameEn: 'Corrugated Shipping Cartons',
    shortDescVi: 'Thùng carton bế định hình, in Flexo hoặc Offset bồi Duplex, tiêu chuẩn chịu bục xuất khẩu đường biển.',
    shortDescEn: '3, 5, 7-ply corrugated boxes, Flexo or Offset laminated Duplex, certified burst strength for sea freight.',
    iconName: 'Box',
    subcategories: [
      {
        id: 'carton-offset',
        slug: 'carton-offset',
        nameVi: 'Thùng carton in Offset bồi Duplex',
        nameEn: 'Offset Laminated Cartons',
        descriptionVi: 'Hình ảnh in offset sắc nét nhiều màu bồi sóng E, B, C cho sản phẩm tiêu dùng cao cấp xuất khẩu.',
        descriptionEn: 'Full-color offset printed sheets mounted onto E, B, or C-flutes for premium retail packaging.',
      },
      {
        id: 'carton-cong-nghiep',
        slug: 'carton-cong-nghiep',
        nameVi: 'Thùng carton công nghiệp xuất khẩu',
        nameEn: 'Heavy-Duty Industrial Shipping Boxes',
        descriptionVi: 'Sóng 5 lớp và 7 lớp chịu lực nén đỉnh cao, đạt kiểm định ECT (Edge Crush Test) và BCT.',
        descriptionEn: '5-ply and 7-ply heavy-duty boxes meeting strict ECT and BCT compressive requirements.',
      },
    ],
  },
  {
    id: 'the-cao',
    slug: 'the-cao',
    nameVi: 'Thẻ cào & Thẻ giấy thông minh',
    nameEn: 'Scratch Cards & Paper Cards',
    shortDescVi: 'Thẻ cào trúng thưởng, voucher giấy ép nhũ bảo mật, thẻ bài may mặc treo quần áo, QR code biến đổi.',
    shortDescEn: 'Promotional scratch cards, tamper-proof security vouchers, apparel hangtags, and dynamic variable QR cards.',
    iconName: 'CreditCard',
    subcategories: [
      {
        id: 'the-cao-bao-mat',
        slug: 'the-cao-bao-mat',
        nameVi: 'Thẻ cào khuyến mãi bảo mật',
        nameEn: 'High-Security Scratch Cards',
        descriptionVi: 'Công nghệ phủ nhũ cào chống soi đèn, in mã code biến đổi dữ liệu số hóa bảo mật tuyệt đối.',
        descriptionEn: 'Light-impenetrable scratch-off coatings with serialized alphanumeric variables and encryption.',
      },
      {
        id: 'the-treo-tag',
        slug: 'the-treo-tag',
        nameVi: 'Thẻ treo mác quần áo (Hangtag)',
        nameEn: 'Apparel Hangtags & Brand Tags',
        descriptionVi: 'Giấy Kraft dày, giấy mỹ thuật bồi nhiều lớp, bế hình độc đáo, xỏ mắt ngỗng và dây dù sang trọng.',
        descriptionEn: 'Multi-layer duplexed art boards with eyelet riveting, die-cut custom shapes, and waxed cords.',
      },
    ],
  },
  {
    id: 'posm',
    slug: 'posm',
    nameVi: 'POSM & Kệ giấy trưng bày',
    nameEn: 'POSM & Paper Display Stands',
    shortDescVi: 'Kệ giấy trưng bày siêu thị (Floor Display), khay để bàn (Counter Display), hanger treo, standee giấy carton.',
    shortDescEn: 'Retail floor displays, countertop display units (CDU), cardboard hangars, and promotional standees.',
    iconName: 'LayoutGrid',
    subcategories: [
      {
        id: 'ke-san',
        slug: 'ke-san',
        nameVi: 'Kệ sàn trưng bày siêu thị (Floor Display)',
        nameEn: 'Supermarket Floor Displays',
        descriptionVi: 'Kết cấu chịu tải 15-30kg mỗi tầng, gấp gọn phẳng (flat-pack) dễ dàng lắp ráp tại điểm bán trong 3 phút.',
        descriptionEn: 'Load capacity of 15-30kg per tier, flat-pack engineering with intuitive 3-minute store assembly.',
      },
      {
        id: 'khay-de-ban',
        slug: 'khay-de-ban',
        nameVi: 'Khay kệ để bàn (Counter Display CDU)',
        nameEn: 'Countertop Display Units',
        descriptionVi: 'Đặt tại quầy thanh toán nhằm kích thích quyết định mua hàng tức thì (impulse buy).',
        descriptionEn: 'Placed at checkout counters to drive immediate impulse purchase conversions.',
      },
    ],
  },
];

export const PRODUCTS_LIST: ProductItem[] = [
  {
    id: 'prod-01',
    slug: 'hop-cung-qua-tang-sang-trong-nam-cham',
    categoryId: 'hop-giay',
    categorySlug: 'hop-giay',
    categoryNameVi: 'Hộp giấy cao cấp',
    categoryNameEn: 'Premium Paper Boxes',
    subcategoryId: 'hop-cung',
    nameVi: 'Hộp cứng nắp nam châm bồi giấy mỹ thuật',
    nameEn: 'Luxury Magnetic Closure Rigid Box',
    code: 'AP-RB-01',
    descriptionVi: 'Dòng hộp cứng nắp gập gắn nam châm ẩn giấu tinh xảo. Sử dụng cốt carton lạnh tỉ trọng cao 2.5mm bọc ngoài bằng giấy mỹ thuật gân ánh ngọc trai, bên trong lót khay EVA định hình bọc nhung cao cấp.',
    descriptionEn: 'Premium book-style rigid box with concealed magnetic snaps. Constructed with 2.5mm high-density greyboard wrapped in pearlescent textured art paper, fitted with velvet-flocked custom EVA cushioning.',
    specs: {
      materialVi: 'Carton lạnh 2.5mm bồi giấy mỹ thuật Ý 150gsm, lót mút EVA phủ nhung',
      materialEn: '2.5mm greyboard wrapped with 150gsm Italian art paper, velvet EVA tray',
      dimensionsVi: '280 x 200 x 70 mm (Tùy biến theo kích cỡ sản phẩm)',
      dimensionsEn: '280 x 200 x 70 mm (Customizable on demand)',
      printTechniqueVi: 'In Offset 4 màu UV sắc nét, độ chính xác hạt trâm cao',
      printTechniqueEn: '4-Color UV Offset printing with micro-dot fidelity',
      finishingVi: 'Ép kim nhũ vàng 24K, dập nổi 3D đa tầng logo thương hiệu',
      finishingEn: '24K hot foil stamping, multi-level 3D emboss on brand emblem',
      moq: '500 chiếc / lô',
      leadTimeVi: '7 - 10 ngày làm việc sau khi duyệt mẫu',
      leadTimeEn: '7 - 10 working days after sample sign-off',
    },
    featuresVi: [
      'Cấu trúc carton lạnh chịu lực va đập tuyệt đối khi vận chuyển',
      'Nam châm vĩnh cửu lực hút mạnh mẽ, đóng mở êm ái',
      'Chất liệu đạt tiêu chuẩn kiểm định RoHS và FSC bền vững',
      'Được thiết kế tối ưu hóa diện tích bày biện trên kệ quà tặng',
    ],
    featuresEn: [
      'Heavy-duty greyboard framework ensures structural protection in transit',
      'Permanent neodymium magnets deliver crisp, tactile snapping closure',
      'Eco-friendly materials compliant with FSC and RoHS directives',
      'Engineered for maximum visual presence on retail counters',
    ],
    applicationsVi: ['Bao bì yến sào & đông trùng hạ thảo', 'Quà tặng doanh nghiệp VIP', 'Đồng hồ & trang sức xa xỉ', 'Bộ mỹ phẩm phục hồi da'],
    applicationsEn: ['Birds nest & premium ginseng', 'VIP corporate gift sets', 'Luxury watches & jewelry', 'High-end cosmetic regimens'],
    heroImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop',
    ],
    isFeatured: true,
  },
  {
    id: 'prod-02',
    slug: 'tui-giay-kraft-quai-xoan-fsc',
    categoryId: 'tui-giay',
    categorySlug: 'tui-giay',
    categoryNameVi: 'Túi giấy thời trang & quà tặng',
    categoryNameEn: 'Paper Shopping Bags',
    subcategoryId: 'tui-kraft',
    nameVi: 'Túi giấy Kraft nâu quai xoắn đạt chuẩn FSC',
    nameEn: 'FSC Certified Brown Kraft Twisted Handle Bag',
    code: 'AP-KB-02',
    descriptionVi: 'Túi giấy Kraft nâu Nhật Bản định lượng 160gsm dẻo dai, đáy túi gia cố lót cứng chịu tải 7-10kg. Quai giấy xoắn cơ học chắc chắn, 100% tái chế sinh học không tạo rác thải vi nhựa.',
    descriptionEn: 'High-tensile 160gsm Japanese virgin kraft paper bag with reinforced bottom board holding up to 10kg. Sturdy twisted paper handles, 100% biodegradable and zero micro-plastic footprint.',
    specs: {
      materialVi: 'Giấy Kraft nâu Nhật Bản 160 - 200gsm, 100% sợi gỗ nguyên sinh FSC',
      materialEn: '160 - 200gsm Japanese Brown Kraft, 100% FSC virgin wood fibers',
      dimensionsVi: '320 x 260 x 120 mm (Ngang x Cao x Hông)',
      dimensionsEn: '320 x 260 x 120 mm (Width x Height x Gusset)',
      printTechniqueVi: 'In Flexo hoặc Offset 1-4 màu mực gốc đậu nành an toàn (Soy Ink)',
      printTechniqueEn: '1 to 4 colors Flexo/Offset with eco-friendly soy inks',
      finishingVi: 'Cắt dán máy tự động, quai giấy xoắn dán keo nhiệt Hotmelt siêu bền',
      finishingEn: 'Fully automatic machine formation, hotmelt bonded handles',
      moq: '1,000 chiếc / lô',
      leadTimeVi: '5 - 7 ngày làm việc',
      leadTimeEn: '5 - 7 working days',
    },
    featuresVi: [
      'Chứng chỉ FSC CoC kiểm chứng nguồn gốc gỗ khai thác có trách nhiệm',
      'Chịu tải trọng cao nhờ thớ sợi giấy dài và dẻo dai',
      'Mực in gốc dầu thực vật không mùi, an toàn cho người tiếp xúc',
      'Phù hợp tiêu chuẩn bao bì xanh xuất khẩu châu Âu và Mỹ',
    ],
    featuresEn: [
      'Certified FSC Chain-of-Custody from responsibly managed forests',
      'Enhanced tensile tear strength via long virgin pulp fibers',
      'Odorless vegetable soy-based inks safe for everyday handling',
      'Compliant with EU and US sustainable packaging regulations',
    ],
    applicationsVi: ['Chuỗi thời trang bền vững', 'Nhà sách & văn phòng phẩm', 'Siêu thị thực phẩm hữu cơ', 'Sự kiện hội nghị & triển lãm'],
    applicationsEn: ['Eco-apparel boutiques', 'Bookstores & stationeries', 'Organic grocery supermarkets', 'Conferences & trade shows'],
    heroImage: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=1000&auto=format&fit=crop',
    ],
    isFeatured: true,
  },
  {
    id: 'prod-03',
    slug: 'hop-my-pham-ivory-can-mang-metallized',
    categoryId: 'hop-giay',
    categorySlug: 'hop-giay',
    categoryNameVi: 'Hộp giấy cao cấp',
    categoryNameEn: 'Premium Paper Boxes',
    subcategoryId: 'hop-mem',
    nameVi: 'Hộp mỹ phẩm màng Metallized phủ UV định hình',
    nameEn: 'Metallized Cosmetic Folding Carton with Spot UV',
    code: 'AP-FC-03',
    descriptionVi: 'Hộp mềm chất liệu giấy Ivory 350gsm bồi màng kim loại Metallized tán xạ ánh sáng 7 màu. Kỹ thuật in phủ UV cát nhám kết hợp UV bóng định vị tạo độ tương phản xúc giác mạnh mẽ.',
    descriptionEn: 'Folding carton crafted from 350gsm premium Ivory board laminated with holographic metallized film. Spot gloss UV contrasted against matte tactile sand varnish gives an unmistakable tactile allure.',
    specs: {
      materialVi: 'Giấy Ivory 350gsm nhập khẩu bồi màng Metallized tráng gương',
      materialEn: '350gsm imported Ivory board with metallized mirror film',
      dimensionsVi: '80 x 80 x 140 mm',
      dimensionsEn: '80 x 80 x 140 mm',
      printTechniqueVi: 'In Offset UV chuyên dụng trên màng nhôm kim loại',
      printTechniqueEn: 'Specialized UV Offset on non-absorbent metallic surface',
      finishingVi: 'Cán màng mờ, dập nổi vi tính, phủ UV định vị 3D, bế răng cưa',
      finishingEn: 'Matte lamination, precision embossing, 3D spot UV, laser die-cut',
      moq: '2,000 chiếc / lô',
      leadTimeVi: '7 - 9 ngày làm việc',
      leadTimeEn: '7 - 9 working days',
    },
    featuresVi: [
      'Hiệu ứng quang học lấp lánh ngăn ngừa hàng giả và sao chép bao bì',
      'Độ khít nắp và đáy gài khóa tự động chắc chắn',
      'Chống ẩm và chống trầy xước bề mặt vượt trội',
    ],
    featuresEn: [
      'Dynamic iridescent reflections serve as anti-counterfeiting shield',
      'Engineered auto-lock bottom for swift factory packaging filling',
      'High resistance against scratches, humidity, and abrasion',
    ],
    applicationsVi: ['Serum & kem dưỡng da chuyên sâu', 'Nước hoa cao cấp', 'Thực phẩm chức năng collagen', 'Dược mỹ phẩm trị liệu'],
    applicationsEn: ['Anti-aging serums & creams', 'Luxury perfumes', 'Collagen nutraceuticals', 'Clinical cosmeceuticals'],
    heroImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop',
    ],
    isFeatured: true,
  },
  {
    id: 'prod-04',
    slug: 'thung-carton-song-5-lop-in-offset',
    categoryId: 'thung-carton',
    categorySlug: 'thung-carton',
    categoryNameVi: 'Thùng carton sóng 3 - 5 - 7 lớp',
    categoryNameEn: 'Corrugated Shipping Cartons',
    subcategoryId: 'carton-offset',
    nameVi: 'Thùng carton sóng 5 lớp in Offset xuất khẩu',
    nameEn: '5-Ply Offset Laminated Heavy-Duty Carton',
    code: 'AP-CB-04',
    descriptionVi: 'Thùng carton kết cấu sóng BC hoặc BE 5 lớp, mặt ngoài bồi giấy Duplex in Offset 4 màu cán màng bóng chống thấm nước. Đảm bảo độ bền nén khi xếp chồng 8-10 tầng trong kho hàng logistics.',
    descriptionEn: '5-ply corrugated shipper (BC or BE flute) laminated with 4-color offset printed Duplex paperboard with water-resistant lamination. Withstands 8 to 10 tiers of vertical pallet stacking.',
    specs: {
      materialVi: 'Giấy mặt Duplex 250gsm bồi sóng 5 lớp giấy Kraff định lượng 150/140/140/150',
      materialEn: '250gsm Duplex facing laminated to 5-ply kraft flutes (150/140/140/150)',
      dimensionsVi: '600 x 400 x 400 mm (Tiêu chuẩn pallet chuẩn)',
      dimensionsEn: '600 x 400 x 400 mm (Standard Euro-pallet modular)',
      printTechniqueVi: 'In Offset khổ lớn máy KBA Rapida 106 6 màu công suất cao',
      printTechniqueEn: 'Large-format KBA Rapida 106 6-color high-speed offset',
      finishingVi: 'Cán màng bóng BOPP chống thấm nước, bế dán tự động, đóng ghim đồng',
      finishingEn: 'Waterproof BOPP gloss film, automatic slotting, copper stitching',
      moq: '500 thùng / lô',
      leadTimeVi: '5 - 7 ngày làm việc',
      leadTimeEn: '5 - 7 working days',
    },
    featuresVi: [
      'Độ chịu lực bục (Bursting Strength) đạt trên 14 kg/cm²',
      'Chống chịu độ ẩm cao trong hành trình vận tải container đường biển',
      'Bề mặt in ấn thể hiện đầy đủ hình ảnh sản phẩm và mã vạch Barcode chuẩn ISO',
    ],
    featuresEn: [
      'Bursting strength exceeds 14 kg/cm² for heavy commercial goods',
      'Resistant to sea cargo relative humidity fluctuations',
      'Photorealistic imagery with scan-certified ISO barcode readability',
    ],
    applicationsVi: ['Điện gia dụng & quạt máy', 'Nông sản xuất khẩu sấy khô', 'Dụng cụ thể thao & phụ tùng xe', 'Đồ gia dụng nhà bếp'],
    applicationsEn: ['Consumer electronics & appliances', 'Export dried fruits & coffee', 'Automotive replacement parts', 'Kitchen cookware sets'],
    heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop',
    ],
    isFeatured: true,
  },
  {
    id: 'prod-05',
    slug: 'tui-giay-banh-mi-chong-dau-haccp',
    categoryId: 'tui-banh-mi',
    categorySlug: 'tui-banh-mi',
    categoryNameVi: 'Túi giấy thực phẩm & Bánh mì',
    categoryNameEn: 'Food & Bakery Paper Bags',
    subcategoryId: 'tui-chong-dau',
    nameVi: 'Túi giấy bánh mì baguette chống thấm dầu HACCP',
    nameEn: 'HACCP Greaseproof Bread Bag',
    code: 'AP-FB-05',
    descriptionVi: 'Sản xuất từ giấy thấm dầu trắng MG thực phẩm định lượng 40 - 50gsm, không huỳnh quang gây hại, thoáng khí giữ vỏ bánh giòn lâu mà không bị ỉu do đọng hơi nước.',
    descriptionEn: 'Engineered with 40-50gsm food-grade white MG grease-resistant paper, zero optical brighteners, breathable pore structure preserving crust crispness without trapping steam condensation.',
    specs: {
      materialVi: 'Giấy MG chuyên dụng thực phẩm 45gsm nhập khẩu Thụy Điển',
      materialEn: '45gsm food-grade MG paper imported from Sweden',
      dimensionsVi: '120 x 280 x 40 mm (hoặc theo kích thước ổ bánh)',
      dimensionsEn: '120 x 280 x 40 mm (Custom sizes tailored to loaves)',
      printTechniqueVi: 'In Flexo tốc độ cao 2 màu mực gốc nước an toàn thực phẩm',
      printTechniqueEn: 'High-speed 2-color flexographic with water-based food ink',
      finishingVi: 'Gấp dán ống tự động liên hoàn bằng keo tinh bột ngô hữu cơ',
      finishingEn: 'Continuous tube forming with organic cornstarch adhesive',
      moq: '10,000 túi / lô',
      leadTimeVi: '4 - 6 ngày làm việc',
      leadTimeEn: '4 - 6 working days',
    },
    featuresVi: [
      'Chứng nhận an toàn tiếp xúc thực phẩm theo tiêu chuẩn HACCP và FDA',
      'Khả năng chống thấm dầu mỡ cấp độ KIT 7',
      'Có thể hâm nóng an toàn trong lò vi sóng',
    ],
    featuresEn: [
      'HACCP & US FDA food contact certified compliant',
      'Grease barrier resistance certified up to KIT 7 level',
      'Microwave safe for hot reheat applications',
    ],
    applicationsVi: ['Bánh mì truyền thống Việt Nam', 'Tiệm bánh ngọt Pháp & Croissant', 'Sandwich đồ ăn sáng mang đi', 'Cửa hàng thức ăn nhanh'],
    applicationsEn: ['Artisanal Vietnamese Banh Mi', 'French bakeries & croissants', 'Grab-and-go morning sandwiches', 'Fast food QSR chains'],
    heroImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop',
    ],
    isFeatured: true,
  },
  {
    id: 'prod-06',
    slug: 'ke-giay-trung-bay-posm-sieu-thi',
    categoryId: 'posm',
    categorySlug: 'posm',
    categoryNameVi: 'POSM & Kệ giấy trưng bày',
    categoryNameEn: 'POSM & Paper Display Stands',
    subcategoryId: 'ke-san',
    nameVi: 'Kệ giấy sàn trưng bày siêu thị (Floor Display 4 tầng)',
    nameEn: '4-Tier Cardboard Retail Floor Display Stand',
    code: 'AP-POSM-06',
    descriptionVi: 'Kệ trưng bày chất liệu sóng carton tăng cường chịu lực 25kg mỗi tầng. In ấn offset rực rỡ thu hút ánh nhìn tại điểm bán lẻ, thiết kế module gấp phẳng tiết kiệm 70% chi phí vận chuyển phân phối.',
    descriptionEn: 'Floor stand made with heavy-duty fluted corrugated core holding up to 25kg per tray. High-definition offset graphics captivate shoppers, flat-pack engineering reducing freight costs by 70%.',
    specs: {
      materialVi: 'Giấy Duplex 350gsm bồi sóng đôi EB gia cường thanh đỡ kim loại phụ',
      materialEn: '350gsm Duplex laminated to heavy EB double flute with steel supports',
      dimensionsVi: '600 x 450 x 1650 mm (Rộng x Sâu x Cao có Header)',
      dimensionsEn: '600 x 450 x 1650 mm (Width x Depth x Height with Header)',
      printTechniqueVi: 'In Offset khổ đại 4 màu CMYK phủ màng bóng bảo vệ',
      printTechniqueEn: 'Vibrant CMYK large-format offset with glossy protective shield',
      finishingVi: 'Bế khuôn răng cưa lắp ráp mộng gài không cần keo dán phức tạp',
      finishingEn: 'Interlocking slotted tabs allowing toolless assembly in minutes',
      moq: '50 bộ / lô',
      leadTimeVi: '7 - 10 ngày làm việc',
      leadTimeEn: '7 - 10 working days',
    },
    featuresVi: [
      'Lắp ráp dễ dàng chỉ trong 3 phút tại cửa hàng không cần ốc vít',
      'Khung chịu tải cao không bị võng sau thời gian dài trưng bày',
      'Dễ dàng thay đổi header chương trình khuyến mãi theo mùa',
    ],
    featuresEn: [
      'Swift 3-minute tool-free assembly on supermarket floors',
      'Structural rigidity prevents tray sagging under heavy loads',
      'Interchangeable seasonal promo header board for campaigns',
    ],
    applicationsVi: ['Bánh kẹo & nước giải khát mùa Tết', 'Hóa mỹ phẩm & dầu gội khuyến mãi', 'Đồ chơi trẻ em & dụng cụ học sinh', 'Sản phẩm mới ra mắt'],
    applicationsEn: ['Festive confectionery & beverages', 'Personal care & shampoo campaigns', 'Toys & educational supplies', 'New product launches'],
    heroImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop',
    ],
    isFeatured: true,
  },
  {
    id: 'prod-07',
    slug: 'in-tem-nhan-decal-cuon-nganh-dau-nhot',
    categoryId: 'tem-nhan',
    categorySlug: 'tem-nhan',
    categoryNameVi: 'Tem nhãn Decal cuộn & tờ',
    categoryNameEn: 'Decal & Adhesive Labels',
    subcategoryId: 'nhan-cuon',
    nameVi: 'In tem nhãn Decal cuộn chuyên dụng ngành Dầu nhớt & Hóa chất',
    nameEn: 'Self-Adhesive Roll Labels for Industrial Lubricants & Oils',
    code: 'VL-LB-07',
    descriptionVi: 'Dòng tem nhãn decal nhựa tổng hợp PP/PE hoặc màng xi kim loại kháng dầu nhớt, chịu hóa chất tẩy rửa, bám dính chắc chắn trên bề mặt can nhựa HDPE và thùng phi kim loại mà không bị phồng rộp.',
    descriptionEn: 'High-durability synthetic PP/PE adhesive roll labels engineered with chemical and grease barrier layers. Perfect high-speed machine dispensing on HDPE oil cans and metal drums.',
    specs: {
      materialVi: 'Decal nhựa PP/PE tổng hợp, keo dán cao su acrylic bám dính cao',
      materialEn: 'Synthetic PP/PE film, ultra-high tack acrylic adhesive',
      dimensionsVi: 'Theo quy cách can nhớt 0.8L, 1L, 4L, 18L và thùng phi 200L',
      dimensionsEn: 'Custom sizes tailored for 0.8L, 1L, 4L, 18L cans and 200L drums',
      printTechniqueVi: 'In Flexo cuộn công nghiệp lên tới 8 màu mực UV bền sáng',
      printTechniqueEn: '8-Color industrial UV flexographic roll-to-roll printing',
      finishingVi: 'Cán màng bóng kháng nước hóa chất, bế cuộn theo chiều máy dán tự động',
      finishingEn: 'Chemical-resistant gloss lamination, precision roll slitting',
      moq: '2,000 nhãn / cuộn',
      leadTimeVi: '3 - 5 ngày làm việc',
      leadTimeEn: '3 - 5 working days',
    },
    featuresVi: [
      'Chống dầu nhớt, dung môi, kiềm và nước tuyệt đối 100%',
      'Keo dán đặc chủng chịu nhiệt độ từ -20°C đến +80°C',
      'Định vị cuộn chuẩn xác từng milimet cho dây chuyền chiết rót tốc độ cao',
    ],
    featuresEn: [
      '100% resistant to mineral oils, solvents, acids, and water wash',
      'Specialized tack engineered for temperatures ranging -20°C to +80°C',
      'Micro-gap roll registration optimized for high-speed automated dispensers',
    ],
    applicationsVi: ['Dầu nhớt động cơ xe máy & ô tô', 'Dầu thủy lực & hóa chất công nghiệp', 'Dung dịch làm mát & nước rửa kính', 'Sơn và chất phủ bề mặt'],
    applicationsEn: ['Motorcycle and automotive engine oils', 'Hydraulic fluid and industrial lubricants', 'Coolants and windshield liquids', 'Coatings and paint drums'],
    heroImage: '/images/vietlabel/label-dau-nhot.webp',
    gallery: [
      '/images/vietlabel/label-dau-nhot.webp',
      '/images/vietlabel/factory-machine1.jpg',
    ],
    isFeatured: true,
  },
  {
    id: 'prod-08',
    slug: 'in-tem-nhan-pop-up-gap-mo-thong-minh',
    categoryId: 'tem-nhan',
    categorySlug: 'tem-nhan',
    categoryNameVi: 'Tem nhãn Decal cuộn & tờ',
    categoryNameEn: 'Decal & Adhesive Labels',
    subcategoryId: 'nhan-cuon',
    nameVi: 'In tem nhãn Pop-up gập mở đa tầng mở rộng diện tích thông tin',
    nameEn: 'Multi-Layer Pop-Up Expandable Booklet & Peel-and-Reveal Labels',
    code: 'VL-LB-08',
    descriptionVi: 'Giải pháp tem nhãn dạng cuốn sổ nhỏ (Booklet label / Pop-up) tích hợp trên bao bì nhỏ. Giúp nhà sản xuất in đầy đủ hướng dẫn sử dụng đa ngôn ngữ, thành phần y tế hoặc chương trình khuyến mại trúng thưởng mà không cần tăng kích thước bao bì.',
    descriptionEn: 'Innovative multi-page fold-out booklet label affixed directly to containers. Perfect for regulatory compliance, multilingual instructions, and promotional peel-to-reveal campaigns on compact containers.',
    specs: {
      materialVi: 'Decal giấy hoặc màng nhựa kết hợp lớp gập mở nhiều trang',
      materialEn: 'Multi-panel synthetic/paper facestock with resealable hinge',
      dimensionsVi: 'Tùy biến theo kích thước chai lọ mỹ phẩm, dược phẩm hoặc nông dược',
      dimensionsEn: 'Customizable sizes for cosmetics, pharmaceuticals, and agrochemicals',
      printTechniqueVi: 'In Flexo kết hợp kỹ thuật số đa tầng mực UV sắc nét',
      printTechniqueEn: 'Hybrid Flexo & Digital printing with micro-font clarity',
      finishingVi: 'Bế khuôn gấp nếp Z-fold, keo đóng mở nhiều lần không rách giấy',
      finishingEn: 'Precision Z-fold blanking, resealable repositionable adhesive',
      moq: '3,000 nhãn / lô',
      leadTimeVi: '5 - 7 ngày làm việc',
      leadTimeEn: '5 - 7 working days',
    },
    featuresVi: [
      'Gấp 3 - 8 trang nội dung trên diện tích một con nhãn duy nhất',
      'Lớp keo dán đóng mở lại (Resealable) lên tới 50 lần',
      'Đạt chuẩn các quy định ghi nhãn dược phẩm và nông dược quốc tế',
    ],
    featuresEn: [
      'Expands printable real estate by 3x to 8x on a single footprint',
      'Resealable adhesive remains functional after 50+ peel operations',
      'Compliant with international agrochemical and pharmaceutical labeling rules',
    ],
    applicationsVi: ['Thuốc thú y & dược phẩm kê đơn', 'Mỹ phẩm xuất khẩu song ngữ', 'Thuốc bảo vệ thực vật & nông dược', 'Chương trình cào thẻ & khuyến mại'],
    applicationsEn: ['Veterinary and human prescription drugs', 'Multilingual export personal care items', 'Agrochemicals and crop science', 'Interactive promotional loyalty sweeps'],
    heroImage: '/images/vietlabel/label-popup.webp',
    gallery: [
      '/images/vietlabel/label-popup.webp',
      '/images/vietlabel/label-duoc-pham.webp',
    ],
    isFeatured: true,
  },
];
