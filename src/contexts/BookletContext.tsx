import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booklet, Page } from '../types';

interface BookletContextType {
  booklets: Booklet[];
  addBooklet: (name: string) => string;
  addPageToBooklet: (bookletId: string, image: string) => void;
  deletePage: (bookletId: string, pageId: string) => void;
  deleteBooklet: (id: string) => void;
  getBooklet: (id: string) => Booklet | undefined;
}

const BookletContext = createContext<BookletContextType | undefined>(undefined);

export const BookletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [booklets, setBooklets] = useState<Booklet[]>(() => {
    const saved = localStorage.getItem('medical_booklets');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('medical_booklets', JSON.stringify(booklets));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
      // Optional: Alert the user if the storage is full
    }
  }, [booklets]);

  const addBooklet = (name: string) => {
    const newBooklet: Booklet = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      pages: [],
    };
    setBooklets((prev) => [...prev, newBooklet]);
    return newBooklet.id;
  };

  const addPageToBooklet = (bookletId: string, image: string) => {
    setBooklets((prev) =>
      prev.map((b) => {
        if (b.id === bookletId) {
          const newPage: Page = {
            id: crypto.randomUUID(),
            image,
            order: b.pages.length,
          };
          return { ...b, pages: [...b.pages, newPage] };
        }
        return b;
      })
    );
  };

  const deletePage = (bookletId: string, pageId: string) => {
    setBooklets((prev) =>
      prev.map((b) => {
        if (b.id === bookletId) {
          return {
            ...b,
            pages: b.pages.filter((p) => p.id !== pageId).map((p, index) => ({ ...p, order: index })),
          };
        }
        return b;
      })
    );
  };

  const deleteBooklet = (id: string) => {
    setBooklets((prev) => prev.filter((b) => b.id !== id));
  };

  const getBooklet = (id: string) => {
    return booklets.find((b) => b.id === id);
  };

  return (
    <BookletContext.Provider value={{ booklets, addBooklet, addPageToBooklet, deletePage, deleteBooklet, getBooklet }}>
      {children}
    </BookletContext.Provider>
  );
};

export const useBooklets = () => {
  const context = useContext(BookletContext);
  if (!context) {
    throw new Error('useBooklets must be used within a BookletProvider');
  }
  return context;
};
