import React from 'react';
import { BookOpen, Check } from 'lucide-react';
import { ROOM_TYPES } from '../services/api';

interface RoomFilterProps {
  selectedRooms: string[];
  onRoomsChange: (rooms: string[]) => void;
}

const RoomFilter: React.FC<RoomFilterProps> = ({ 
  selectedRooms, 
  onRoomsChange 
}) => {
  const handleToggleRoom = (id: string) => {
    if (selectedRooms.includes(id)) {
      onRoomsChange(selectedRooms.filter(r => r !== id));
    } else {
      onRoomsChange([...selectedRooms, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRooms.length === ROOM_TYPES.length) {
      onRoomsChange([]);
    } else {
      onRoomsChange(ROOM_TYPES.map(room => room.id));
    }
  };

  const isAllSelected = selectedRooms.length === ROOM_TYPES.length;

  return (
    <div className="border-b pb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-gray-800">자료실 선택</h2>
        </div>
        <span className="text-xs text-gray-500">
          {selectedRooms.length}/{ROOM_TYPES.length}
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

      {/* 자료실 목록 */}
      <div className="space-y-1">
        {ROOM_TYPES.map(room => {
          const isSelected = selectedRooms.includes(room.id);
          
          return (
            <button
              key={room.id}
              onClick={() => handleToggleRoom(room.id)}
              className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                isSelected 
                  ? 'bg-teal-600 border-teal-600' 
                  : 'border-gray-300 bg-white'
              }`}>
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className="text-sm text-gray-700">{room.name}</span>
            </button>
          );
        })}
      </div>
      
      {selectedRooms.length > 0 && (
        <button
          onClick={() => onRoomsChange([])}
          className="mt-3 text-xs text-teal-600 hover:text-teal-700 underline w-full text-center"
        >
          필터 초기화
        </button>
      )}
    </div>
  );
};

export default RoomFilter;