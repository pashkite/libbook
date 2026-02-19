// 정보나루 API로부터 대구 전체 도서관 소장 도서 목록을 가져와서 books.json을 업데이트하는 스크립트
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://www.data4library.kr/api';
const REGION = '대구'; // 대구 전체

// 대구 지역 도서관 목록 조회
async function fetchDaeguLibraries() {
  console.log('📚 대구 지역 도서관 목록 조회 중...');
  
  try {
    const url = `${BASE_URL}/libSrch?authKey=${API_KEY}&region=${encodeURIComponent(REGION)}&pageNo=1&pageSize=100&format=json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.response || data.response.resultNum === 0) {
      console.warn('⚠️ 대구 지역 도서관을 찾을 수 없습니다.');
      return [];
    }
    
    const libs = Array.isArray(data.response.libs)
      ? data.response.libs.map(lib => lib.lib)
      : [data.response.libs.lib];
    
    const libraries = libs.map(lib => ({
      code: lib.lib_code || lib.libCode,
      name: lib.libName || lib.lib_name,
      address: lib.address || '',
      homepage: lib.homepage || ''
    }));
    
    console.log(`✅ 대구 지역 도서관 ${libraries.length}개 발견`);
    libraries.forEach((lib, idx) => {
      console.log(`   ${idx + 1}. ${lib.name} (${lib.code})`);
    });
    
    return libraries;
    
  } catch (error) {
    console.error('❌ 도서관 목록 조회 실패:', error.message);
    return [];
  }
}

// 각 도서관의 소장 도서를 가져오는 함수 (인기 대출 도서 기반)
async function fetchLibraryBooks(libCode, libName) {
  console.log(`\n📖 ${libName} 소장 도서 수집 중...`);
  
  const books = [];
  const maxPages = 10; // 페이지당 100권, 최대 1000권
  
  try {
    // 최근 1년 대출 도서를 기준으로 수집
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    
    const startDt = startDate.toISOString().split('T')[0];
    const endDt = endDate.toISOString().split('T')[0];
    
    for (let page = 1; page <= maxPages; page++) {
      const url = `${BASE_URL}/loanItemSrchByLib?authKey=${API_KEY}&libCode=${libCode}&startDt=${startDt}&endDt=${endDt}&pageNo=${page}&pageSize=100&format=json`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log(`  ⚠️ 대출 데이터 없음`);
          break;
        }
        console.error(`  ❌ 페이지 ${page} 조회 실패 (${response.status})`);
        break;
      }
      
      const data = await response.json();
      
      if (!data.response || data.response.resultNum === 0) {
        console.log(`  ✅ 총 ${books.length}권 수집 완료`);
        break;
      }
      
      const pageDocs = Array.isArray(data.response.docs)
        ? data.response.docs.map(doc => doc.doc)
        : [data.response.docs.doc];
      
      // 도서 정보 변환
      const pageBooks = pageDocs.map(doc => ({
        id: doc.no || doc.isbn13 || `${libCode}-${Date.now()}-${Math.random()}`,
        title: doc.bookname || '제목 없음',
        author: doc.authors || '저자 미상',
        publisher: doc.publisher || '출판사 미상',
        year: doc.publication_year || '',
        isbn: doc.isbn13 || '',
        category: doc.class_nm || doc.class_no || '미분류',
        location: libName,
        room: '일반자료실',
        available: true,
        loanCount: parseInt(doc.loanCnt || '0'),
        ranking: parseInt(doc.ranking || '0'),
        imageUrl: doc.bookImageURL || ''
      }));
      
      books.push(...pageBooks);
      
      console.log(`  ✅ 페이지 ${page}: ${pageBooks.length}권 (누적: ${books.length}권)`);
      
      // API 요청 간격 (과부하 방지)
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
  } catch (error) {
    console.error(`  ❌ ${libName} 오류:`, error.message);
  }
  
  return books;
}

// 신착도서 수집
async function fetchNewBooks(libCode, libName) {
  console.log(`\n🆕 ${libName} 신착 도서 수집 중...`);
  
  const books = [];
  
  try {
    const url = `${BASE_URL}/newBooks?authKey=${API_KEY}&libCode=${libCode}&pageNo=1&pageSize=50&format=json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`  ⚠️ 신착 도서 데이터 없음`);
        return [];
      }
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.response || data.response.resultNum === 0) {
      console.log(`  ⚠️ 신착 도서 없음`);
      return [];
    }
    
    const docs = Array.isArray(data.response.docs)
      ? data.response.docs.map(doc => doc.doc)
      : [data.response.docs.doc];
    
    const newBooks = docs.map(doc => ({
      id: doc.no || doc.isbn13 || `${libCode}-new-${Date.now()}-${Math.random()}`,
      title: doc.bookname || '제목 없음',
      author: doc.authors || '저자 미상',
      publisher: doc.publisher || '출판사 미상',
      year: doc.publication_year || '',
      isbn: doc.isbn13 || '',
      category: doc.class_nm || doc.class_no || '미분류',
      location: libName,
      room: '일반자료실',
      available: true,
      isNew: true, // 신착 도서 표시
      imageUrl: doc.bookImageURL || ''
    }));
    
    books.push(...newBooks);
    console.log(`  ✅ 신착 도서 ${books.length}권 수집`);
    
  } catch (error) {
    console.error(`  ❌ 신착 도서 수집 실패:`, error.message);
  }
  
  return books;
}

