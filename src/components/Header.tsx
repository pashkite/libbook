import React from 'react';
import { BookOpen, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-2xl font-bold">미래 도서관</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="hover:text-teal-200 transition">도서 관리</a>
            <a href="#" className="border-b-2 border-white font-semibold">실물 도서</a>
            <a href="#" className="hover:text-teal-200 transition">주민 도서</a>
            <a href="#" className="hover:text-teal-200 transition">이용 안내</a>
            <a href="#" className="hover:text-teal-200 transition">나의 도서관</a>
            <button className="hover:text-teal-200 transition">
              <User className="w-6 h-6" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;