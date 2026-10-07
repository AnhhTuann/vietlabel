import json

new_vi = {
    "title": "GIÁ TRỊ VIETLABEL MANG ĐẾN CHO DOANH NGHIỆP",
    "tab1_title": "GIẢI PHÁP TEM NHÃN THEO TỪNG SẢN PHẨM",
    "tab1_desc": "Từ ý tưởng thiết kế đến thành phẩm, VIETLABEL kết hợp tư vấn vật liệu, công nghệ in và gia công để đáp ứng yêu cầu riêng của từng sản phẩm. Mỗi giải pháp hướng đến sự hài hòa giữa nhận diện thương hiệu, công năng sử dụng và chi phí triển khai.",
    "tab2_title": "CHẤT LƯỢNG ĐƯỢC CHÚ TRỌNG TRONG TỪNG CÔNG ĐOẠN",
    "tab2_desc": "VIETLABEL chú trọng kiểm soát chất lượng từ chuẩn bị dữ liệu đến in ấn và hoàn thiện. Màu sắc, nội dung, kích thước và quy cách được đối chiếu với yêu cầu đã thống nhất, hướng đến sự đồng đều của thành phẩm và phù hợp với nhu cầu sử dụng.",
    "tab3_title": "ĐA DẠNG ỨNG DỤNG TEM NHÃN",
    "tab3_desc": "Từ thực phẩm, dược phẩm, hóa mỹ phẩm đến điện tử và công nghiệp, VIETLABEL cung cấp nhiều dòng tem nhãn theo đặc thù ngành hàng. Các giải pháp RFID, nhãn chịu nhiệt, chống giả và bảo hành mở rộng khả năng đáp ứng những nhu cầu chuyên biệt.",
    "tab4_title": "KẾT HỢP CÔNG NGHỆ VÀ SÁNG TẠO",
    "tab4_desc": "Kết hợp công nghệ in Flexo, Offset, Letterpress với thiết kế và gia công, VIETLABEL phát triển những phương án nhãn in phù hợp với từng yêu cầu. Công nghệ hỗ trợ hiện thực hóa ý tưởng, tạo dấu ấn riêng cho sản phẩm qua từng tem nhãn.",
    "tab5_title": "ĐỘI NGŨ TẬN TÂM, ĐỒNG HÀNH LÂU DÀI",
    "tab5_desc": "Đội ngũ VIETLABEL lắng nghe nhu cầu, tư vấn phương án và phối hợp cùng khách hàng trong suốt quá trình triển khai. Sự chủ động, tinh thần trách nhiệm và cách làm việc rõ ràng là nền tảng để xây dựng niềm tin và quan hệ hợp tác lâu dài."
}

new_en = {
    "title": "VALUE VIETLABEL BRINGS TO BUSINESSES",
    "tab1_title": "TAILORED LABELING SOLUTIONS FOR EACH PRODUCT",
    "tab1_desc": "From design concepts to finished products, VIETLABEL combines material consulting, printing technology, and processing to meet the specific requirements of each product. Every solution aims to balance brand identity, functionality, and deployment costs.",
    "tab2_title": "QUALITY EMPHASIZED IN EVERY STAGE",
    "tab2_desc": "VIETLABEL focuses on quality control from data preparation to printing and finishing. Colors, content, dimensions, and specifications are cross-checked with agreed requirements, ensuring product consistency and suitability for use.",
    "tab3_title": "DIVERSE LABELING APPLICATIONS",
    "tab3_desc": "From food, pharmaceuticals, cosmetics to electronics and industrial applications, VIETLABEL provides various label lines tailored to industry specifics. RFID, heat-resistant, anti-counterfeit, and warranty labels expand our capability to meet specialized needs.",
    "tab4_title": "COMBINING TECHNOLOGY AND CREATIVITY",
    "tab4_desc": "Combining Flexo, Offset, and Letterpress printing technologies with design and processing, VIETLABEL develops label solutions tailored to each requirement. Technology helps actualize ideas, creating a unique mark for products through every label.",
    "tab5_title": "DEDICATED TEAM, LONG-TERM PARTNERSHIP",
    "tab5_desc": "The VIETLABEL team listens to needs, advises on solutions, and coordinates with customers throughout the deployment process. Proactiveness, a sense of responsibility, and a clear working method form the foundation for building trust and long-term partnerships."
}

def update_json(filename, new_data):
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for key, val in new_data.items():
        data['values'][key] = val
        
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

update_json('src/i18n/vi.json', new_vi)
update_json('src/i18n/en.json', new_en)