// 모든 도서관의 도서를 가져와서 통합
async function fetchAllBooks() {
  console.log('🚀 대구 전체 도서관 소장 도서 수집 시작...\n');
  console.log(`📅 실행 시간: ${new Date().toISOString()}\n`);
  
  if (!API_KEY) {
    console.error('❌ API 키가 설정되지 않았습니다.');
    console.error('🔑 GitHub Secrets에 JEONGBONAROU_API_KEY를 추가하세요.');
    process.exit(1);
  }
  
  // 1. 대구 지역 도서관 목록 가져오기
  const libraries = await fetchDaeguLibraries();
  
  if (libraries.length === 0) {
    console.error('❌ 도서관을 찾을 수 없습니다.');
    process.exit(1);
  }
  
  console.log(`\n📊 총 ${libraries.length}개 도서관에서 데이터 수집 시작\n`);
  console.log('='.repeat(60));
  
  const allBooks = [];
  
  // 2. 각 도서관에서 소장 도서 + 신착 도서 수집
  for (const library of libraries) {
    try {
      // 소장 도서 (인기 대출 기반)
      const popularBooks = await fetchLibraryBooks(library.code, library.name);
      allBooks.push(...popularBooks);
      
      // 신착 도서
      const newBooks = await fetchNewBooks(library.code, library.name);
      allBooks.push(...newBooks);
      
      console.log(`  💾 ${library.name}: 총 ${popularBooks.length + newBooks.length}권 수집`);
      
      // 도서관 간 요청 간격
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ ${library.name} 처리 실패:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  
  // 3. 중복 제거 (ISBN 기준)
  const uniqueBooks = [];
  const seenISBNs = new Set();
  const seenTitles = new Set(); // ISBN 없는 경우 제목으로 중복 체크
  
  for (const book of allBooks) {
    // ISBN이 있는 경우
    if (book.isbn && book.isbn !== '') {
      if (seenISBNs.has(book.isbn)) {
        continue; // 중복
      }
      seenISBNs.add(book.isbn);
      uniqueBooks.push(book);
    } 
    // ISBN 없는 경우 제목으로 중복 체크
    else {
      const titleKey = `${book.title}-${book.author}`;
      if (seenTitles.has(titleKey)) {
        continue; // 중복
      }
      seenTitles.add(titleKey);
      uniqueBooks.push(book);
    }
  }
  
  // 4. 통계
  console.log(`\n📊 수집 통계:`);
  console.log(`  - 총 수집: ${allBooks.length}권`);
  console.log(`  - 고유 도서: ${uniqueBooks.length}권`);
  console.log(`  - 중복 제거: ${allBooks.length - uniqueBooks.length}권`);
  
  const newBooksCount = uniqueBooks.filter(b => b.isNew).length;
  console.log(`  - 신착 도서: ${newBooksCount}권`);
  console.log(`  - 소장 도서: ${uniqueBooks.length - newBooksCount}권`);
  
  // 5. books.json 파일로 저장
  const outputPath = path.join(__dirname, '..', 'public', 'books.json');
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(uniqueBooks, null, 2), 'utf-8');
  
  console.log(`\n✅ books.json 업데이트 완료!`);
  console.log(`📁 파일 경로: ${outputPath}`);
  console.log(`📅 업데이트 일시: ${new Date().toISOString()}`);
  console.log(`\n🎉 모든 작업 완료!`);
}

// 실행
fetchAllBooks().catch(error => {
  console.error('❌ 치명적 오류:', error);
  process.exit(1);
});
