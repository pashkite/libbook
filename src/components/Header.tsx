import React from 'react';
import { BookOpen } from 'lucide-react';

interface HeaderProps {
  currentTab: 'all' | 'new' | 'popular';
  onTabChange: (tab: 'all' | 'new' | 'popular') => void;
}

const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange }) => {
  return (
    <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col space-y-4">
          {/* Title */}
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-xl md:text-2xl font-bold">미래 도서관</h1>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <button
              onClick={() => onTabChange('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                currentTab === 'all'
                  ? 'bg-white text-teal-700 shadow-md'
                  : 'bg-teal-500 hover:bg-teal-400 text-white'
              }`}
            >
              도서 목록 조회
            </button>
            <button
              onClick={() => onTabChange('new')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                currentTab === 'new'
                  ? 'bg-white text-teal-700 shadow-md'
                  : 'bg-teal-500 hover:bg-teal-400 text-white'
              }`}
            >
              신착도서 목록 조회
            </button>
            <button
              onClick={() => onTabChange('popular')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                currentTab === 'popular'
                  ? 'bg-white text-teal-700 shadow-md'
                  : 'bg-teal-500 hover:bg-teal-400 text-white'
              }`}
            >
              인기 도서 목록 조회
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;