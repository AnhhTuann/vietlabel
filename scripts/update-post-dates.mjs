import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const POSTS_FILE = path.join(ROOT_DIR, 'src', 'data', 'posts.ts');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

async function fetchDateForSlug(slug) {
  const url = `https://vietlabel.com.vn/vi/${slug}/`;
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/"datePublished":\s*"([^"]+)"/);
    if (match) return match[1];

    // Fallback: check article:published_time
    const metaMatch = html.match(/property="article:published_time"\s*content="([^"]+)"/i);
    if (metaMatch) return metaMatch[1];

    return null;
  } catch (err) {
    return null;
  }
}

async function run() {
  console.log('🚀 Đang đọc danh sách 114 bài viết từ src/data/posts.ts...');
  const postsContent = fs.readFileSync(POSTS_FILE, 'utf8');
  const jsonMatch = postsContent.match(/export const POSTS_LIST: PostItem\[\] = (\[[\s\S]*?\]);/);
  if (!jsonMatch) throw new Error('Cannot find POSTS_LIST in posts.ts');

  const posts = eval(jsonMatch[1]);
  console.log(`Tìm thấy ${posts.length} bài viết.`);

  // Process in batches of 10 concurrent requests
  const BATCH_SIZE = 10;
  for (let i = 0; i < posts.length; i += BATCH_SIZE) {
    const batch = posts.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (p, bIdx) => {
      const idx = i + bIdx + 1;
      const rawDate = await fetchDateForSlug(p.slug);
      if (rawDate) {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
          const day = String(d.getDate()).padStart(2, '0');
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const year = d.getFullYear();
          p.date = `${day} Tháng ${month}, ${year}`;
          p.rawPublishedAt = d.toISOString();
          console.log(`[${idx}/${posts.length}] ${p.slug} -> ${p.date} (${rawDate})`);
        }
      } else {
        console.warn(`[${idx}/${posts.length}] Không tìm thấy datePublished cho ${p.slug}, giữ: ${p.date}`);
      }
    }));
  }

  // Sort posts descending by publication date (newest first)
  posts.sort((a, b) => {
    const timeA = a.rawPublishedAt ? new Date(a.rawPublishedAt).getTime() : 0;
    const timeB = b.rawPublishedAt ? new Date(b.rawPublishedAt).getTime() : 0;
    return timeB - timeA;
  });

  // Clean temporary rawPublishedAt before saving or keep for database
  const datesMap = {};
  posts.forEach(p => {
    if (p.rawPublishedAt) {
      datesMap[p.slug] = p.rawPublishedAt;
      delete p.rawPublishedAt;
    }
  });

  console.log('\n💾 Đang ghi lại src/data/posts.ts với ngày giờ thật từ vietlabel.com.vn...');
  const newTsContent = `// Tự động thu thập từ https://vietlabel.com.vn/vi/blog-vi/
// Tổng cộng ${posts.length} bài viết với ngày đăng thực tế và toàn bộ hình ảnh local.

export interface PostItem {
  id: string;
  slug: string;
  category: 'nganh-bao-bi' | 'du-an-noi-bat' | 'hoat-dong-cong-ty';
  categoryNameVi: string;
  categoryNameEn: string;
  titleVi: string;
  titleEn: string;
  summaryVi: string;
  summaryEn: string;
  date: string;
  readTimeVi: string;
  readTimeEn: string;
  author: string;
  image: string;
  contentVi: string[];
  contentEn: string[];
  contentHtml?: string;
  isFeatured?: boolean;
}

export const POSTS_LIST: PostItem[] = ${JSON.stringify(posts, null, 2)};
`;

  fs.writeFileSync(POSTS_FILE, newTsContent, 'utf8');
  console.log('✅ Đã cập nhật xong posts.ts!');

  // Save dates map for DB sync
  fs.writeFileSync(path.join(ROOT_DIR, 'scripts', 'dates-map.json'), JSON.stringify(datesMap, null, 2), 'utf8');
}

run().catch(console.error);
