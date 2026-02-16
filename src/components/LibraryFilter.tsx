import React from 'react';
import { Building2 } from 'lucide-react';

interface LibraryFilterProps {
  selectedLibrary: string;
  onLibraryChange: (library: string) => void;
}

const libraries = [
  { id: 'all', name: '전체 도서관' },
  { id: '국채보상운동기념도서관', name: '국채보상운동기념도서관' },
  { id: '대구광역시립동부도서관', name: '동부도서관' },
  { id: '대구광역시립 남부도서관', name: '남부도서관' },
  { id: '대구광역시립서부도서관', name: '서부도서관' },
  { id: '대구광역시립중앙도서관', name: '중앙도서관' },
  { id: '달성군립도서관', name: '달성군립도서관' },
  { id: '다사도서관', name: '다사도서관' },
  { id: '논공도서관', name: '논공도서관' },
  { id: '유가도서관', name: '유가도서관' },
  { id: '화원도서관', name: '화원도서관' },
  { id: '옥포도서관', name: '옥포도서관' },
  { id: '구지도서관', name: '구지도서관' },
];

const LibraryFilter: React.FC<LibraryFilterProps> = ({ selectedLibrary, onLibraryChange }) => {
  return (
    <div className="border-b pb-4">
      <div className="flex items-center space-x-2 mb-3">
        <Building2 className="w-5 h-5 text-teal-600" />
        <h2 className="text-lg font-bold text-gray-800">도서관 선택</h2>
      </div>
      
      <select
        value={selectedLibrary}
        onChange={(e) => onLibraryChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
      >
        {libraries.map(lib => (
          <option key={lib.id} value={lib.id}>
            {lib.name}
          </option>
        ))}
      </select>
      
      {selectedLibrary !== 'all' && (
        <button
          onClick={() => onLibraryChange('all')}
          className="mt-2 text-xs text-teal-600 hover:text-teal-700 underline"
        >
          필터 초기화
        </button>
      )}
    </div>
  );
};

export default LibraryFilter;