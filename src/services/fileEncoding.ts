export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không thể đọc nội dung file.'));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Không thể đọc nội dung file.'));
        return;
      }
      const separator = result.indexOf(',');
      if (separator < 0) {
        reject(new Error('Định dạng file không hợp lệ.'));
        return;
      }
      resolve(result.slice(separator + 1));
    };
    reader.readAsDataURL(file);
  });
}
