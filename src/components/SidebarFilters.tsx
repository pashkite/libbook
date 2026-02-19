import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import KDCFilterTree from './KDCFilterTree';
import DateRangeFilter from './DateRangeFilter';
import MultiLibraryFilter from './MultiLibraryFilter';
import RoomFilter from './RoomFilter';

interface SidebarFiltersProps {
  selectedLibraries: string[];
  onLibrariesChange: (libraries: string[]) => void;
  selectedRooms: string[];
  onRoomsChange: (rooms: string[]) => void;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({ 
  selectedLibraries, 
  onLibrariesChange,
  selectedRooms,
  onRoomsChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile: Collapsible Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
        >
          <span className="font-bold text-gray-800">필터 및 검색 옵션</span>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Content */}
      <aside className={`
        w-full lg:w-64 bg-white rounded-lg shadow-md p-4 space-y-6
        ${isOpen ? 'block' : 'hidden lg:block'}
      `}>
        <MultiLibraryFilter 
          selectedLibraries={selectedLibraries} 
          onLibrariesChange={onLibrariesChange} 
        />
        
        <RoomFilter 
          selectedRooms={selectedRooms}
          onRoomsChange={onRoomsChange}
        />
        
        <div className="border-t pt-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">KDC 분류 탐색</h2>
          <KDCFilterTree />
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-md font-semibold text-gray-700 mb-3">소장 기간 설정</h3>
          <DateRangeFilter />
        </div>
      </aside>
    </>
  );
};

export default SidebarFilters;