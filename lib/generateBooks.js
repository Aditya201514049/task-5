import { Faker, en, de, fr, ja } from '@faker-js/faker';

// Map of available locales
const localeMap = {
  'en-US': en,
  'de-DE': de,
  'fr-FR': fr,
  'ja-JP': ja,
};

// Book title templates for more realistic titles
const titleTemplates = {
  'en-US': [
    'The {adjective} {noun}',
    '{adjective} {noun} and the {noun2}',
    'When {noun} {verb}',
    'The {adjective} {noun} of {noun2}',
    '{noun} in the {adjective} {noun2}',
    'The {adjective} {noun} Chronicles',
    '{noun} and the {adjective} {noun2}',
    'The {adjective} {noun} Society',
    '{noun}: A {adjective} {noun2}',
    'The {adjective} {noun} Mystery'
  ],
  'de-DE': [
    'Der {adjective} {noun}',
    '{adjective} {noun} und der {noun2}',
    'Wenn {noun} {verb}',
    'Der {adjective} {noun} von {noun2}',
    '{noun} im {adjective} {noun2}',
    'Die {adjective} {noun} Chroniken',
    '{noun} und der {adjective} {noun2}',
    'Die {adjective} {noun} Gesellschaft',
    '{noun}: Ein {adjective} {noun2}',
    'Das {adjective} {noun} Geheimnis'
  ],
  'fr-FR': [
    'Le {adjective} {noun}',
    '{adjective} {noun} et le {noun2}',
    'Quand {noun} {verb}',
    'Le {adjective} {noun} de {noun2}',
    '{noun} dans le {adjective} {noun2}',
    'Les {adjective} {noun} Chroniques',
    '{noun} et le {adjective} {noun2}',
    'La {adjective} {noun} Société',
    '{noun}: Un {adjective} {noun2}',
    'Le {adjective} {noun} Mystère'
  ],
  'ja-JP': [
    '{adjective} {noun}',
    '{noun}と{adjective} {noun2}',
    '{noun}が{verb}時',
    '{noun2}の{adjective} {noun}',
    '{adjective} {noun2}の中の{noun}',
    '{adjective} {noun}の記録',
    '{noun}と{adjective} {noun2}',
    '{adjective} {noun}協会',
    '{noun}：{adjective} {noun2}',
    '{adjective} {noun}の謎'
  ]
};

// Generate a realistic book title
function generateTitle(faker, locale) {
  const templates = titleTemplates[locale] || titleTemplates['en-US'];
  const template = faker.helpers.arrayElement(templates);
  
  const words = {
    adjective: faker.word.adjective(),
    noun: faker.word.noun(),
    noun2: faker.word.noun(),
    verb: faker.word.verb()
  };
  
  return template.replace(/\{(\w+)\}/g, (match, key) => words[key] || match);
}

// Generate reviews with probabilistic logic
function generateReviews(faker, avgReviews) {
  const reviews = [];
  const numReviews = Math.floor(avgReviews) + (faker.number.float() < (avgReviews % 1) ? 1 : 0);
  
  for (let i = 0; i < numReviews; i++) {
    const rating = faker.number.int({ min: 1, max: 5 });
    const reviewText = faker.lorem.paragraphs(1, '\n\n');
    
    reviews.push({
      id: faker.string.uuid(),
      author: faker.person.fullName(),
      rating: rating,
      text: reviewText,
      date: faker.date.recent({ days: 365 })
    });
  }
  
  return reviews;
}

// Generate likes with probabilistic logic
function generateLikes(faker, avgLikes) {
  const baseLikes = Math.floor(avgLikes);
  const fractionalPart = avgLikes % 1;
  
  let likes = baseLikes;
  if (faker.number.float() < fractionalPart) {
    likes += 1;
  }
  
  return likes;
}

// Generate book cover URL
function generateCoverUrl(faker, title, author) {
  const colors = ['red', 'blue', 'green', 'purple', 'orange', 'yellow', 'pink', 'brown'];
  const color = faker.helpers.arrayElement(colors);
  
  // Using a more reliable placeholder service for book covers
  return `https://picsum.photos/300/400?random=${faker.number.int({ min: 1, max: 1000 })}`;
}

// Generate ISBN-13
function generateISBN(faker, bookIndex) {
  // Generate a 13-digit ISBN with deterministic approach
  const digits = [];
  
  // Use book index to ensure uniqueness
  const baseNumber = bookIndex * 1000 + faker.number.int({ min: 0, max: 999 });
  
  // Convert to string and pad with zeros
  const baseString = baseNumber.toString().padStart(12, '0');
  
  // Take first 12 digits
  for (let i = 0; i < 12; i++) {
    digits.push(parseInt(baseString[i]));
  }
  
  // Calculate check digit (ISBN-13 algorithm)
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * (i % 2 === 0 ? 1 : 3);
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  digits.push(checkDigit);
  
  // Format as ISBN-13 with hyphens
  return `${digits.slice(0, 3).join('')}-${digits.slice(3, 4).join('')}-${digits.slice(4, 9).join('')}-${digits.slice(9, 12).join('')}-${digits[12]}`;
}

export function generateBooks({ 
  seed = 42, 
  locale = 'en-US', 
  page = 1, 
  count = 20,
  avgLikes = 5,
  avgReviews = 3
}) {
  const faker = new Faker({ locale: localeMap[locale] || en });
  faker.seed(seed + page); // Ensures same seed + page gives same results

  const books = [];

  for (let i = 0; i < count; i++) {
    const bookIndex = (page - 1) * count + i + 1;
    const title = generateTitle(faker, locale);
    const author = faker.person.fullName();
    const publisher = faker.company.name();
    const isbn = generateISBN(faker, bookIndex);
    
    const likes = generateLikes(faker, avgLikes);
    const reviews = generateReviews(faker, avgReviews);
    const coverUrl = generateCoverUrl(faker, title, author);
    
    // Generate detailed information for expandable view
    const publicationDate = faker.date.past({ years: 10 });
    const pages = faker.number.int({ min: 150, max: 800 });
    const genre = faker.helpers.arrayElement([
      'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 
      'Fantasy', 'Biography', 'History', 'Self-Help', 'Business'
    ]);
    
    const description = faker.lorem.paragraphs(2, '\n\n');
    
    books.push({
      id: faker.string.uuid(),
      index: bookIndex,
      isbn: isbn,
      title: title,
      author: author,
      publisher: publisher,
      publicationDate: publicationDate,
      pages: pages,
      genre: genre,
      description: description,
      coverUrl: coverUrl,
      likes: likes,
      reviews: reviews,
      rating: reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0
    });
  }

  return books;
}