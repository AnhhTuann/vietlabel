import re

updates = {
    'hop-giay': {
        'nameVi': 'HỘP GIẤY',
        'shortDescVi': 'Sản xuất hộp 1 lớp, hộp carton, hộp cao cấp trên dây chuyền hiện đại và khép kín, đảm bảo sản phẩm đạt chất lượng cao, đồng nhất.',
    },
    'tui-giay': {
        'nameVi': 'TÚI GIẤY',
        'shortDescVi': 'Túi giấy sản xuất 100% dây chuyền tự động, tối ưu chi phí và thời gian, đảm bảo chất lượng đồng đều từ mẫu mã, kích thước đến màu sắc cho đơn hàng sản lượng lớn.',
    },
    'tui-banh-mi': {
        'nameVi': 'TÚI BÁNH MÌ',
        'shortDescVi': 'Chất liệu giấy đạt tiêu chuẩn quốc tế, an toàn thực phẩm. Đáp ứng đa dạng kích thước, kiểu dáng, phù hợp với nhiều loại bánh mì khác nhau.',
    },
    'tem-nhan': {
        'nameVi': 'TEM NHÃN',
        'shortDescVi': 'Tem dán sản phẩm, tem bảo hành, tem chống hàng giả... chất lượng cao, bền đẹp, bám dính tốt, phù hợp với các môi trường sử dụng khác nhau.',
    },
    'khay-giay': {
        'nameVi': 'KHAY GIẤY',
        'shortDescVi': 'Khay giấy định hình theo sản phẩm, độ bền cao và khả năng chịu lực tốt. Giải pháp trưng bày, vận chuyển hiệu quả cho thực phẩm, nông sản, FMCG, tăng thẩm mỹ và bảo quản trong chuỗi cung ứng.',
    },
    'thung-carton': {
        'nameVi': 'THÙNG CARTON',
        'shortDescVi': 'Cấu trúc chắc chắn, chịu lực cao, bảo vệ tối ưu hàng hóa trong vận chuyển và lưu kho. Thiết kế đa dạng kích thước, tùy chỉnh theo nhu cầu, phù hợp cho nhiều ngành hàng khác nhau.',
    },
    'the-cao': {
        'nameVi': 'THẺ CÀO/ THẺ GIẤY',
        'shortDescVi': 'Ứng dụng công nghệ in dữ liệu biến đổi, tạo thẻ cào bảo mật cao, chống trầy, chống soi, đảm bảo tính an toàn và minh bạch cho doanh nghiệp và khách hàng.',
    },
    'posm': {
        'nameVi': 'POSM',
        'shortDescVi': 'Đa dạng các sản phẩm POSM: Hanger, Wobbler, Tin-tag, Poster, Standee, Voucher, Bao lì xì...và nhiều vật phẩm quảng cáo khác, giúp doanh nghiệp tăng cường nhận diện thương hiệu.',
    }
}

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

for cat_id, data in updates.items():
    # Replace nameVi
    pattern_name = r"(id:\s*'" + cat_id + r"'[\s\S]*?nameVi:\s*')(.*?)(')"
    content = re.sub(pattern_name, r"\g<1>" + data['nameVi'] + r"\g<3>", content, count=1)
    
    # Replace shortDescVi
    pattern_desc = r"(id:\s*'" + cat_id + r"'[\s\S]*?shortDescVi:\s*')(.*?)(')"
    content = re.sub(pattern_desc, r"\g<1>" + data['shortDescVi'] + r"\g<3>", content, count=1)

with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(content)
