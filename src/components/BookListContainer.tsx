import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import { Book } from './types';
import { DALSEONG_LIBRARIES, getPopularBooks } from '../services/api';

interface BookListContainerProps {
  filter: 'all' | 'new' | 'popular';
  selectedLibraries: string[];
  selectedRooms: string[];
}

const BookListContainer: React.FC<BookListContainerProps> = ({
  filter,
  selectedLibraries,
  selectedRooms
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // 도서 데이터 불러오기
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let apiBooks: any[] = [];

        if (filter === 'popular') {
          // 인기도서: 최근 1개월 데이터
          const endDate = new Date();
          const startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1);

          const startDt = startDate.toISOString().slice(0, 10);
          const endDt = endDate.toISOString().slice(0, 10);

          if (selectedLibraries.length > 0) {
            const promises = selectedLibraries.map((libCode) =>
              getPopularBooks(libCode, startDt, endDt, 1, 20)
            );
            const results = await Promise.all(promises);
            apiBooks = results.flatMap((r) => r.books);
          } else {
            const result = await getPopularBooks(DALSEONG_LIBRARIES[0].code, startDt, endDt, 1, 20);
            apiBooks = result.books;
          }
        } else {
          // 전체/신착 도서: 주간 자동 업데이트되는 정적 JSON 사용
          const response = await fetch('./books.json');
          const data = await response.json();
          apiBooks = data.books || [];

          // 도서관 필터 적용
          if (selectedLibraries.length > 0) {
            const selectedLibraryNames = selectedLibraries
              .map((code) => DALSEONG_LIBRARIES.find((library) => library.code === code)?.name)
              .filter(Boolean);

            apiBooks = apiBooks.filter((book: any) =>
              selectedLibraryNames.includes(book.library)
            );
          }

          // 신착 탭일 경우 소장일 최신순 정렬
          if (filter === 'new') {
            apiBooks = [...apiBooks].sort((a: any, b: any) =>
              String(b.shelving_date || '').localeCompare(String(a.shelving_date || ''))
            );
          }
        }

        // Book 타입으로 변환
        const transformedBooks: Book[] = apiBooks.map((book: any, index: number) => ({
          id: book.no || book.isbn13 || book.registration_number || String(index),
          title: book.bookname || book.title,
          author: book.authors || book.author,
          publisher: book.publisher,
          callNumber: book.class_no || book.classNo || book.registration_number,
          acquisitionDate: book.shelving_date || new Date().toISOString().slice(0, 10).replace(/-/g, ''),
          library: book.library || '달성군립도서관',
          status: 'available',
          popularity: parseInt(book.loanCnt || '0') || Math.floor(Math.random() * 100) + 1,
          imageUrl: book.bookImageURL || book.imageUrl
        }));

        setBooks(transformedBooks);
        setLoading(false);
      } catch (err) {
        console.error('Error loading books:', err);
        setBooks([]);
        setLoading(false);
      }
    };
    fetchBooks();
  }, [filter, selectedLibraries]);

  // 필터링
  const getFilteredBooks = () => {
    let filtered = [...books];

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredBooks = getFilteredBooks();

  // 정렬
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (filter === 'popular') {
      return (b.popularity || 0) - (a.popularity || 0);
    }
    if (sortBy === 'latest') return b.acquisitionDate.localeCompare(a.acquisitionDate);
    if (sortBy === 'oldest') return a.acquisitionDate.localeCompare(b.acquisitionDate);
    return a.title.localeCompare(b.title);
  });

  // 페이지네이션
  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayBooks = sortedBooks.slice(startIndex, startIndex + itemsPerPage);

  // 탭 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm, selectedLibraries, selectedRooms]);

  if (loading) {
    return (
      <main className="flex-1">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">도서 데이터를 불러오는 중...</p>
          <p className="text-xs text-gray-400 mt-2">
            {filter === 'popular' ? '정보나루 API 연결 중' : '주간 업데이트된 books.json 로딩 중'}
          </p>
        </div>
      </main>
    );
  }

  const getTitle = () => {
    if (filter === 'new') return '신착도서 목록';
    if (filter === 'popular') return '인기 도서 목록';
    return '도서 목록';
  };

  const getSelectedLibraryNames = () => {
    if (selectedLibraries.length === 0) return '전체 도서관';
    if (selectedLibraries.length === DALSEONG_LIBRARIES.length) return '전체 도서관';
    return selectedLibraries
      .map((code) => DALSEONG_LIBRARIES.find((l) => l.code === code)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <main className="flex-1">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{getTitle()}</h2>
            {selectedLibraries.length > 0 && (
              <p className="text-sm text-teal-600 mt-1">{getSelectedLibraryNames()}</p>
            )}
            {filter === 'new' && (
              <p className="text-xs md:text-sm text-gray-600 mt-1">주간 수집 데이터 기준 최신 소장 순</p>
            )}
            {filter === 'popular' && (
              <p className="text-xs md:text-sm text-gray-600 mt-1">최근 1개월 대출 빈도 기준 (실시간 API)</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="도서 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-auto"
            />
            {filter !== 'popular' && (
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-auto"
              >
                <option value="latest">최신순</option>
                <option value="oldest">오래된순</option>
                <option value="title">제목순</option>
              </select>
            )}
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          총 <span className="font-bold text-teal-600">{sortedBooks.length}</span>권의 도서
        </div>

        {displayBooks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>검색 결과가 없습니다.</p>
            <p className="text-xs mt-2">데이터 파일이 비어있거나 API 연결 상태를 확인해 주세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayBooks.map((book, index) => (
              <BookCard key={book.id} book={book} rank={filter === 'popular' ? startIndex + index + 1 : undefined} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              &lt;
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            {totalPages > 5 && <span className="px-2">...</span>}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default BookListContainer;
