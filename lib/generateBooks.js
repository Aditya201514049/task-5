import { Faker, en, de, fr, ja } from '@faker-js/faker';

// Map of available locales
const localeMap = {
  'en-US': en,
  'de-DE': de,
  'fr-FR': fr,
  'ja-JP': ja,
};

export function generateBooks({ seed = 42, locale = 'en-US', page = 1, count = 20 }) {
  const faker = new Faker({ locale: localeMap[locale] || en });
  faker.seed(seed + page); // Ensures same seed + page gives same results

  const books = [];

  for (let i = 0; i < count; i++) {
    books.push({
      index: (page - 1) * count + i + 1,
      isbn: faker.string.uuid(),
      title: faker.lorem.words(3),
      author: faker.person.fullName(),
      publisher: faker.company.name(),
    });
  }

  return books;
}
