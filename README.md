# Vietlabel - Nền Tảng Thương Mại Điện Tử & Giới Thiệu Bao Bì B2B

Website giới thiệu doanh nghiệp tiêu chuẩn công nghiệp B2B dành cho **Công ty Cổ phần Bao bì & Tem nhãn Vietlabel**. Hệ thống được xây dựng trên nền tảng công nghệ hiện đại **React 18 + Vite + TypeScript + Tailwind CSS**, hỗ trợ song ngữ Việt - Anh, chuẩn SEO, tối ưu tốc độ tải trang, và tích hợp đầy đủ hệ sinh thái quản lý danh mục sản phẩm, tính toán báo giá, và tuyển dụng.

---

## 🚀 Tính Năng Nổi Bật

- **Trang Chủ B2B Chuyên Nghiệp**:
  1. **Hero Banner**: Slogan định vị thương hiệu, CTA rõ ràng kèm background công nghiệp ấn tượng.
  2. **12 Giải Pháp Tem Nhãn**: Marquee cuộn ngang mượt mà giới thiệu chuyên sâu 12 giải pháp tem nhãn cho các ngành công nghiệp.
  3. **Danh mục sản phẩm**: Lưới 8 phân khúc bao bì chủ lực (Hộp giấy, Túi giấy, Túi bánh mì, Tem nhãn, Khay giấy, Thùng carton, Thẻ cào, POSM).
  4. **Giá trị cốt lõi**: Khối Vertical Tabs tương tác chuyển tab với nội dung 5 cam kết của Vietlabel.
  5. **Đối tác chiến lược**: Marquee 2 hàng logo chạy ngược chiều nhau, tối ưu không gian hiển thị.
  6. **Chứng nhận quốc tế**: ISO 9001:2015, FSC CoC, HACCP, G7 Master...
  7. **Form Liên hệ & Báo giá nhanh**: Tích hợp Modal bật lên mượt mà trên mọi trang.

- **Hệ Thống Trang Chuyên Sâu**:
  - `/gioi-thieu`: Hồ sơ năng lực (Company Profile), Tầm nhìn - Sứ mệnh, Đội ngũ ban lãnh đạo.
  - `/san-pham`: Trang danh sách sản phẩm với bộ lọc theo danh mục, hiển thị dạng Grid tối ưu UX/UI.
  - `/nang-luc`: Năng lực sản xuất, quy mô nhà máy, dây chuyền máy móc và quy trình kiểm soát KCS.
  - `/phat-trien-ben-vung`: Cam kết bảo vệ môi trường, phát triển xanh và chứng nhận FSC.
  - `/tin-tuc`: Cập nhật xu hướng ngành in ấn bao bì và tin tức nội bộ công ty.
  - `/tuyen-dung`: Danh sách vị trí đang tuyển, tích hợp Form nộp hồ sơ CV nhanh chóng.

- **Tiện ích & Trải nghiệm Người Dùng (UX)**:
  - **Đa ngôn ngữ (i18next)**: Chuyển đổi Tiếng Việt / Tiếng Anh tức thì, mượt mà không reload trang.
  - **Header Thông Minh**: Thanh điều hướng tự động đổi màu khi cuộn trang, dropdown menu tinh tế.
  - **Tối ưu UI**: Các nút bấm có hiệu ứng hover phát sáng đặc trưng của Vietlabel, khoảng cách dòng (line-height) được căn chỉnh chuẩn mực cho font chữ tiếng Việt.
  - **Responsive**: Hiển thị hoàn hảo trên mọi kích thước màn hình (Mobile, Tablet, Desktop).
  - **SEO Ready**: Thẻ meta động, JSON-LD schema được cấu hình sẵn cho công cụ tìm kiếm.

---

## 🛠️ Hướng Dẫn Cài Đặt & Phát Triển Cục Bộ

### 1. Cài đặt thư viện
```bash
npm install
```

### 2. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Ứng dụng sẽ tự động chạy tại: `http://localhost:5173`

### 3. Đóng gói sản phẩm (Production Build)
```bash
npm run build
```
Kết quả được xuất ra thư mục `dist`, sẵn sàng để deploy.

---

## 🎨 Hướng Dẫn Tùy Biến Giao Diện

### 1. Đổi bảng màu thương hiệu (Theme Colors)
Bộ màu sắc đặc trưng của Vietlabel (Xanh Navy đậm & Đỏ) được quản lý tập trung trong file `src/index.css`:
```css
@theme {
  --color-primary: #1e4384;        /* Xanh Navy chủ đạo */
  --color-secondary: #be1e2d;      /* Đỏ điểm nhấn */
}
```

### 2. Quản lý Dữ liệu (Data)
Toàn bộ nội dung của website được tách rời khỏi giao diện và đặt tại thư mục `src/data/`:
- `src/data/products.ts`: Dữ liệu 8 danh mục bao bì & sản phẩm chi tiết.
- `src/data/labelSolutions.ts`: Dữ liệu 12 giải pháp tem nhãn chuyên dụng theo ngành.
- `src/data/company.ts`, `src/data/machines.ts`, `src/data/clients.ts`: Thông tin nhà máy, máy móc, logo đối tác.

### 3. Cập nhật Ngôn ngữ (Đa ngữ)
Nội dung dịch thuật được quản lý tại:
- `src/i18n/vi.json`: Dành cho tiếng Việt.
- `src/i18n/en.json`: Dành cho tiếng Anh.

---

## 🌐 Triển Khai Lên Máy Chủ (Deploy)

### Deploy lên Vercel / Netlify
Do sử dụng `Vite`, bạn hoàn toàn có thể triển khai lên các nền tảng đám mây phổ biến như Vercel, Netlify, Cloudflare Pages chỉ trong 1 phút.
1. Khởi tạo kho lưu trữ GitHub và đẩy code lên.
2. Tại màn hình tạo dự án của Vercel/Netlify, chọn **Vite Framework**.
3. Lệnh build mặc định: `npm run build`
4. Thư mục publish: `dist`
5. Nhấn **Deploy**.

---

© 2026 Vietlabel Packaging Corp. All rights reserved.
