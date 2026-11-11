import { Edit2, Package, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PRODUCT_CATEGORIES } from '../../data/products';
import { api } from '../../services/api';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  images?: string[];
  imageUrl?: string;
  specs?: Record<string, string>;
  isActive: boolean;
  createdAt: string;
}

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [specs, setSpecs] = useState<Record<string, string>>({});

  const fetchProducts = async () => {
    try {
      const res = await api.get('/cms/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await api.delete(`/cms/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Lỗi khi xóa sản phẩm');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Chỉ chấp nhận file PNG, JPG, JPEG, WEBP');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB');
      return;
    }

    setUploading(true);
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];

        try {
          const res = await api.post('/upload', {
            fileName: file.name,
            fileBase64: base64Data,
          });

          if (res.data.url) {
            setCurrentProduct({ ...currentProduct, imageUrl: res.data.url });
            setPreviewImage(res.data.url);
          }
        } catch (err) {
          console.error('Upload error:', err);
          alert('Lỗi khi upload ảnh. Vui lòng thử lại.');
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Lỗi khi upload ảnh. Vui lòng thử lại.');
      setUploading(false);
    }
  };

  const handleSpecChange = (key: string, value: string) => {
    setSpecs((prev) => ({ ...prev, [key]: value }));
  };

  const addSpecField = () => {
    const key = prompt('Nhập tên thông số:');
    if (key && key.trim()) {
      setSpecs((prev) => ({ ...prev, [key.trim()]: '' }));
    }
  };

  const removeSpecField = (key: string) => {
    setSpecs((prev) => {
      const newSpecs = { ...prev };
      delete newSpecs[key];
      return newSpecs;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...currentProduct,
        slug:
          currentProduct?.slug ||
          currentProduct?.name
            ?.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') ||
          '',
        images: currentProduct?.imageUrl
          ? [
              currentProduct.imageUrl,
              ...(currentProduct.images || []).filter((image) => image !== currentProduct.imageUrl),
            ]
          : currentProduct?.images || [],
        categoryId: currentProduct?.categoryId || PRODUCT_CATEGORIES[0].id,
        specs: specs,
      };
      if (currentProduct?.id) {
        await api.put(`/cms/products/${currentProduct.id}`, payload);
      } else {
        await api.post('/cms/products', payload);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi lưu sản phẩm');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Quản lý Sản phẩm - Admin</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Sản phẩm</h1>
          <p className="text-slate-500 text-sm">Thêm, sửa, xóa sản phẩm hiển thị trên website</p>
        </div>
        <button
          onClick={() => {
            setCurrentProduct({ isActive: true, categoryId: PRODUCT_CATEGORIES[0].id });
            setSpecs({});
            setPreviewImage('');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#BE1E2D] text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4384]/20 focus:border-[#1E4384]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Tên sản phẩm</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold">Ngày tạo</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                          <Package className="w-5 h-5" />
                        </div>
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.isActive ? (
                        <span className="px-2.5 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                          Hiển thị
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                          Ẩn
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setCurrentProduct({ ...product, imageUrl: product.images?.[0] || '' });
                            setSpecs(product.specs || {});
                            setPreviewImage(product.images?.[0] || '');
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                {currentProduct?.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4384]/20 focus:border-[#1E4384]"
                  value={currentProduct?.name || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mô tả ngắn gọn
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4384]/20 focus:border-[#1E4384]"
                  value={currentProduct?.description || ''}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Danh mục *</label>
                <select
                  required
                  value={currentProduct?.categoryId || PRODUCT_CATEGORIES[0].id}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, categoryId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4384]/20 focus:border-[#1E4384]"
                >
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nameVi}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ảnh sản phẩm
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-[#1E4384] hover:bg-slate-50 transition-colors">
                      <Upload className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-600">Chọn file ảnh</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  <input
                    type="url"
                    value={currentProduct?.imageUrl || ''}
                    onChange={(e) => {
                      setCurrentProduct({ ...currentProduct, imageUrl: e.target.value });
                      setPreviewImage(e.target.value);
                    }}
                    placeholder="Hoặc nhập URL ảnh..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4384]/20 focus:border-[#1E4384]"
                  />
                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-4 h-4 border-2 border-[#BE1E2D] border-t-transparent rounded-full animate-spin" />
                      Đang upload...
                    </div>
                  )}
                  {(currentProduct?.imageUrl || previewImage) && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-200">
                      <img
                        src={currentProduct?.imageUrl || previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder.png';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Thông số kỹ thuật
                  </label>
                  <button
                    type="button"
                    onClick={addSpecField}
                    className="text-sm text-[#1E4384] hover:text-[#BE1E2D] font-medium"
                  >
                    + Thêm thông số
                  </button>
                </div>
                <div className="space-y-2">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <input
                        type="text"
                        value={key}
                        disabled
                        className="w-1/3 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm font-medium"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleSpecChange(key, e.target.value)}
                        placeholder="Giá trị"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4384]/20 focus:border-[#1E4384]"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecField(key)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {Object.keys(specs).length === 0 && (
                    <p className="text-sm text-slate-500 italic">Chưa có thông số kỹ thuật</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={currentProduct?.isActive !== false}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-[#BE1E2D] focus:ring-[#BE1E2D] border-slate-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
                  Hiển thị trên website
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1E4384] text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Lưu sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
