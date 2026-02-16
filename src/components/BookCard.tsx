import React from 'react';
import StatusBadge from './StatusBadge';
import { Book } from './types';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.length < 8) return dateStr;
    return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-24 h-32 bg-gradient-to-br from-teal-400 to-teal-600 rounded flex-shrink-0 flex items-center justify-center overflow-hidden mx-auto sm:mx-0">
          {book.coverImage ? (
            <img 
              src={book.coverImage} 
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-xs text-center px-2">{book.title.substring(0, 10)}</span>
          )}
        </div>
        
        <div className="flex-1 flex flex-col justify-between space-y-2">
          <div>
            <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 text-sm sm:text-base">{book.title}</h3>
            <p className="text-sm text-gray-600 mb-1">{book.author}</p>
            <p className="text-xs text-gray-500">{book.publisher}</p>
            <p className="text-xs text-gray-500">{book.callNumber}</p>
            <p className="text-xs text-gray-500">소장일: {formatDate(book.acquisitionDate)}</p>
          </div>
          
          <div className="mt-2">
            <StatusBadge status={book.status} dueDate={book.dueDate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;