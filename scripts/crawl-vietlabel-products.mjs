import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images', 'vietlabel', 'products');
const PRODUCTS_FILE = path.join(ROOT_DIR, 'src', 'data', 'products.ts');

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'vi,en-US;q=0.7,en;q=0.3',
};

async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return await res.text();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`[Retry ${i + 1}/${retries}] Failed fetching ${url}: ${err.message}. Retrying...`);
      await new Promise(r => setTimeout(r, delay * (i + 1)));
    }
  }
}

async function downloadImage(imgUrl) {
  if (!imgUrl || !imgUrl.startsWith('http')) return imgUrl;

  try {
    const cleanUrl = imgUrl.split('?')[0];
    let originalFilename = path.basename(cleanUrl);
    originalFilename = originalFilename.replace(/[^a-zA-Z0-9._-]/g, '-');
    if (!originalFilename || !originalFilename.includes('.')) {
      originalFilename = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.webp`;
    }

    const localFilePath = path.join(IMAGES_DIR, originalFilename);
    const publicPath = `/images/vietlabel/products/${originalFilename}`;

    if (fs.existsSync(localFilePath) && fs.statSync(localFilePath).size > 0) {
      return publicPath;
    }

    const res = await fetch(imgUrl, { headers: HEADERS });
    if (!res.ok) return imgUrl;

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length === 0) return imgUrl;

    fs.writeFileSync(localFilePath, buffer);
    return publicPath;
  } catch (err) {
    console.warn(`Error downloading ${imgUrl}:`, err.message);
    return imgUrl;
  }
}

function decodeEntities(str) {
  return str
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8230;/g, '…')
    .replace(/&#038;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

const PRODUCT_MAPPINGS = [
  {
    nameVi: 'Tem Nhãn Dược Phẩm',
    url: 'https://vietlabel.com.vn/vi/in-tem-nhan-duoc-pham/',
    matchSlugs: ['tem-duoc-pham-gmp', 'tem-nhan-duoc-pham'],
  },
  {
    nameVi: 'Tem Nhãn Hóa Mỹ Phẩm',
    url: 'https://vietlabel.com.vn/vi/in-tem-nhan-hoa-my-pham/',
    matchSlugs: ['tem-hoa-my-pham-cao-cap'],
  },
  {
    nameVi: 'Tem Nhãn Dữ Liệu Biến Đổi',
    url: 'https://vietlabel.com.vn/vi/in-nhan-du-lieu-bien-doi/',
    matchSlugs: ['tem-du-lieu-bien-doi-qr'],
  },
  {
    nameVi: 'Nhãn Khử Keo',
    url: 'https://vietlabel.com.vn/vi/in-tem-nhan-khu-keo/',
    matchSlugs: ['nhan-khu-keo'],
    isNew: true,
    newProductData: {
      id: 'prod-25',
      slug: 'nhan-khu-keo',
      categoryId: 'tem-nhan',
      categorySlug: 'tem-nhan',
      categoryNameVi: 'TEM NHÃN',
      categoryNameEn: 'Decal & Adhesive Labels',
      subcategoryId: 'nhan-cuon',
      nameVi: 'Nhãn Khử Keo (Zone/Pattern Adhesive Label)',
      nameEn: 'Pattern Adhesive & De-glued Labels',
      code: 'TN-KK-01',
      descriptionVi: 'Tem nhãn khử keo một phần bằng công nghệ bế phủ vô hiệu hóa lớp keo, giúp tạo phần gập mở tiện lợi mà không dính bẩn vào sản phẩm hay tay người dùng.',
      descriptionEn: 'Partially de-glued labels with selective deadening adhesive zones for easy opening tabs and clean peel-back access.',
      specs: {
        materialVi: 'Decal giấy bóng, Decal nhựa PP trắng sữa / trong suốt',
        materialEn: 'Glossy paper decal, White PP / Clear film decal',
        dimensionsVi: 'Tùy biến theo khuôn bế của khách hàng',
        dimensionsEn: 'Custom sizes as per die-cut specs',
        printTechniqueVi: 'In Flexo UV nhiều màu, bế khử keo định vị chính xác',
        printTechniqueEn: 'UV Flexo multi-color, precision registered zone deadening',
        finishingVi: 'Cán màng bóng/mờ, khử keo mặt sau, cuộn hoặc tờ',
        finishingEn: 'Gloss/Matte lamination, selective adhesive kill, roll/sheet',
        moq: '5,000 nhãn / đơn hàng',
        leadTimeVi: '4 - 6 ngày làm việc',
        leadTimeEn: '4 - 6 working days',
      },
      featuresVi: [
        'Vùng khử keo định vị chính xác tuyệt đối',
        'Phần tab kéo mở tiện lợi, không gây rách tem',
        'Mực in UV sắc nét, không lem khi tiếp xúc nước',
        'Tương thích hoàn hảo với máy dán nhãn tự động',
      ],
      featuresEn: [
        'High-precision registered adhesive-deadened zones',
        'Convenient pull tab with zero adhesive residue',
        'Vibrant UV inks with moisture resistance',
        'Seamless compatibility with automatic labeling lines',
      ],
      applicationsVi: ['Khăn ướt & tã em bé', 'Hóa mỹ phẩm & dầu gội', 'Thực phẩm đóng hộp', 'Chương trình khuyến mãi mở thưởng'],
      applicationsEn: ['Wet wipes & baby care', 'Personal care & shampoo', 'Packaged foods', 'Promotional peel-to-reveal campaigns'],
    },
  },
  {
    nameVi: 'Nhãn Phủ Cào Dạng Cuộn',
    url: 'https://vietlabel.com.vn/vi/in-nhan-phu-cao-dang-cuon/',
    matchSlugs: ['nhan-phu-cao-dang-cuon'],
    isNew: true,
    newProductData: {
      id: 'prod-26',
      slug: 'nhan-phu-cao-dang-cuon',
      categoryId: 'tem-nhan',
      categorySlug: 'tem-nhan',
      categoryNameVi: 'TEM NHÃN',
      categoryNameEn: 'Decal & Adhesive Labels',
      subcategoryId: 'nhan-cuon',
      nameVi: 'Nhãn Phủ Cào Dạng Cuộn (Scratch-Off Roll Label)',
      nameEn: 'Automated Scratch-Off Roll Labels',
      code: 'TN-PC-01',
      descriptionVi: 'Tem nhãn phủ cào bảo mật cao cấp dạng cuộn, dán tự động lên sản phẩm, bao phủ mã PIN, mã trúng thưởng hoặc QR xác thực nguồn gốc.',
      descriptionEn: 'High-security scratch-off roll labels for automatic high-speed applicator machines with opaque scratch layer over PINs and QR codes.',
      specs: {
        materialVi: 'Decal vỡ chống bóc, decal bạc, decal giấy Couche',
        materialEn: 'Tamper-evident destructible decal, silver film, Couche paper',
        dimensionsVi: '20 x 40mm, 25 x 50mm hoặc tùy biến',
        dimensionsEn: '20 x 40mm, 25 x 50mm or custom sizes',
        printTechniqueVi: 'In dữ liệu biến đổi (Variable Data) + Phủ cào bạc UV chuyên dụng',
        printTechniqueEn: 'Variable data printing + High-opacity UV silver scratch latex',
        finishingVi: 'Cán màng bảo vệ, phủ lớp chống soi đèn hồng ngoại, bế cuộn',
        finishingEn: 'Protective varnish, anti-light penetration barrier, roll format',
        moq: '10,000 nhãn / đơn hàng',
        leadTimeVi: '5 - 7 ngày làm việc',
        leadTimeEn: '5 - 7 working days',
      },
      featuresVi: [
        'Lớp cào cản quang 100%, chống soi đèn và tia UV',
        'Dễ cào bằng móng tay hoặc đồng xu, không để lại bụi bẩn',
        'Tích hợp mã số bảo mật PIN / Serial / QR Code ngẫu nhiên',
        'Hỗ trợ dạng cuộn quấn dán tự động tốc độ cao',
      ],
      featuresEn: [
        '100% opaque scratch coating preventing light and UV penetration',
        'Clean and smooth scratch experience with coins or nails',
        'Dynamic random PIN / Serial / QR code integration',
        'Roll-to-roll format for high-speed automated application',
      ],
      applicationsVi: ['Thẻ cào nạp tiền & viễn thông', 'Xác thực tem chống giả', 'Kích hoạt bảo hành điện tử', 'Chương trình trúng thưởng tích điểm'],
      applicationsEn: ['Telecom scratch cards', 'Anti-counterfeiting verification', 'E-warranty activation', 'Reward loyalty & gift campaigns'],
    },
  },
  {
    nameVi: 'Tem Nhãn Pop-up',
    url: 'https://vietlabel.com.vn/vi/in-nhan-pop-up/',
    matchSlugs: ['in-tem-nhan-pop-up-gap-mo-thong-minh', 'tem-pop-up-3d'],
  },
  {
    nameVi: 'Tem Nhãn May Mặc',
    url: 'https://vietlabel.com.vn/vi/in-nhan-nganh-may-mac/',
    matchSlugs: ['tem-may-mac-care-label'],
  },
  {
    nameVi: 'Tem Nhãn Rượu Bia',
    url: 'https://vietlabel.com.vn/vi/nhan-ruou-bia/',
    matchSlugs: ['tem-ruou-bia-chong-nuoc'],
  },
  {
    nameVi: 'Tem Nhãn Điện Tử',
    url: 'https://vietlabel.com.vn/vi/in-tem-nhan-dien-tu/',
    matchSlugs: ['tem-nhan-dien-tu'],
    isNew: true,
    newProductData: {
      id: 'prod-27',
      slug: 'tem-nhan-dien-tu',
      categoryId: 'tem-nhan',
      categorySlug: 'tem-nhan',
      categoryNameVi: 'TEM NHÃN',
      categoryNameEn: 'Decal & Adhesive Labels',
      subcategoryId: 'nhan-cuon',
      nameVi: 'Tem Nhãn Điện Tử & Bo Mạch (Electronics & PCB Labels)',
      nameEn: 'High-Temperature Electronic & PCB Labels',
      code: 'TN-DT-01',
      descriptionVi: 'Tem nhãn chuyên dụng cho linh kiện điện tử, bo mạch vi xử lý chịu nhiệt độ hàn nhúng sóng lên tới 300°C, chống tĩnh điện ESD và bền hóa chất tẩy rửa.',
      descriptionEn: 'High-temperature resistant polyimide/polyester labels engineered for PCB circuit boards, wave soldering processes up to 300°C and ESD protection.',
      specs: {
        materialVi: 'Polyimide (Kapton) trắng/hổ phách, Polyester chịu nhiệt, Decal bạc mờ',
        materialEn: 'Glossy/Matte Polyimide (Kapton), Heat-resistant PET, Matte Silver',
        dimensionsVi: '5 x 5mm, 10 x 10mm, 15 x 30mm hoặc tùy biến siêu nhỏ',
        dimensionsEn: '5 x 5mm, 10 x 10mm, 15 x 30mm or micro sizes',
        printTechniqueVi: 'In truyền nhiệt độ phân giải cao 600 DPI, in mực Resin siêu bền',
        printTechniqueEn: 'High-density 600 DPI thermal transfer with chemical-proof Resin ribbon',
        finishingVi: 'Bế khuôn chính xác siêu nhỏ cho máy dán tự động SMT',
        finishingEn: 'Micro precision die-cut for SMT auto-placement pick & place',
        moq: '5,000 nhãn / cuộn',
        leadTimeVi: '3 - 5 ngày làm việc',
        leadTimeEn: '3 - 5 working days',
      },
      featuresVi: [
        'Chịu nhiệt độ cực cao từ -40°C đến 300°C',
        'Kháng dung môi, cồn IPA, chất tẩy rửa bo mạch điện tử',
        'Chống phóng tĩnh điện (Anti-static / ESD) bảo vệ vi mạch',
        'In mã vạch 2D DataMatrix siêu nhỏ đọc rõ nét qua máy quét',
      ],
      featuresEn: [
        'Withstands extreme temperatures from -40°C to 300°C',
        'Resistant to aggressive solvents, fluxes, and IPA cleaners',
        'Anti-static ESD properties preventing microchip damage',
        'High-contrast 2D DataMatrix barcode scanning readability',
      ],
      applicationsVi: ['Bo mạch điện tử SMT', 'Pin lithium & linh kiện di động', 'Thiết bị viễn thông & máy chủ', 'Hệ thống điện xe ô tô'],
      applicationsEn: ['SMT PCB motherboards', 'Lithium batteries & mobile components', 'Telecom & server equipment', 'Automotive electronics'],
    },
  },
  {
    nameVi: 'Tem Nhãn Thủy Sản',
    url: 'https://vietlabel.com.vn/vi/nhan-nganh-thuy-san/',
    matchSlugs: ['tem-thuy-san-chiu-lanh'],
  },
  {
    nameVi: 'In Vé Mời & Vé Sự Kiện',
    url: 'https://vietlabel.com.vn/vi/in-ve-moi-ve-su-kien/',
    matchSlugs: ['in-ve-moi-ve-su-kien'],
    isNew: true,
    newProductData: {
      id: 'prod-28',
      slug: 'in-ve-moi-ve-su-kien',
      categoryId: 'the-cao',
      categorySlug: 'the-cao',
      categoryNameVi: 'THẺ CÀO/ THẺ GIẤY',
      categoryNameEn: 'Scratch & Paper Cards',
      subcategoryId: 'the-cao-bao-mat',
      nameVi: 'Vé Mời & Vé Sự Kiện Chống Giả (Security Event Tickets)',
      nameEn: 'Anti-Counterfeit Event Tickets & Invitations',
      code: 'TC-VE-01',
      descriptionVi: 'Giải pháp in vé mời cao cấp, vé sự kiện tích hợp công nghệ chống giả bảo mật, dập nổi kim loại, in số nhảy tự động và đường cấn xé tiện dụng.',
      descriptionEn: 'High-end security event tickets and VIP invitation printing featuring holographic foils, numbering, perforated stubs, and variable QR verification.',
      specs: {
        materialVi: 'Giấy Couche 250 - 350gsm, Giấy mỹ thuật ánh kim cao cấp',
        materialEn: 'Couche 250 - 350gsm, Metallic specialty art cardstock',
        dimensionsVi: '70 x 180mm, 80 x 200mm, 100 x 210mm hoặc tùy biến',
        dimensionsEn: '70 x 180mm, 80 x 200mm, 100 x 210mm or custom',
        printTechniqueVi: 'In Offset 4 màu sắc nét + In số nhảy liên tục không trùng lặp',
        printTechniqueEn: '4-color Offset precision + Sequential variable numbering',
        finishingVi: 'Ép kim Hologram 3D, cấn 1-2 đường xé, cán màng mờ nhung',
        finishingEn: '3D Holographic foil stamping, micro-perforation, velvet soft-touch',
        moq: '1,000 vé / sự kiện',
        leadTimeVi: '3 - 5 ngày làm việc',
        leadTimeEn: '3 - 5 working days',
      },
      featuresVi: [
        'Đường cấn xé (perforation) dễ dàng xé cuống vé tại cửa kiểm soát',
        'Số serial và mã QR chống trùng lặp, bảo mật chống vé giả',
        'Ép kim vàng/bạc/hologram sang trọng tạo đẳng cấp sự kiện',
        'Giấy mỹ thuật dày dặn, cầm chắc tay, không thấm nước mặt ngoài',
      ],
      featuresEn: [
        'Clean micro-perforated tear-off stubs for admission check-in',
        'Unique serial numbers and dynamic QR security against duplication',
        'Prestige gold/silver/hologram foil accents elevate event branding',
        'Heavyweight premium stock with water-resistant lamination',
      ],
      applicationsVi: ['Đại nhạc hội & Concert', 'Hội nghị khách hàng B2B VIP', 'Giải đấu thể thao chuyên nghiệp', 'Vé tham quan khu du lịch & triển lãm'],
      applicationsEn: ['Live concerts & music festivals', 'VIP corporate conferences', 'Major sporting tournaments', 'Exhibition and theme park admission'],
    },
  },
  {
    nameVi: 'Tem Nhãn Mỹ Phẩm',
    url: 'https://vietlabel.com.vn/vi/in-nhan-my-pham/',
    matchSlugs: ['tem-nhan-my-pham'],
  },
  {
    nameVi: 'Tem Nhãn Dầu Nhớt',
    url: 'https://vietlabel.com.vn/vi/in-nhan-nganh-dau-nhot/',
    matchSlugs: ['in-tem-nhan-decal-cuon-nganh-dau-nhot', 'tem-dau-nhot-chiu-dau'],
  },
  {
    nameVi: 'Tem Nhãn Thực Phẩm',
    url: 'https://vietlabel.com.vn/vi/nhan-thuc-pham/',
    matchSlugs: ['tem-nhan-thuc-pham-do-uong', 'tem-thuc-pham-fda'],
  },
  {
    nameVi: 'Tem Nhãn Bế Trắng',
    url: 'https://vietlabel.com.vn/vi/in-nhan-be-trang/',
    matchSlugs: ['tem-be-trang-die-cut'],
  },
];

async function run() {
  console.log('🚀 Bắt đầu crawl dữ liệu sản phẩm từ https://vietlabel.com.vn/vi/ds-san-pham/...');

  // Load existing products.ts
  const productsFileContent = fs.readFileSync(PRODUCTS_FILE, 'utf8');

  // Extract products array using eval in isolated function
  const jsonMatch = productsFileContent.match(/export const PRODUCTS_LIST: ProductItem\[\] = (\[[\s\S]*?\]);/);
  if (!jsonMatch) {
    throw new Error('Could not find PRODUCTS_LIST in products.ts');
  }

  // Parse existing PRODUCTS_LIST
  const existingProducts = eval(jsonMatch[1]);
  console.log(`📦 Hiện tại có ${existingProducts.length} sản phẩm trong PRODUCTS_LIST.`);

  // Process each product from web
  for (let i = 0; i < PRODUCT_MAPPINGS.length; i++) {
    const item = PRODUCT_MAPPINGS[i];
    console.log(`\n[${i + 1}/${PRODUCT_MAPPINGS.length}] Đang xử lý: ${item.nameVi} (${item.url})`);

    try {
      const html = await fetchWithRetry(item.url);
      
      // Extract main or content area
      const mainMatch = html.match(/<div id="content" role="main"[^>]*>([\s\S]*?)<\/main>/) 
        || html.match(/<main[\s\S]*?<\/main>/);
      let contentArea = mainMatch ? mainMatch[0] : '';

      // Clean unwanted tags
      contentArea = contentArea.replace(/<script[\s\S]*?<\/script>/gi, '');
      contentArea = contentArea.replace(/<style[\s\S]*?<\/style>/gi, '');
      contentArea = contentArea.replace(/<div id="ez-toc-container"[\s\S]*?<\/div>\s*<\/div>/gi, '');
      contentArea = contentArea.replace(/<div id="ez-toc-container"[\s\S]*?<\/div>/gi, '');
      contentArea = contentArea.replace(/<form[\s\S]*?<\/form>/gi, '');
      contentArea = contentArea.replace(/<footer[\s\S]*?<\/footer>/gi, '');

      // Extract all meaningful images
      const rawImages = [...contentArea.matchAll(/<img[^>]+src="([^"]+)"[^>]*>/gi)].map(m => m[1]);
      const meaningfulImages = [...new Set(rawImages.filter(src => {
        const s = src.toLowerCase();
        return !s.includes('logo') && !s.includes('icon') && !s.includes('flag') && !s.includes('footer') && !s.includes('banner.jpg');
      }))];

      console.log(`   Tìm thấy ${meaningfulImages.length} hình ảnh sản phẩm thực tế.`);

      // Download images locally
      const localImagesMap = {};
      const downloadedImages = [];
      for (const imgUrl of meaningfulImages) {
        const localPath = await downloadImage(imgUrl);
        localImagesMap[imgUrl] = localPath;
        if (localPath.startsWith('/images/')) {
          downloadedImages.push(localPath);
        }
      }

      // Replace remote image URLs in contentArea
      let cleanedContentHtml = contentArea;
      for (const [remote, local] of Object.entries(localImagesMap)) {
        cleanedContentHtml = cleanedContentHtml.replaceAll(remote, local);
      }

      // Further clean UX Builder divs to render nicely in Tailwind
      cleanedContentHtml = cleanedContentHtml
        .replace(/<div class="gap-element[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
        .replace(/style="[^"]*"/gi, '') // remove inline styles
        .replace(/id="[^"]*"/gi, '') // remove dynamic ids
        .replace(/\s*srcset="[^"]*"/gi, '')
        .replace(/\s*sizes="[^"]*"/gi, '')
        .replace(/<div class="bg section-bg[^"]*"[^>]*><\/div>/gi, '')
        .replace(/<span class="ez-toc-section"[^>]*><\/span>/gi, '')
        .replace(/<span class="ez-toc-section-end"><\/span>/gi, '');

      cleanedContentHtml = decodeEntities(cleanedContentHtml);

      // Now merge or add
      if (item.isNew) {
        // Check if already in existingProducts
        const exists = existingProducts.some(p => p.slug === item.matchSlugs[0]);
        if (!exists) {
          const newProd = {
            ...item.newProductData,
            heroImage: downloadedImages[0] || '/images/vietlabel/hero-banner.webp',
            gallery: downloadedImages.slice(0, 6),
            contentHtml: cleanedContentHtml,
            isFeatured: true,
          };
          existingProducts.push(newProd);
          console.log(`   ✨ ĐÃ THÊM MỚI sản phẩm: ${newProd.nameVi} (${newProd.slug})`);
        } else {
          // Merge content and images
          const prod = existingProducts.find(p => p.slug === item.matchSlugs[0]);
          if (prod) {
            prod.gallery = [...new Set([...prod.gallery, ...downloadedImages])].slice(0, 8);
            prod.contentHtml = cleanedContentHtml;
            console.log(`   🔄 ĐÃ MERGE nội dung và hình ảnh cho sản phẩm: ${prod.nameVi}`);
          }
        }
      } else {
        // Merge into existing products
        for (const slug of item.matchSlugs) {
          const prod = existingProducts.find(p => p.slug === slug);
          if (prod) {
            // User requested: "nếu mà mình có chỉ merge nội dung và hình ảnh bên trong sản phẩm thôi nha"
            prod.gallery = [...new Set([...prod.gallery, ...downloadedImages])].slice(0, 8);
            prod.contentHtml = cleanedContentHtml;
            console.log(`   🔄 ĐÃ MERGE nội dung và hình ảnh cho sản phẩm: ${prod.nameVi} (${prod.slug})`);
          }
        }
      }
    } catch (err) {
      console.error(`❌ Lỗi crawl sản phẩm ${item.nameVi}:`, err.message);
    }
  }

  console.log(`\n🎉 Tổng số sản phẩm sau khi cập nhật: ${existingProducts.length}`);
  console.log(`💾 Đang lưu dữ liệu vào ${PRODUCTS_FILE}...`);

  // Write back to products.ts
  const newProductsTs = productsFileContent.replace(
    /export const PRODUCTS_LIST: ProductItem\[\] = \[[\s\S]*?\];\s*$/,
    `export const PRODUCTS_LIST: ProductItem[] = ${JSON.stringify(existingProducts, null, 2)};\n`
  );

  fs.writeFileSync(PRODUCTS_FILE, newProductsTs, 'utf8');
  console.log(`✅ Đã cập nhật thành công ${PRODUCTS_FILE}`);
}

run().catch(console.error);
