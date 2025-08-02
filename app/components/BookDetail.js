
'use client';

import { formatDate, formatISBN, getGenreColor, formatRating } from '@/lib/utils';

export default function BookDetail({ book, onClose }) {
  if (!book) return null;

  const rating = formatRating(book.rating);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold z-10 bg-white dark:bg-gray-900 rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
          aria-label="Close"
        >
          ×
        </button>

        <div className="p-6 pt-12">
          {/* Book Cover and Title */}
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              className="w-40 h-56 object-cover rounded-lg shadow-md mx-auto md:mx-0"
            />
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{book.title}</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">by {book.author}</p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGenreColor(book.genre)}`}>
                  {book.genre}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{book.pages} pages</span>
              </div>
              <div className="space-y-1 text-sm mt-2">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Publisher:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{book.publisher}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Published:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{formatDate(book.publicationDate)}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">ISBN:</span>
                  <span className="ml-2 text-gray-900 dark:text-white font-mono">{formatISBN(book.isbn)}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Rating:</span>
                  <span className="ml-2 text-yellow-500">{rating.displayText}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Likes:</span>
                  <span className="ml-2 text-red-500">{book.likes} ❤</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Reviews:</span>
                  <span className="ml-2 text-blue-500">{book.reviews.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-300">{book.description}</p>
          </div>

          {/* Reviews */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Reviews ({book.reviews.length})
            </h3>
            <div className="space-y-4 max-h-48 overflow-y-auto">
              {book.reviews.length > 0 ? (
                book.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 dark:bg-gray-800 rounded p-3 shadow">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">{review.author}</span>
                      <span className="text-yellow-500">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{review.text}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatDate(review.date)}</p>
                  </div>
                ))
              ) : (
                <p className="italic text-gray-500 dark:text-gray-400">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


