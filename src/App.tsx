import React, { useState } from 'react';
import Header from './components/Header';
import SidebarFilters from './components/SidebarFilters';
import BookListContainer from './components/BookListContainer';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'all' | 'new' | 'popular'>('all');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      <Header currentTab={currentTab} onTabChange={setCurrentTab} />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <SidebarFilters />
          <BookListContainer filter={currentTab} />
        </div>
      </div>
    </div>
  );
};

export default App;