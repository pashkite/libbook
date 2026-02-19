// 정보나루(도서관 정보나루) API 서비스

const API_KEY = import.meta.env.VITE_JEONGBONAROU_API_KEY;
const BASE_URL = 'https://www.data4library.kr/api';

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

// 도서 검색 API
export async function searchBooks(
  keyword: string,
  pageNo: number = 1,
  pageSize: number = 20
): Promise<{ books: JeongbonarouBook[]; totalCount: number }> {
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
  try {
    let url = `${BASE_URL}/newBooks?authKey=${API_KEY}&libCode=${libCode}&pageNo=${pageNo}&pageSize=${pageSize}&format=json`;
    
    if (ageType) {
      url += `&ageType=${ageType}`;
    }
    
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
