import React from 'react';
import { Building2, Check } from 'lucide-react';
import { DALSEONG_LIBRARIES } from '../services/api';

interface MultiLibraryFilterProps {
  selectedLibraries: string[];
  onLibrariesChange: (libraries: string[]) => void;
}

const MultiLibraryFilter: React.FC<MultiLibraryFilterProps> = ({ 
  selectedLibraries, 
  onLibrariesChange 
}) => {
  const handleToggleLibrary = (code: string) => {
    if (selectedLibraries.includes(code)) {
      onLibrariesChange(selectedLibraries.filter(c => c !== code));
    } else {
      onLibrariesChange([...selectedLibraries, code]);
    }
  };

  const handleSelectAll = () => {
    if (selectedLibraries.length === DALSEONG_LIBRARIES.length) {
      onLibrariesChange([]);
    } else {
      onLibrariesChange(DALSEONG_LIBRARIES.map(lib => lib.code));
    }
  };

  const isAllSelected = selectedLibraries.length === DALSEONG_LIBRARIES.length;

  return (
    <div className="border-b pb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-gray-800">도서관 선택</h2>
        </div>
        <span className="text-xs text-gray-500">
          {selectedLibraries.length}/{DALSEONG_LIBRARIES.length}
        </span>
      </div>
      
      {/* 전체 선택 */}
      <button
        onClick={handleSelectAll}
        className="w-full flex items-center space-x-2 p-2 mb-2 rounded-md hover:bg-gray-50 transition-colors"
      >
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
          isAllSelected 
            ? 'bg-teal-600 border-teal-600' 
            : 'border-gray-300 bg-white'
        }`}>
          {isAllSelected && <Check className="w-4 h-4 text-white" />}
        </div>
        <span className="text-sm font-semibold text-gray-700">전체 선택</span>
      </button>

      {/* 도서관 목록 */}
      <div className="space-y-1 max-h-80 overflow-y-auto">
        {DALSEONG_LIBRARIES.map(library => {
          const isSelected = selectedLibraries.includes(library.code);
          
          return (
            <button
              key={library.code}
              onClick={() => handleToggleLibrary(library.code)}
              className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                isSelected 
                  ? 'bg-teal-600 border-teal-600' 
                  : 'border-gray-300 bg-white'
              }`}>
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className="text-sm text-gray-700">{library.name}</span>
            </button>
          );
        })}
      </div>
      
      {selectedLibraries.length > 0 && (
        <button
          onClick={() => onLibrariesChange([])
          className="mt-3 text-xs text-teal-600 hover:text-teal-700 underline w-full text-center"
        >
          필터 초기화
        </button>
      )}
    </div>
  );
};

export default MultiLibraryFilter;