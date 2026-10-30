import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images', 'vietlabel', 'blog');
const OUTPUT_POSTS_FILE = path.join(ROOT_DIR, 'src', 'data', 'posts.ts');

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
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
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
    // Sanitize filename
    originalFilename = originalFilename.replace(/[^a-zA-Z0-9._-]/g, '-');
    if (!originalFilename || !originalFilename.includes('.')) {
      originalFilename = `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.webp`;
    }

    const localFilePath = path.join(IMAGES_DIR, originalFilename);
    const publicPath = `/images/vietlabel/blog/${originalFilename}`;

    // Skip if already downloaded and has non-zero size
    if (fs.existsSync(localFilePath) && fs.statSync(localFilePath).size > 0) {
      return publicPath;
    }

    const res = await fetch(imgUrl, { headers: HEADERS });
    if (!res.ok) {
      console.warn(`Failed to download image ${imgUrl}: HTTP ${res.status}`);
      return imgUrl;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length === 0) {
      console.warn(`Empty image buffer for ${imgUrl}`);
      return imgUrl;
    }

    fs.writeFileSync(localFilePath, buffer);
    return publicPath;
  } catch (err) {
    console.warn(`Error downloading image ${imgUrl}:`, err.message);
    return imgUrl;
  }
}

function cleanHtmlContent(rawHtml) {
  let content = rawHtml;

  // Remove ez-toc (Table of contents)
  content = content.replace(/<div id="ez-toc-container"[\s\S]*?<\/div>\s*<\/div>/gi, '');
  content = content.replace(/<div id="ez-toc-container"[\s\S]*?<\/div>/gi, '');

  // Remove post-views counter
  content = content.replace(/<div class="[^"]*post-views[^"]*"[\s\S]*?<\/div>/gi, '');

  // Remove social share buttons
  content = content.replace(/<div class="[^"]*blog-share[^"]*"[\s\S]*?<\/div>/gi, '');
  content = content.replace(/<div class="[^"]*social-icons[^"]*"[\s\S]*?<\/div>/gi, '');

  // Remove unwanted empty divider divs
  content = content.replace(/<div class="is-divider"[^>]*><\/div>/gi, '');

  // Clean trailing empty paragraphs
  content = content.replace(/(<p>(&nbsp;|\s)*<\/p>\s*)+$/gi, '');

  return content.trim();
}

function extractParagraphs(html) {
  // Extract text from <p> and <li>
  const matches = [...html.matchAll(/<(?:p|li|h[2-4])[^>]*>([\s\S]*?)<\/(?:p|li|h[2-4])>/gi)];
  const paras = [];
  for (const m of matches) {
    const text = m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    if (text && text.length > 10 && !text.includes('Table of Contents')) {
      paras.push(text);
    }
  }
  return paras;
}

function determineCategory(title, content) {
  const text = (title + ' ' + content).toLowerCase();
  if (text.includes('dự án') || text.includes('case study') || text.includes('khách hàng') || text.includes('hợp tác') || text.includes('th true milk') || text.includes('yến sào')) {
    return {
      category: 'du-an-noi-bat',
      categoryNameVi: 'Dự án nổi bật',
      categoryNameEn: 'Case Studies',
    };
  }
  if (text.includes('sinh nhật') || text.includes('nội bộ') || text.includes('nhà máy') || text.includes('khánh thành') || text.includes('hoạt động') || text.includes('văn hóa') || text.includes('vietlabel tổ chức') || text.includes('tuyển dụng')) {
    return {
      category: 'hoat-dong-cong-ty',
      categoryNameVi: 'Hoạt động công ty',
      categoryNameEn: 'Company News',
    };
  }
  return {
    category: 'nganh-bao-bi',
    categoryNameVi: 'Kiến thức ngành',
    categoryNameEn: 'Industry Insights',
  };
}

