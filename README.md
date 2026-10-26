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
cp .env.example .env
```

Đặt `POSTGRES_PASSWORD` và `JWT_SECRET` trong `.env` thành các giá trị ngẫu nhiên riêng. `POSTGRES_PASSWORD` chỉ dùng cho PostgreSQL trong Docker Compose; `DATABASE_URL` cần trỏ đến PostgreSQL bạn dùng khi phát triển cục bộ. Có thể tạo mật khẩu bằng:
```bash
openssl rand -hex 32
```

Với PostgreSQL cục bộ, cấu hình thông tin kết nối riêng trong `DATABASE_URL`. Tạo tài khoản quản trị đầu tiên bằng cách đặt `INITIAL_ADMIN_EMAIL` và `INITIAL_ADMIN_PASSWORD` (tối thiểu 16 ký tự), sau đó chạy migration:
```bash
npm run db:migrate
```

Migration nạp danh mục, sản phẩm, bài viết và tin tuyển dụng từ `src/data` vào các bảng CMS còn trống; các tin tuyển dụng đã quá hạn được lưu ở trạng thái đóng. Migration chỉ tạo tài khoản quản trị từ các biến này, không tạo lead giả hay tài khoản demo/mật khẩu mặc định. Với Docker Compose, PostgreSQL chỉ được bind vào loopback (`127.0.0.1:5433`); app tự chạy migration trước khi khởi động.

CV ứng tuyển được lưu ngoài thư mục public trong `server/data/uploads` (Compose dùng volume riêng). Chỉ tài khoản ADMIN/MANAGER mới xem danh sách hồ sơ hoặc tải CV qua API.

Chat mặc định chạy chế độ `AI_PROVIDER=rules`: không gửi nội dung khách hàng tới nhà cung cấp AI và không phát sinh phí token; chế độ này dùng bộ tư vấn theo quy tắc nên hội thoại ít linh hoạt hơn LLM. Để bật Gemini, đặt `AI_PROVIDER=gemini`, `GEMINI_API_KEY` và (nếu cần) `LLM_MODEL` trong `.env`. Lệnh gọi Gemini sử dụng quota/gói giá hiện hành của tài khoản; mức miễn phí và giá có thể thay đổi, hãy theo dõi usage trong Google AI Studio. Không đặt API key với tiền tố `VITE_` vì biến đó có thể bị đóng gói ra frontend.

Chat áp giới hạn theo IP và session (12 lượt/phút, 50 lượt/giờ, 100 lượt/ngày theo IP; 6 lượt/phút, 25 lượt/giờ, 30 lượt/ngày theo session), giới hạn độ dài tin nhắn và ngữ cảnh, đồng thời giới hạn token đầu ra Gemini. Bộ đếm giới hạn nằm trong bộ nhớ của từng tiến trình và được xóa khi khởi động lại; nếu triển khai nhiều app instance, cần dùng rate limiter dùng chung như Redis để có giới hạn nhất quán.

Để cải thiện câu trả lời mà không cho bot tự học sai từ hội thoại: khách có thể bấm **Chưa hữu ích**; ADMIN/MANAGER xem câu hỏi và câu trả lời bị gắn cờ trong **Quản trị → Kiến thức AI**, tạo bản nháp, viết câu trả lời đã xác minh, rồi chuyển sang **Đã phê duyệt**. Bot chỉ dùng FAQ đã duyệt; thay đổi được nạp ngay và khôi phục từ database khi app khởi động lại.

Khởi chạy cả PostgreSQL và app bằng Docker Compose:
```bash
docker compose up --build -d
```
App sẵn sàng tại `http://localhost:3000`; PostgreSQL chỉ truy cập từ máy local tại cổng `5433`. Compose tự chạy migration trước khi khởi động app. Giữ `INITIAL_ADMIN_EMAIL` và `INITIAL_ADMIN_PASSWORD` trong `.env` khi khởi tạo database mới; migration không ghi đè mật khẩu của admin đang hoạt động. Sau khi các database đã được khởi tạo và bạn đã lưu mật khẩu admin, có thể xóa `INITIAL_ADMIN_PASSWORD` khỏi `.env`.

Các tài khoản manager/sales mang ID demo cũ sẽ bị vô hiệu hóa.

### 3. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Ứng dụng sẽ tự động chạy tại: `http://localhost:5173`

### 4. Đóng gói sản phẩm (Production Build)
```bash
npm run build
```
Kết quả được xuất ra thư mục `dist`, sẵn sàng để deploy.

### 5. Kiểm thử tự động
```bash
npm test
```

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
