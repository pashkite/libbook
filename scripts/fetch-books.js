// 정보나루 API로부터 대구 전체 도서관 소장 도서 목록을 가져와서 books.json을 업데이트하는 스크립트
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.API_KEY;
const BASE_URL = 'http://data4library.kr/api'; // https -> http

// 대구 지역 도서관 목록 (정보나루에 등록된 대구 도서관 코드)
const DAEGU_LIBRARIES = [
  // 대구광역시 국공립 도서관
  { code: '111001', name: '대구광역시립중앙도서관' },
  { code: '111002', name: '대구광역시립남부도서관' },
  { code: '111003', name: '대구광역시립동부도서관' },
  { code: '111004', name: '대구광역시립남부어린이도서관' },
  { code: '111005', name: '대구광역시립서부도서관' },
  { code: '111006', name: '대구광역시립북부도서관' },
  { code: '111007', name: '대구광역시립수성구립중앙도서관' },
  { code: '111008', name: '대구광역시립수성구립열매도서관' },
  { code: '111009', name: '대구광역시립중구립경상도서관' },
  { code: '111010', name: '대구광역시립중구립동인도서관' },
  { code: '111011', name: '대구광역시립달서구립구지도서관' },
  { code: '111012', name: '대구광역시립달서구립달서도서관' },
  { code: '111013', name: '대구광역시립달서구립두류도서관' },
  { code: '111014', name: '대구광역시립달서구립가창도서관' },
  { code: '111015', name: '대구광역시립달서구립용산도서관' },
  { code: '111016', name: '대구광역시립동구립숥구도서관' },
  { code: '111017', name: '대구광역시립동구립안심도서관' },
  { code: '111018', name: '대구광역시립동구립해안도서관' },
  { code: '111019', name: '대구광역시립북구립침산도서관' },
  { code: '111020', name: '대구광역시립북구립노원도서관' },
  { code: '111021', name: '대구광역시립북구립서부도서관' },
  { code: '111022', name: '대구광역시립북구립평광도서관' },
  { code: '111023', name: '대구광역시립북구립칠성도서관' },
  { code: '111024', name: '대구광역시립서구립원대도서관' },
  { code: '111025', name: '대구광역시립서구립보리도서관' },
  { code: '111026', name: '대구광역시립서구립비산도서관' },
  { code: '111027', name: '대구광역시립서구립남부도서관' },
  { code: '111028', name: '대구광역시립서구립모명도서관' },
  { code: '111029', name: '대구광역시립남구립대명도서관' },
  { code: '111030', name: '대구광역시립남구립않량도서관' },
  
  // 달성군 도서관
  { code: 'LIB140001', name: '달성군립도서관' },
  { code: 'LIB140002', name: '논공도서관' },
  { code: 'LIB140003', name: '다사도서관' },
  { code: 'LIB140004', name: '유가도서관' },
  { code: 'LIB140005', name: '화원도서관' },
  { code: 'LIB140006', name: '옥포도서관' },
  { code: 'LIB140007', name: '구지도서관' },
];

// 각 도서관의 소장 도서를 가져오는 함수 (itemSrch API 사용)
async function fetchLibraryBooks(libCode, libName) {
  console.log(`\n📖 ${libName} (${libCode}) 소장 도서 수집 중...`);
  
  const books = [];
  const maxPages = 10; // 페이지당 100권, 최대 1000권
  
  try {
    for (let page = 1; page <= maxPages; page++) {
      const url = `${BASE_URL}/itemSrch?libCode=${libCode}&authKey=${API_KEY}&type=ALL&pageNo=${page}&pageSize=100&format=json`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.log(`  ⚠️ 페이지 ${page} 조회 실패 (${response.status})`);
        break;
      }
      
      const data = await response.json();
      
      if (!data.response || !data.response.docs || data.response.docs.length === 0) {
        console.log(`  ✅ 총 ${books.length}권 수집 완료`);
        break;
      }
      
      // docs는 배열이고, 각 요소는 { doc: {...} } 형태
      const pageDocs = data.response.docs.map(item => item.doc);
      
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
        callNumber: doc.vol || '',
        available: true,
        imageUrl: doc.bookImageURL || ''
      }));
      
      books.push(...pageBooks);
      
      console.log(`  ✅ 페이지 ${page}: ${pageBooks.length}권 (누적: ${books.length}권)`);
      
      // 전체 결과 수가 현재 페이지보다 작으면 마지막 페이지
      const totalResults = parseInt(data.response.resultNum || '0');
      if (books.length >= totalResults) {
        console.log(`  ✅ 모든 도서 수집 완료 (${totalResults}권)`);
        break;
      }
      
      // API 요청 간격 (과부하 방지)
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
  } catch (error) {
    console.error(`  ❌ ${libName} 오류:`, error.message);
  }
  
  return books;
}

// 모든 도서관의 도서를 가져와서 통합
async function fetchAllBooks() {
  console.log('🚀 대구 지역 도서관 소장 도서 수집 시작...\n');
  console.log(`📅 실행 시간: ${new Date().toISOString()}\n`);
  
  if (!API_KEY) {
    console.error('❌ API 키가 설정되지 않았습니다.');
    console.error('🔑 GitHub Secrets에 JEONGBONAROU_API_KEY를 추가하세요.');
    process.exit(1);
  }
  
  console.log(`📊 총 ${DAEGU_LIBRARIES.length}개 도서관에서 데이터 수집 시작\n`);
  console.log('='.repeat(60));
  
  const allBooks = [];
  let successCount = 0;
  let failCount = 0;
  
  // 각 도서관에서 소장 도서 수집
  for (const library of DAEGU_LIBRARIES) {
    try {
      const books = await fetchLibraryBooks(library.code, library.name);
      
      if (books.length > 0) {
        allBooks.push(...books);
        successCount++;
        console.log(`  💾 ${library.name}: ${books.length}권 수집 성공`);
      } else {
        failCount++;
        console.log(`  ⚠️ ${library.name}: 도서 없음`);
      }
      
      // 도서관 간 요청 간격
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      failCount++;
      console.error(`❌ ${library.name} 처리 실패:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  
  // 중복 제거 (ISBN 기준)
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
    // ISBN 없는 경우 제목+저자로 중복 체크
    else {
      const titleKey = `${book.title}-${book.author}`;
      if (seenTitles.has(titleKey)) {
        continue; // 중복
      }
      seenTitles.add(titleKey);
      uniqueBooks.push(book);
    }
  }
  
  // 통계
  console.log(`\n📊 수집 통계:`);
  console.log(`  - 도서관 수: ${DAEGU_LIBRARIES.length}개`);
  console.log(`  - 성공: ${successCount}개`);
  console.log(`  - 실패: ${failCount}개`);
  console.log(`  - 총 수집: ${allBooks.length}권`);
  console.log(`  - 고유 도서: ${uniqueBooks.length}권`);
  console.log(`  - 중복 제거: ${allBooks.length - uniqueBooks.length}권`);
  
  // books.json 파일로 저장
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
