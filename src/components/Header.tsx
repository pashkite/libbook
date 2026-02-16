import React from 'react';
import { BookOpen } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center md:justify-start space-x-3">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-xl md:text-2xl font-bold">미래 도서관 - 도서 목록 조회</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;