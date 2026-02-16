import React from 'react';

interface LibraryLayoutProps {
  children: React.ReactNode;
}

const LibraryLayout: React.FC<LibraryLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      {children}
    </div>
  );
};

export default LibraryLayout;