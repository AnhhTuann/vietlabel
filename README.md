# An Phát Packaging - Website Doanh Nghiệp Bao Bì Giấy B2B

Website giới thiệu doanh nghiệp tiêu chuẩn công nghiệp B2B dành cho Công ty sản xuất bao bì giấy chuyên nghiệp (**An Phát Packaging Corp**). Xây dựng trên nền tảng **React 18 + Vite + TypeScript + Tailwind CSS**, hỗ trợ song ngữ Việt - Anh, SEO hoàn chỉnh, quản lý danh mục sản phẩm, tính toán báo giá nhanh và tích hợp quy trình tuyển dụng trực tuyến.

---

## 🚀 Tính Năng Chính

- **Đầy đủ 10 Section Trang chủ B2B**:
  1. Hero Banner: Slogan định vị, CTA, Carousel 7 dòng sản phẩm mẫu tự động.
  2. Nền tảng doanh nghiệp: Thống kê số liệu có hiệu ứng Count-up (200+ nhân sự, 10 triệu+ sản phẩm, 5+ tiêu chuẩn quốc tế, 20+ năm kinh nghiệm).
  3. Danh mục sản phẩm: 8 phân khúc bao bì (Hộp giấy, Túi giấy, Túi bánh mì, Tem nhãn, Khay giấy, Thùng carton, Thẻ cào, POSM).
  4. Giá trị cốt lõi: Vertical Tabs tương tác chuyển tab mượt mà.
  5. Đối tác chiến lược: Marquee 2 hàng logo chạy ngược chiều nhau, tự động dừng khi hover.
  6. Giải pháp toàn diện 3 bước: Cung ứng linh hoạt, Tối ưu chi phí, Định hình phong cách.
  7. Chứng nhận quốc tế: ISO 9001:2015, FSC CoC, EcoVadis Silver, HACCP, G7 Master với Lightbox xem bản gốc.
  8. Thiết bị máy móc: Thư viện thiết bị Heidelberg, Bobst với Lightbox phóng to và điều hướng phím mũi tên.
  9. Tin tức nổi bật: 3 bài viết chuyên sâu về ngành bao bì, ESG PPWR và case study.
  10. Biểu mẫu liên hệ & Báo giá: Xác thực Zod, honeypot chống bot spam, mã theo dõi dự toán.

- **Đầy đủ các trang con chuyên sâu**:
  - `/gioi-thieu`: Lịch sử hình thành (timeline dọc từ 2004), tầm nhìn - sứ mệnh, đội ngũ ban lãnh đạo, tải Company Profile PDF.
  - `/san-pham`: Bộ lọc danh mục cây 2 cấp, tìm kiếm thời gian thực, phân trang, xem chi tiết sản phẩm.
  - `/san-pham/:danhMuc/:slug`: Chi tiết sản phẩm, bảng thông số kỹ thuật, công nghệ gia công, MOQ, nút "Yêu cầu báo giá" mở modal form.
  - `/nang-luc`: Hạ tầng 15.000m², bảng năng suất chi tiết theo ca làm việc, quy trình KCS.
  - `/phat-trien-ben-vung`: Cam kết ESG, chứng chỉ rừng trồng FSC, màng sinh học và năng lượng mặt trời áp mái.
  - `/cong-nghe`: Quy trình sản xuất 6 bước chuẩn SOP và thông số kỹ thuật dàn máy in/bế/dán tự động.
  - `/tin-tuc`: Lọc bài viết theo chuyên mục và trang đọc bài viết chi tiết.
  - `/tuyen-dung`: Danh sách vị trí tuyển dụng dạng accordion + form nộp hồ sơ CV đính kèm file (PDF/DOC tối đa 5MB).
  - `/lien-he`: Thông tin trụ sở, hotline 24/7, form dự toán và Google Maps iframe.
  - `*`: Trang 404 thân thiện.

- **Tiện ích & Trải nghiệm người dùng**:
  - Song ngữ Việt / Anh (`react-i18next`), chuyển đổi ngôn ngữ tức thì không giật trang.
  - Header thông minh: chuyển từ trong suốt trên Hero sang nền trắng đổ bóng khi cuộn trang.
  - Floating Quick Contact Bar: Gọi điện hotline (`tel:`), gửi email (`mailto:`), mở modal báo giá nhanh.
  - SEO toàn diện với `react-helmet-async` và Schema.org Organization JSON-LD.
  - Thiết kế thích ứng mượt mà trên Mobile, Tablet và Desktop.

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:3000`

### 3. Build kiểm tra sản phẩm (Production Build)
```bash
npm run build
```

---

## 🎨 Hướng Dẫn Tùy Biến Giao Diện & Nội Dung

### 1. Đổi bảng màu thương hiệu (Theme Colors)
Mở file `src/index.css`:
```css
@theme {
  --color-primary: #0B2A4A;        /* Đổi màu xanh Navy chính */
  --color-primary-light: #164373;  /* Màu phụ sáng */
  --color-accent: #E8531D;         /* Màu Cam điểm nhấn nút CTA */
  --color-accent-hover: #D04210;   /* Màu hover nút */
}
```

### 2. Thay đổi thông tin công ty & Sản phẩm
Toàn bộ dữ liệu được tổ chức độc lập tại thư mục `src/data/`:
- `src/data/products.ts`: Danh mục sản phẩm, thông số kỹ thuật, hình ảnh, MOQ.
- `src/data/company.ts`: Thông tin lãnh đạo, các mốc lịch sử, giới thiệu công ty.
- `src/data/certificates.ts`: Các chứng chỉ quốc tế và tổ chức cấp phép.
- `src/data/machines.ts`: Danh mục máy móc, xuất xứ và công suất.
- `src/data/posts.ts`: Tin tức, bài viết chuyên môn và case study dự án.
- `src/data/jobs.ts`: Vị trí tuyển dụng, mức lương và yêu cầu công việc.
- `src/data/clients.ts`: Danh sách thương hiệu đối tác trên dải marquee.

### 3. Thay đổi ngôn ngữ và từ vựng
Mở thư mục `src/i18n/`:
- `src/i18n/vi.json`: Toàn bộ nội dung tiếng Việt.
- `src/i18n/en.json`: Toàn bộ nội dung tiếng Anh tương ứng.

---

## 🌐 Hướng Dẫn Triển Khai (Deploy)

### Triển khai lên Vercel
1. Đẩy code lên GitHub repository của bạn.
2. Đăng nhập vào [Vercel](https://vercel.com) và chọn **Add New Project**.
3. Import repository và chọn Framework Preset là **Vite**.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Nhấn **Deploy**.

### Triển khai lên Netlify
1. Tạo file `public/_redirects` với nội dung:
   ```
   /*    /index.html   200
   ```
2. Kết nối repo với Netlify và cấu hình:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Nhấn **Deploy Site**.

---

© 2026 An Phát Packaging Corp. Bản quyền đã được bảo hộ.
