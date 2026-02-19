// 정보나루(도서관 정보나루) API 서비스

const API_KEY = import.meta.env.VITE_JEONGBONAROU_API_KEY;
const BASE_URL = 'https://www.data4library.kr/api';

// API 키 유효성 검사
if (!API_KEY || API_KEY === 'your_api_key_here') {
  console.warn('⚠️ 정보나루 API 키가 설정되지 않았습니다.');
  console.warn('📝 .env 파일을 생성하고 VITE_JEONGBONAROU_API_KEY를 설정하세요.');
}

export interface JeongbonarouBook {
  no: string;
  bookname: string;
  authors: string;
  publisher: string;
  publication_year: string;
  isbn13: string;
  class_no?: string;
  bookImageURL?: string;
  loanCnt?: string;
}

export interface LibraryHolding {
  libCode: string;
  libName: string;
  hasBook: string; // 'Y' or 'N'
  loanAvailable: string; // 'Y' or 'N'
  bookCount: string;
  loanCnt?: string;
}

export interface PopularBook extends JeongbonarouBook {
  ranking: string;
  loanCnt: string;
}

// 도서관 장서 조회 API (itemSrch)
export async function getLibraryBooks(
  libCode: string,
  pageNo: number = 1,
  pageSize: number = 100
): Promise<{ books: JeongbonarouBook[]; totalCount: number }> {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.error('API 키가 설정되지 않았습니다.');
    return { books: [], totalCount: 0 };
  }

  try {
    const url = `${BASE_URL}/itemSrch?authKey=${API_KEY}&libCode=${libCode}&pageNo=${pageNo}&pageSize=${pageSize}&format=json`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.response?.resultNum === 0) {
      return { books: [], totalCount: 0 };
    }

    const books = Array.isArray(data.response?.docs)
      ? data.response.docs.map((doc: any) => doc.doc)
      : data.response?.docs?.doc
      ? [data.response.docs.doc]
      : [];

    return {
      books,
      totalCount: parseInt(data.response?.numFound || data.response?.resultNum || '0')
    };
  } catch (error) {
    console.error('도서관 장서 조회 실패:', error);
    return { books: [], totalCount: 0 };
  }
}

// 도서 검색 API
export async function searchBooks(
  keyword: string,
  pageNo: number = 1,
  pageSize: number = 20
): Promise<{ books: JeongbonarouBook[]; totalCount: number }> {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.error('API 키가 설정되지 않았습니다.');
    return { books: [], totalCount: 0 };
  }

  try {
    const url = `${BASE_URL}/srchBooks?authKey=${API_KEY}&keyword=${encodeURIComponent(keyword)}&pageNo=${pageNo}&pageSize=${pageSize}&format=json`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.response?.resultNum === 0) {
      return { books: [], totalCount: 0 };
    }
    
    const books = Array.isArray(data.response?.docs)
      ? data.response.docs.map((doc: any) => doc.doc)
      : data.response?.docs?.doc
      ? [data.response.docs.doc]
      : [];
    
    return {
      books,
      totalCount: parseInt(data.response?.resultNum || '0')
    };
  } catch (error) {
    console.error('도서 검색 실패:', error);
    return { books: [], totalCount: 0 };
  }
}

// 도서관별 소장 조회 API
export async function getLibraryHoldings(
  isbn: string,
  region: string = '대구'
): Promise<LibraryHolding[]> {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.error('API 키가 설정되지 않았습니다.');
    return [];
  }

  try {
    const url = `${BASE_URL}/libSrchByBook?authKey=${API_KEY}&isbn=${isbn}&region=${encodeURIComponent(region)}&format=json`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.response?.resultNum === 0) {
      return [];
    }
    
    const libs = Array.isArray(data.response?.libs)
      ? data.response.libs.map((lib: any) => lib.lib)
      : data.response?.libs?.lib
      ? [data.response.libs.lib]
      : [];
    
    return libs;
  } catch (error) {
    console.error('도서관 소장 조회 실패:', error);
    return [];
  }
}

// 도서관별 인기 대출 도서 API
export async function getPopularBooks(
  libCode: string,
  startDt: string, // YYYY-MM-DD
  endDt: string,   // YYYY-MM-DD
  pageNo: number = 1,
  pageSize: number = 20
): Promise<{ books: PopularBook[]; totalCount: number }> {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.error('API 키가 설정되지 않았습니다.');
    return { books: [], totalCount: 0 };
  }

  try {
    const url = `${BASE_URL}/loanItemSrchByLib?authKey=${API_KEY}&libCode=${libCode}&startDt=${startDt}&endDt=${endDt}&pageNo=${pageNo}&pageSize=${pageSize}&format=json`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.response?.resultNum === 0) {
      return { books: [], totalCount: 0 };
    }
    
    const books = Array.isArray(data.response?.docs)
      ? data.response.docs.map((doc: any) => doc.doc)
      : data.response?.docs?.doc
      ? [data.response.docs.doc]
      : [];
    
    return {
      books,
      totalCount: parseInt(data.response?.resultNum || '0')
    };
  } catch (error) {
    console.error('인기 대출 도서 조회 실패:', error);
    return { books: [], totalCount: 0 };
  }
}

// 신착도서 API
export async function getNewBooks(
  libCode: string,
  ageType?: string, // 'adult' | 'child'
  pageNo: number = 1,
  pageSize: number = 20
): Promise<{ books: JeongbonarouBook[]; totalCount: number }> {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.error('API 키가 설정되지 않았습니다.');
    return { books: [], totalCount: 0 };
  }

  try {
    // data4library에는 /newBooks 엔드포인트가 없어 itemSrch 결과를 소장일 기준으로 정렬해 신착 목록으로 사용
    // ageType 파라미터는 itemSrch에서 직접 지원하지 않아 현재는 사용하지 않음
    void ageType;
    const { books, totalCount } = await getLibraryBooks(libCode, pageNo, pageSize);
    const sortedByShelvingDate = [...books].sort((a, b) => {
      const aDate = (a as any).shelving_date || '';
      const bDate = (b as any).shelving_date || '';
      return String(bDate).localeCompare(String(aDate));
    });

    return {
      books: sortedByShelvingDate,
      totalCount
    };
  } catch (error) {
    console.error('신착 도서 조회 실패:', error);
    return { books: [], totalCount: 0 };
  }
}

// 달성군 도서관 코드 목록
export const DALSEONG_LIBRARIES = [
  { code: 'LIB140001', name: '달성군립도서관' },
  { code: 'LIB140002', name: '논공도서관' },
  { code: 'LIB140003', name: '다사도서관' },
  { code: 'LIB140004', name: '유가도서관' },
  { code: 'LIB140005', name: '화원도서관' },
  { code: 'LIB140006', name: '옥포도서관' },
  { code: 'LIB140007', name: '구지도서관' },
];

// 자료실 타입
export const ROOM_TYPES = [
  { id: 'general', name: '일반자료실' },
  { id: 'child', name: '어린이자료실' },
  { id: 'reference', name: '참고자료실' },
  { id: 'digital', name: '디지털자료실' },
  { id: 'periodical', name: '연속간행물실' },
];
