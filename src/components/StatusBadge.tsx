import React from 'react';

interface StatusBadgeProps {
  status: 'available' | 'checked_out';
  dueDate?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, dueDate }) => {
  if (status === 'available') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
        ● 대출 가능
      </span>
    );
  }

  return (
    <div>
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 mb-1">
        ● 대출 중
      </span>
      {dueDate && (
        <p className="text-xs text-gray-500">반납예정일: {dueDate}</p>
      )}
    </div>
  );
};

export default StatusBadge;