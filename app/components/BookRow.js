'use client';

import { useState } from 'react';
import { formatDate, formatRating, formatISBN, getGenreColor, calculateAverageRating } from '@/lib/utils';

export default function BookRow({ book, isExpanded, onToggleExpand }) {
  const [imageError, setImageError] = useState(false);

  const rating = formatRating(book.rating);
  const averageRating = calculateAverageRating(book.reviews);

  return (
    <>
      {/* Main Row */}
      <tr 
        className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer ${
          isExpanded ? 'bg-blue-50 dark:bg-blue-900/20' : ''
        }`}
        onClick={() => onToggleExpand(book.index)}
      >
        {/* Index */}
        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
          {book.index}
        </td>

        {/* ISBN */}
        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">
          {formatISBN(book.isbn)}
        </td>

        {/* Title */}
        <td className="px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <img
                src={imageError ? '/placeholder-book.png' : book.coverUrl}
                alt={`Cover of ${book.title}`}
                className="w-12 h-16 object-cover rounded shadow-sm"
                onError={() => setImageError(true)}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {book.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                by {book.author}
              </p>
            </div>
          </div>
        </td>

        {/* Publisher */}
        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
          {book.publisher}
        </td>

        {/* Rating */}
        <td className="px-4 py-3 text-sm">
          <div className="flex items-center space-x-1">
            {rating.fullStars > 0 && (
              <>
                {[...Array(rating.fullStars)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
                {rating.hasHalfStar && (
                  <span className="text-yellow-400">☆</span>
                )}
                {[...Array(rating.emptyStars)].map((_, i) => (
                  <span key={i} className="text-gray-300 dark:text-gray-600">☆</span>
                ))}
              </>
            )}
            <span className="text-gray-500 dark:text-gray-400 ml-1">
              {rating.displayText}
            </span>
          </div>
        </td>

        {/* Likes */}
        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
          <div className="flex items-center space-x-1">
            <span className="text-red-500">❤</span>
            <span>{book.likes}</span>
          </div>
        </td>

        {/* Reviews Count */}
        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
          {book.reviews.length} reviews
        </td>

        {/* Expand/Collapse Icon */}
        <td className="px-4 py-3 text-sm">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(book.index);
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </td>
      </tr>

      {/* Expanded Details Row */}
      {isExpanded && (
        <tr className="bg-blue-50 dark:bg-blue-900/20">
          <td colSpan="7" className="px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Book Cover and Basic Info */}
              <div className="lg:col-span-1">
                <div className="flex flex-col items-center space-y-4">
                  <img
                    src={imageError ? '/placeholder-book.png' : book.coverUrl}
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
                    book.reviews.map((review, index) => (
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
          </td>
        </tr>
      )}
    </>
  );
}