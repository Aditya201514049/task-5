// Format date to readable string
export function formatDate(date) {
    if (!date) return '';
    
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Format rating with stars
  export function formatRating(rating) {
    if (!rating || rating === 0) return 'No ratings';
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return {
      fullStars,
      hasHalfStar,
      emptyStars,
      displayText: `${rating.toFixed(1)}/5`
    };
  }
  
  // Generate random seed
  export function generateRandomSeed() {
    return Math.floor(Math.random() * 1000000);
  }
  
  // Format number with commas
  export function formatNumber(num) {
    return num.toLocaleString();
  }
  
  // Truncate text with ellipsis
  export function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  // Get locale display name
  export function getLocaleDisplayName(locale) {
    const localeNames = {
      'en-US': 'English (USA)',
      'de-DE': 'Deutsch (Deutschland)',
      'fr-FR': 'Français (France)',
      'ja-JP': '日本語 (日本)'
    };
    return localeNames[locale] || locale;
  }
  
  // Get locale flag emoji
  export function getLocaleFlag(locale) {
    const flags = {
      'en-US': '����',
      'de-DE': '����',
      'fr-FR': '����',
      'ja-JP': '🇯🇵'
    };
    return flags[locale] || '🌐';
  }
  
  // Debounce function for search/input
  export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Calculate average rating from reviews
  export function calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  }
  
  // Format ISBN with dashes
  export function formatISBN(isbn) {
    if (!isbn) return '';
    
    // Remove any existing dashes and format as ISBN-13
    const cleanISBN = isbn.replace(/-/g, '');
    
    if (cleanISBN.length === 13) {
      return `${cleanISBN.slice(0, 3)}-${cleanISBN.slice(3, 4)}-${cleanISBN.slice(4, 9)}-${cleanISBN.slice(9, 12)}-${cleanISBN.slice(12)}`;
    }
    
    return isbn; // Return original if not 13 digits
  }
  
  // Get genre color for styling
  export function getGenreColor(genre) {
    const colors = {
      'Fiction': 'bg-blue-100 text-blue-800',
      'Non-Fiction': 'bg-green-100 text-green-800',
      'Mystery': 'bg-purple-100 text-purple-800',
      'Romance': 'bg-pink-100 text-pink-800',
      'Science Fiction': 'bg-indigo-100 text-indigo-800',
      'Fantasy': 'bg-yellow-100 text-yellow-800',
      'Biography': 'bg-gray-100 text-gray-800',
      'History': 'bg-red-100 text-red-800',
      'Self-Help': 'bg-teal-100 text-teal-800',
      'Business': 'bg-orange-100 text-orange-800'
    };
    return colors[genre] || 'bg-gray-100 text-gray-800';
  }
  
  // Validate email format
  export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Format file size
  export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  // Get time ago from date
  export function getTimeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return formatDate(date);
  }