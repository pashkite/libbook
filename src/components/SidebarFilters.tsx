import React from 'react';
import KDCFilterTree from './KDCFilterTree';
import DateRangeFilter from './DateRangeFilter';

const SidebarFilters: React.FC = () => {
  return (
    <aside className="w-full lg:w-64 bg-white rounded-lg shadow-md p-4 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-lg font-bold text-gray-800">KDC 분류 탐색</h2>
      </div>
      
      <KDCFilterTree />
      
      <div className="border-t pt-4">
        <h3 className="text-md font-semibold text-gray-700 mb-3">소장 기간 설정</h3>
        <DateRangeFilter />
      </div>
    </aside>
  );
};

export default SidebarFilters;