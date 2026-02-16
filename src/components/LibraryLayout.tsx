import React from 'react';
import Header from './Header';

interface LibraryLayoutProps {
  children: React.ReactNode;
}

const LibraryLayout: React.FC<LibraryLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
};

export default LibraryLayout;