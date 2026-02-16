import React from 'react';
import LibraryLayout from './components/LibraryLayout';
import SidebarFilters from './components/SidebarFilters';
import BookListContainer from './components/BookListContainer';

const App: React.FC = () => {
  return (
    <LibraryLayout>
      <div className="flex flex-col lg:flex-row gap-6">
        <SidebarFilters />
        <BookListContainer />
      </div>
    </LibraryLayout>
  );
};

export default App;