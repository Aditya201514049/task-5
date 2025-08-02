'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import BookRow from './BookRow';
import BookDetail from './BookDetail';

export default function BookTable({ parameters }) {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const observer = useRef();

  // Fetch books from API
  const fetchBooks = useCallback(async (reset = false) => {
    setLoading(true);
    const params = new URLSearchParams({
      seed: parameters.seed,
      locale: parameters.locale,
      page: reset ? 1 : page,
      count: 20,
      avgLikes: parameters.avgLikes,
      avgReviews: parameters.avgReviews,
    });
    const res = await fetch(`/api/books?${params.toString()}`);
    const data = await res.json();

    if (reset) {
      setBooks(data.books);
      setPage(2);
    } else {
      setBooks((prev) => [...prev, ...data.books]);
      setPage((prev) => prev + 1);
    }
    setHasMore(data.books.length === 20);
    setLoading(false);
  }, [parameters, page]);

  // Reset table when parameters change
  useEffect(() => {
    setBooks([]);
    setPage(1);
    setHasMore(true);
    setExpandedIndex(null);
    fetchBooks(true);
    // eslint-disable-next-line
  }, [parameters]);

  // Infinite scroll observer
  const lastRowRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchBooks();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchBooks]
  );

  // Handle row expand/collapse
  const handleToggleExpand = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
      setSelectedBook(null);
    } else {
      setExpandedIndex(index);
      setSelectedBook(books.find((b) => b.index === index));
    }
  };

  // Handle modal close
  const handleCloseDetail = () => {
    setExpandedIndex(null);
    setSelectedBook(null);
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">#</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ISBN</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Title & Author</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Publisher</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Rating</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Likes</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Reviews</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, idx) => (
            <BookRow
              key={`${book.isbn}-${book.index}`}
              book={book}
              isExpanded={expandedIndex === book.index}
              onToggleExpand={handleToggleExpand}
            />
          ))}
        </tbody>
      </table>
      {/* Infinite scroll trigger */}
      <div ref={lastRowRef} className="h-8"></div>
      {loading && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">Loading...</div>
      )}
      {!hasMore && !loading && (
        <div className="text-center py-4 text-gray-400 dark:text-gray-500">No more books to load.</div>
      )}
      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetail book={selectedBook} onClose={handleCloseDetail} />
      )}
    </div>
  );
}