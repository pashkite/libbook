import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import { Book } from './types';

const BookListContainer: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // 기존 books.json 데이터 로드
    fetch('/books.json')
      .then(res => res.json())
      .then(data => {
        // 기존 데이터를 Book 타입으로 변환
        const transformedBooks: Book[] = data.books.map((book: any, index: number) => ({
          id: book.registration_number || String(index),
          title: book.title,
          author: book.author,
          publisher: book.publisher,
          callNumber: book.registration_number,
          acquisitionDate: book.shelving_date,
          status: Math.random() > 0.7 ? 'checked_out' : 'available',
          dueDate: Math.random() > 0.7 ? '2026-02-20' : undefined
        }));
        setBooks(transformedBooks);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading books:', err);
        setLoading(false);
      });
  }, []);

  // 검색 및 정렬
  const filteredBooks = books
    .filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'latest') return b.acquisitionDate.localeCompare(a.acquisitionDate);
      if (sortBy === 'oldest') return a.acquisitionDate.localeCompare(b.acquisitionDate);
      return a.title.localeCompare(b.title);
    });

  // 페이지네이션
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <main className="flex-1">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">데이터를 불러오는 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">전체 도서 목록 조회</h2>
          
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="도서 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
              <option value="title">제목순</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                    currentPage === page
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            {totalPages > 5 && <span className="px-2">...</span>}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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