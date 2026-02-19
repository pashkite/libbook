const fs = require('fs');
const path = require('path');

const API_KEY = process.env.JEONGBONAROU_API_KEY || process.env.API_KEY;
const BASE_URL = 'https://www.data4library.kr/api';
const REGION = process.env.DAEGU_REGION || '대구광역시';

function toArray(value, key) {
  if (!value) return [];
  if (Array.isArray(value)) return key ? value.map((item) => item[key] || item) : value;
  if (key && value[key]) return [value[key]];
  return [value];
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API 요청 실패 (${response.status})`);
  }
  return response.json();
}

async function fetchDaeguLibraries() {
  const libraries = [];
  let pageNo = 1;
  const pageSize = 100;

  while (true) {
    const url = `${BASE_URL}/libSrch?authKey=${API_KEY}&region=${encodeURIComponent(REGION)}&pageNo=${pageNo}&pageSize=${pageSize}&format=json`;
    const data = await fetchJson(url);
    const libs = toArray(data?.response?.libs, 'lib');

    if (libs.length === 0) {
      break;
    }

    libraries.push(
      ...libs.map((lib) => ({
        libCode: lib.libCode,
        libName: lib.libName,
        address: lib.address || '',
        tel: lib.tel || '',
        homepage: lib.homepage || ''
      }))
    );

    const totalCount = Number(data?.response?.numFound || 0);
    if (libraries.length >= totalCount || libs.length < pageSize) {
      break;
    }
    pageNo += 1;
  }

  const uniqueByCode = new Map();
  for (const library of libraries) {
    if (library.libCode) uniqueByCode.set(library.libCode, library);
  }

  return [...uniqueByCode.values()];
}

function splitLibraries(libraries) {
  const dalseong = [];
  const others = [];

  for (const library of libraries) {
    const searchable = `${library.libName} ${library.address}`;
    if (searchable.includes('달성')) {
      dalseong.push(library);
    } else {
      others.push(library);
    }
  }

  dalseong.sort((a, b) => a.libName.localeCompare(b.libName, 'ko-KR'));
  others.sort((a, b) => a.libName.localeCompare(b.libName, 'ko-KR'));

  return { dalseong, others };
}

async function fetchLibraryBooks(library, maxPages = 30) {
  const books = [];

  for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
    const url = `${BASE_URL}/itemSrch?authKey=${API_KEY}&libCode=${library.libCode}&pageNo=${pageNo}&pageSize=100&format=json`;
    const data = await fetchJson(url);
    const docs = toArray(data?.response?.docs, 'doc');

    if (docs.length === 0) {
      break;
    }

    books.push(
      ...docs.map((doc) => ({
        libCode: library.libCode,
        library: library.libName,
        title: doc.bookname || '',
        author: doc.authors || '',
        publisher: doc.publisher || '',
        publicationYear: doc.publication_year || '',
        isbn13: doc.isbn13 || '',
        classNo: doc.class_no || '',
        imageUrl: doc.bookImageURL || ''
      }))
    );

    const totalCount = Number(data?.response?.numFound || 0);
    if (books.length >= totalCount || docs.length < 100) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  return books;
}

async function fetchAllBooks(libraries) {
  const allBooks = [];

  for (const library of libraries) {
    try {
      const books = await fetchLibraryBooks(library);
      allBooks.push(...books);
      console.log(`✅ ${library.libName}: ${books.length}권 수집`);
    } catch (error) {
      console.warn(`⚠️ ${library.libName}: ${error.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  return allBooks;
}

function dedupeBooks(books) {
  const seen = new Set();
  const deduped = [];

  for (const book of books) {
    const key = book.isbn13
      ? `${book.libCode}:${book.isbn13}`
      : `${book.libCode}:${book.title}:${book.author}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(book);
  }

  return deduped;
}

async function main() {
  if (!API_KEY) {
    throw new Error('JEONGBONAROU_API_KEY(API_KEY) 환경 변수가 필요합니다.');
  }

  console.log(`📚 ${REGION} 도서관 목록 조회 중...`);
  const libraries = await fetchDaeguLibraries();
  const { dalseong, others } = splitLibraries(libraries);
  const orderedLibraries = [...dalseong, ...others];

  console.log(`- 달성군 도서관: ${dalseong.length}개`);
  console.log(`- 기타 대구 도서관: ${others.length}개`);

  console.log('📖 도서 목록 수집 중...');
  const books = await fetchAllBooks(orderedLibraries);
  const dedupedBooks = dedupeBooks(books);

  const output = {
    updatedAt: new Date().toISOString(),
    source: 'https://www.data4library.kr',
    region: REGION,
    libraries: {
      dalseong,
      others,
      totalCount: orderedLibraries.length
    },
    books: dedupedBooks,
    totalBookCount: dedupedBooks.length
  };

  const outputPath = path.join(__dirname, '..', 'public', 'books.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`✅ 저장 완료: ${outputPath} (${dedupedBooks.length}권)`);
}

main().catch((error) => {
  console.error(`❌ 실패: ${error.message}`);
  process.exit(1);
});