async function crawl() {
  console.log('🚀 Bắt đầu cào dữ liệu từ https://vietlabel.com.vn/vi/blog-vi/ (12 trang)...');

  const postListItems = [];

  for (let page = 1; page <= 12; page++) {
    const url = page === 1 ? 'https://vietlabel.com.vn/vi/blog-vi/' : `https://vietlabel.com.vn/vi/blog-vi/page/${page}/`;
    console.log(`📄 Đang quét trang ${page}/12: ${url}`);

    try {
      const html = await fetchWithRetry(url);
      const postCardRegex = /<div class="col post-item"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g;
      const cards = html.match(postCardRegex) || [];

      console.log(`   Tìm thấy ${cards.length} bài viết trên trang ${page}`);

      for (const card of cards) {
        // Extract post URL
        const urlMatch = card.match(/<a href="(https:\/\/vietlabel\.com\.vn\/vi\/[^"]+)"/);
        if (!urlMatch) continue;
        const postUrl = urlMatch[1];

        // Extract Title
        const titleMatch = card.match(/<h5 class="post-title[^"]*">\s*<a[^>]*>([\s\S]*?)<\/a>/)
          || card.match(/aria-label="([^"]+)"/);
        let title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

        // Extract Featured Image
        const imgMatch = card.match(/<img[^>]+src="([^"]+)"/);
        const remoteImg = imgMatch ? imgMatch[1] : '';

        // Extract Excerpt
        const excerptMatch = card.match(/<p class="from_the_blog_excerpt[^"]*">([\s\S]*?)<\/p>/);
        const rawExcerpt = excerptMatch ? excerptMatch[1].replace(/<[^>]+>/g, '').replace(/\[\.\.\.\]/g, '...').trim() : '';

        // Extract Date
        const dayMatch = card.match(/<span class="post-date-day">(\d+)<\/span>/);
        const monthMatch = card.match(/<span class="post-date-month[^"]*">([^<]+)<\/span>/);
        let dateStr = '2026';
        if (dayMatch && monthMatch) {
          const day = dayMatch[1];
          const monthText = monthMatch[1].trim();
          const mNum = monthText.replace(/\D/g, '');
          dateStr = `${day} Tháng ${mNum.padStart(2, '0')}, 2026`;
        }

        // Slug
        const slug = postUrl.replace('https://vietlabel.com.vn/vi/', '').replace(/\/$/, '');

        postListItems.push({
          postUrl,
          slug,
          title,
          remoteImg,
          excerpt: rawExcerpt,
          dateStr,
        });
      }
    } catch (err) {
      console.error(`❌ Lỗi khi tải trang ${page}:`, err.message);
    }
  }

  console.log(`\n✅ Tổng cộng đã thu thập được ${postListItems.length} bài viết.`);
  console.log('📦 Bắt đầu tải chi tiết từng bài viết và download hình ảnh về local...');

  const finalPosts = [];

  for (let idx = 0; idx < postListItems.length; idx++) {
    const item = postListItems[idx];
    console.log(`\n[${idx + 1}/${postListItems.length}] Đang xử lý: ${item.title} (${item.slug})`);

    try {
      // 1. Download featured image
      let localFeaturedImage = item.remoteImg;
      if (item.remoteImg) {
        localFeaturedImage = await downloadImage(item.remoteImg);
      }

      // 2. Fetch single post HTML
      const postHtml = await fetchWithRetry(item.postUrl);

      // Extract full title if available
      const h1Match = postHtml.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i)
        || postHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (h1Match) {
        const fullTitle = h1Match[1].replace(/<[^>]+>/g, '').trim();
        if (fullTitle) item.title = fullTitle;
      }

      // Extract entry-content
      const startIdx = postHtml.indexOf('entry-content single-page');
      let articleHtml = '';
      if (startIdx !== -1) {
        const after = postHtml.substring(startIdx);
        const tagClose = after.indexOf('>');
        const endArticleIdx = after.indexOf('</article>') !== -1 ? after.indexOf('</article>') : after.indexOf('entry-footer');
        articleHtml = after.substring(tagClose + 1, endArticleIdx !== -1 ? endArticleIdx : 15000);
      } else {
        console.warn(`   ⚠️ Không tìm thấy entry-content cho ${item.postUrl}`);
      }

      // Clean HTML
      let cleanedHtml = cleanHtmlContent(articleHtml);

      // 3. Find all inline images in cleanedHtml and download them
      const inlineImages = [...cleanedHtml.matchAll(/<img[^>]+src=["\x27]([^"\x27]+)["\x27][^>]*>/gi)];
      console.log(`   Tìm thấy ${inlineImages.length} ảnh nội tuyến trong bài viết.`);

      for (const m of inlineImages) {
        const rawSrc = m[1];
        if (rawSrc.startsWith('http')) {
          const localSrc = await downloadImage(rawSrc);
          cleanedHtml = cleanedHtml.replaceAll(rawSrc, localSrc);
        }
      }

      // Remove unwanted attributes like srcset or sizes that point to original server
      cleanedHtml = cleanedHtml.replace(/\s*srcset="[^"]*"/gi, '');
      cleanedHtml = cleanedHtml.replace(/\s*sizes="[^"]*"/gi, '');

      // Extract paragraphs for text fallback
      const paragraphs = extractParagraphs(cleanedHtml);
      const summary = item.excerpt || (paragraphs.length > 0 ? paragraphs[0].substring(0, 160) + '...' : item.title);

      // Calculate read time
      const wordCount = cleanedHtml.replace(/<[^>]+>/g, ' ').split(/\s+/).length;
      const readMinutes = Math.max(2, Math.ceil(wordCount / 200));

      const catInfo = determineCategory(item.title, cleanedHtml);

      finalPosts.push({
        id: `post-${idx + 1}`,
        slug: item.slug,
        category: catInfo.category,
        categoryNameVi: catInfo.categoryNameVi,
        categoryNameEn: catInfo.categoryNameEn,
        titleVi: item.title,
        titleEn: item.title,
        summaryVi: summary,
        summaryEn: summary,
        date: item.dateStr,
        readTimeVi: `${readMinutes} phút đọc`,
        readTimeEn: `${readMinutes} min read`,
        author: 'Ban biên tập Vietlabel',
        image: localFeaturedImage,
        contentVi: paragraphs.length > 0 ? paragraphs : [summary],
        contentEn: paragraphs.length > 0 ? paragraphs : [summary],
        contentHtml: cleanedHtml,
        isFeatured: idx < 5,
      });

      console.log(`   ✅ Hoàn thành bài ${idx + 1}/${postListItems.length}`);
    } catch (err) {
      console.error(`❌ Lỗi xử lý bài viết ${item.postUrl}:`, err.message);
    }
  }

  console.log(`\n🎉 Thu thập xong ${finalPosts.length} bài viết!`);
  console.log(`💾 Đang ghi dữ liệu vào ${OUTPUT_POSTS_FILE}...`);

  // Build TypeScript code
  const tsContent = `// Tự động thu thập từ https://vietlabel.com.vn/vi/blog-vi/
// Tổng cộng ${finalPosts.length} bài viết và toàn bộ hình ảnh đã được tải về local.

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

export const POSTS_LIST: PostItem[] = ${JSON.stringify(finalPosts, null, 2)};
`;

  fs.writeFileSync(OUTPUT_POSTS_FILE, tsContent, 'utf-8');
  console.log(`✅ Đã lưu ${finalPosts.length} bài viết vào ${OUTPUT_POSTS_FILE}`);
}

crawl().catch(console.error);
