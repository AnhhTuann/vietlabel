const fs = require('fs');
const file = 'src/data/products.ts';
let content = fs.readFileSync(file, 'utf8');

const updates = [
  {
    id: 'hop-giay',
    nameVi: 'HỘP GIẤY',
    shortDescVi: 'Sản xuất hộp 1 lớp, hộp carton, hộp cao cấp trên dây chuyền hiện đại và khép kín, đảm bảo sản phẩm đạt chất lượng cao, đồng nhất.',
    nameEn: 'PAPER BOXES',
    shortDescEn: 'Production of single-layer boxes, carton boxes, and premium boxes on modern, closed lines, ensuring high and consistent product quality.',
  },
  {
    id: 'tui-giay',
    nameVi: 'TÚI GIẤY',
    shortDescVi: 'Túi giấy sản xuất 100% dây chuyền tự động, tối ưu chi phí và thời gian, đảm bảo chất lượng đồng đều từ mẫu mã, kích thước đến màu sắc cho đơn hàng sản lượng lớn.',
    nameEn: 'PAPER BAGS',
    shortDescEn: 'Paper bags produced on 100% automated lines, optimizing cost and time, ensuring consistent quality from design and size to color for large volume orders.',
  },
  {
    id: 'tui-banh-mi',
    nameVi: 'TÚI BÁNH MÌ',
    shortDescVi: 'Chất liệu giấy đạt tiêu chuẩn quốc tế, an toàn thực phẩm. Đáp ứng đa dạng kích thước, kiểu dáng, phù hợp với nhiều loại bánh mì khác nhau.',
    nameEn: 'BAKERY BAGS',
    shortDescEn: 'Paper material meets international standards for food safety. Fulfills various sizes and designs, suitable for many different types of bakery products.',
  },
  {
    id: 'tem-nhan',
    nameVi: 'TEM NHÃN',
    shortDescVi: 'Tem dán sản phẩm, tem bảo hành, tem chống hàng giả... chất lượng cao, bền đẹp, bám dính tốt, phù hợp với các môi trường sử dụng khác nhau.',
    nameEn: 'LABELS & DECALS',
    shortDescEn: 'Product labels, warranty stamps, anti-counterfeit labels... high quality, durable, strong adhesion, suitable for various usage environments.',
  },
  {
    id: 'khay-giay',
    nameVi: 'KHAY GIẤY',
    shortDescVi: 'Khay giấy định hình theo sản phẩm, độ bền cao và khả năng chịu lực tốt. Giải pháp trưng bày, vận chuyển hiệu quả cho thực phẩm, nông sản, FMCG, tăng thẩm mỹ và bảo quản trong chuỗi cung ứng.',
    nameEn: 'PAPER TRAYS',
    shortDescEn: 'Custom-shaped paper trays with high durability and load-bearing capacity. Effective display and transport solutions for food, agriculture, and FMCG.',
  },
  {
    id: 'thung-carton',
    nameVi: 'THÙNG CARTON',
    shortDescVi: 'Cấu trúc chắc chắn, chịu lực cao, bảo vệ tối ưu hàng hóa trong vận chuyển và lưu kho. Thiết kế đa dạng kích thước, tùy chỉnh theo nhu cầu, phù hợp cho nhiều ngành hàng khác nhau.',
    nameEn: 'CARTON BOXES',
    shortDescEn: 'Sturdy structure, high load-bearing, optimally protecting goods during transport and storage. Diverse size designs, customized to needs.',
  },
  {
    id: 'the-cao',
    nameVi: 'THẺ CÀO/ THẺ GIẤY',
    shortDescVi: 'Ứng dụng công nghệ in dữ liệu biến đổi, tạo thẻ cào bảo mật cao, chống trầy, chống soi, đảm bảo tính an toàn và minh bạch cho doanh nghiệp và khách hàng.',
    nameEn: 'SCRATCH CARDS / PAPER CARDS',
    shortDescEn: 'Applying variable data printing technology to create highly secure scratch cards, anti-scratch and anti-shine, ensuring safety and transparency.',
  },
  {
    id: 'posm',
    nameVi: 'POSM',
    shortDescVi: 'Đa dạng các sản phẩm POSM: Hanger, Wobbler, Tin-tag, Poster, Standee, Voucher, Bao lì xì...và nhiều vật phẩm quảng cáo khác, giúp doanh nghiệp tăng cường nhận diện thương hiệu.',
    nameEn: 'POSM',
    shortDescEn: 'A variety of POSM products: Hanger, Wobbler, Tin-tag, Poster, Standee, Voucher, Red envelopes... and many other advertising items to enhance brand recognition.',
  }
];

// Helper to replace field inside an object with a specific id
function replaceField(content, id, fieldName, newValue) {
  const regex = new RegExp(\`(id:\\s*'\${id}'[\\s\\S]*?\${fieldName}:\\s*')(.*?)(')\`, 'g');
  return content.replace(regex, \`$1\${newValue}$3\`);
}

for (const update of updates) {
  content = replaceField(content, update.id, 'nameVi', update.nameVi);
  content = replaceField(content, update.id, 'shortDescVi', update.shortDescVi);
  content = replaceField(content, update.id, 'nameEn', update.nameEn);
  content = replaceField(content, update.id, 'shortDescEn', update.shortDescEn);
}

fs.writeFileSync(file, content);
