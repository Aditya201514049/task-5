'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { formatDate, formatRating, formatISBN, getGenreColor, calculateAverageRating } from '@/lib/utils';

export default function BookGallery({ parameters }) {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
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

  // Reset gallery when parameters change
  useEffect(() => {
    setBooks([]);
    setPage(1);
    setHasMore(true);
    setSelectedBook(null);
    fetchBooks(true);
    // eslint-disable-next-line
  }, [parameters]);

  // Infinite scroll observer
  const lastCardRef = useCallback(
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

  // Handle book selection
  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  // Handle modal close
  const handleCloseDetail = () => {
    setSelectedBook(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {books.map((book, idx) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => handleBookClick(book)}
            ref={idx === books.length - 1 ? lastCardRef : null}
          />
        ))}
      </div>

      {/* Loading and End States */}
      {loading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <p className="mt-2">Loading more books...</p>
        </div>
      )}
      
      {!hasMore && !loading && books.length > 0 && (
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          No more books to load.
        </div>
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetailModal book={selectedBook} onClose={handleCloseDetail} />
      )}
    </div>
  );
}

// Book Card Component
const BookCard = React.forwardRef(({ book, onClick }, ref) => {
  const [imageError, setImageError] = useState(false);
  const rating = formatRating(book.rating);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className="bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 border border-gray-200 dark:border-gray-600 overflow-hidden"
    >
      {/* Book Cover */}
      <div className="relative">
        <img
          src={imageError ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJvb2sgQ292ZXI8L3RleHQ+PC9zdmc+' : book.coverUrl}
          alt={`Cover of ${book.title}`}
          className="w-full h-64 object-cover"
          onError={() => setImageError(true)}
        />
        
        {/* Genre Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGenreColor(book.genre)}`}>
            {book.genre}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
          {rating.displayText}
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-xs mb-2">
          by {book.author}
        </p>
        
        {/* Rating Stars */}
        <div className="flex items-center space-x-1 mb-2">
          {rating.fullStars > 0 && (
            <>
              {[...Array(rating.fullStars)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xs">★</span>
              ))}
              {rating.hasHalfStar && (
                <span className="text-yellow-400 text-xs">☆</span>
              )}
              {[...Array(rating.emptyStars)].map((_, i) => (
                <span key={i} className="text-gray-300 dark:text-gray-600 text-xs">☆</span>
              ))}
            </>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <span className="text-red-500">❤</span>
            <span>{book.likes}</span>
          </div>
          <div>
            {book.reviews.length} reviews
          </div>
        </div>

        {/* Publisher */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">
          {book.publisher}
        </p>
      </div>
    </div>
  );
});

BookCard.displayName = 'BookCard';

// Book Detail Modal Component
function BookDetailModal({ book, onClose }) {
  const [imageError, setImageError] = useState(false);
  const rating = formatRating(book.rating);
  const averageRating = calculateAverageRating(book.reviews);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold z-10"
          aria-label="Close"
        >
          ×
        </button>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Book Cover and Basic Info */}
            <div className="lg:col-span-1">
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={imageError ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJvb2sgQ292ZXI8L3RleHQ+PC9zdmc+' : book.coverUrl}
                  alt={`Cover of ${book.title}`}
                  className="w-48 h-64 object-cover rounded-lg shadow-lg"
                  onError={() => setImageError(true)}
                />
                
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    by {book.author}
                  </p>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGenreColor(book.genre)}`}>
                      {book.genre}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {book.pages} pages
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Details */}
            <div className="lg:col-span-1 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Book Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Publisher:</span>
                    <span className="text-gray-900 dark:text-white">{book.publisher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Published:</span>
                    <span className="text-gray-900 dark:text-white">{formatDate(book.publicationDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">ISBN:</span>
                    <span className="text-gray-900 dark:text-white font-mono">{formatISBN(book.isbn)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Rating:</span>
                    <span className="text-gray-900 dark:text-white">{averageRating.toFixed(1)}/5</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {book.description}
                </p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="lg:col-span-1">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Reviews ({book.reviews.length})
              </h4>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {book.reviews.length > 0 ? (
                  book.reviews.map((review) => (
                    <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {review.author}
                        </span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              className={`text-xs ${i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {review.text}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {formatDate(review.date)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No reviews yet
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
} 