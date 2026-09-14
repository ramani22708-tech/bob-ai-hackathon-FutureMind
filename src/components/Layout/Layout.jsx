import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ activePage, onNavigate, children }) {
  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="main-area">
        <Header activePage={activePage} onNavigate={onNavigate} />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
