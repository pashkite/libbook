import React, { useState } from 'react';
import { BookOpen, User, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-xl md:text-2xl font-bold">미래 도서관</h1>
          </div>
          
          {/* Desktop Navigation */}
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

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3">
            <a href="#" className="block hover:text-teal-200 transition py-2">도서 관리</a>
            <a href="#" className="block border-l-4 border-white pl-3 font-semibold py-2">실물 도서</a>
            <a href="#" className="block hover:text-teal-200 transition py-2">주민 도서</a>
            <a href="#" className="block hover:text-teal-200 transition py-2">이용 안내</a>
            <a href="#" className="block hover:text-teal-200 transition py-2">나의 도서관</a>
            <button className="flex items-center space-x-2 hover:text-teal-200 transition py-2">
              <User className="w-5 h-5" />
              <span>내 정보</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;