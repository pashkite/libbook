import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface KDCCategory {
  id: string;
  code: string;
  name: string;
  children?: KDCCategory[];
}

const kdcData: KDCCategory[] = [
  {
    id: '000',
    code: '000',
    name: '총류',
    children: [
      { id: '100', code: '100', name: '철학' },
      { id: '200', code: '200', name: '실도·경학' }
    ]
  },
  {
    id: '300',
    code: '300',
    name: '철학',
    children: []
  },
  {
    id: '400',
    code: '400',
    name: '종교',
    children: []
  },
  {
    id: '500',
    code: '500',
    name: '문학',
    children: []
  },
  {
    id: '600',
    code: '600',
    name: '세계사회',
    children: []
  },
  {
    id: '700',
    code: '700',
    name: '문학',
    children: []
  },
  {
    id: '800',
    code: '800',
    name: '문학',
    children: [
      { id: '810', code: '810', name: '한국문학' },
      { id: '820', code: '820', name: '중국문학' },
      { id: '830', code: '830', name: '한국문학' },
      { id: '840', code: '840', name: '중국문학' }
    ]
  },
  {
    id: '900',
    code: '900',
    name: '역사',
    children: []
  }
];

interface CategoryItemProps {
  category: KDCCategory;
  level: number;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, level }) => {
  const [isOpen, setIsOpen] = useState(level === 0);

  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className={`${level > 0 ? 'ml-4' : ''}`}>
      <button
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded transition text-left"
      >
        <span className="text-sm text-gray-700">
          {category.code} {category.name}
        </span>
        {hasChildren && (
          isOpen ? 
            <ChevronDown className="w-4 h-4 text-gray-500" /> : 
            <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>
      
      {hasChildren && isOpen && (
        <div className="mt-1">
          {category.children!.map(child => (
            <CategoryItem key={child.id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const KDCFilterTree: React.FC = () => {
  return (
    <div className="space-y-1">
      {kdcData.map(category => (
        <CategoryItem key={category.id} category={category} level={0} />
      ))}
    </div>
  );
};

export default KDCFilterTree;