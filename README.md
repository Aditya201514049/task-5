# 📚 Book Store Data Generator

A modern web application built with Next.js that generates realistic mock book data using Faker.js. The application provides both table and gallery views with infinite scrolling, customizable parameters, and multi-language support.

## ✨ Features

### 🎛️ Data Generation Controls
- **Seed Value**: Set a specific seed for reproducible data generation
- **Random Seed**: Generate random seed values with a single click
- **Language/Region Support**: Generate books in multiple languages
  - 🇺🇸 English (USA)
  - 🇩🇪 Deutsch (Deutschland) 
  - 🇫🇷 Français (France)
  - 🇯🇵 日本語 (日本)
- **Average Likes**: Control the average number of likes per book (0-10)
- **Average Reviews**: Control the average number of reviews per book (0-10)

### 📊 Dual View Modes
- **📋 Table View**: Traditional table layout with expandable rows
- **🖼️ Gallery View**: Card-based grid layout for visual browsing

### 🔄 Advanced Functionality
- **Infinite Scrolling**: Load more books automatically as you scroll
- **Real-time Updates**: Data refreshes automatically when parameters change
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatic theme switching based on system preferences
- **Modal Details**: Click any book to view detailed information in a modal

### 📖 Generated Book Data
Each book includes:
- **ISBN-13**: Valid ISBN with proper check digit calculation
- **Title**: Realistic book titles using template-based generation
- **Author**: Full author names
- **Publisher**: Company names
- **Publication Date**: Recent dates within the last 10 years
- **Pages**: Realistic page counts (50-800 pages)
- **Genre**: Book genres with color coding
- **Description**: Lorem ipsum descriptions
- **Cover Image**: Placeholder images with fallback SVG
- **Likes**: User likes with probabilistic distribution
- **Reviews**: User reviews with ratings (1-5 stars) and text
- **Average Rating**: Calculated from review ratings

## 🛠️ Technology Stack

- **Framework**: Next.js 15.4.5 (App Router)
- **Frontend**: React 19.1.0
- **Styling**: Tailwind CSS 4.0
- **Data Generation**: Faker.js 9.9.0
- **Deployment**: Vercel (optimized)

## 🏗️ Project Structure

```
├── app/
│   ├── api/
│   │   └── books/
│   │       └── route.js          # API endpoint for book data
│   ├── components/
│   │   ├── BookDetail.js         # Modal for detailed book view
│   │   ├── BookGallery.js        # Gallery view component
│   │   ├── BookRow.js            # Individual table row
│   │   ├── BookTable.js          # Table view component
│   │   └── ControlPanel.js       # Parameter controls
│   ├── globals.css               # Global styles and custom components
│   ├── layout.js                 # Root layout with metadata
│   └── page.js                   # Main page component
├── lib/
│   ├── generateBooks.js          # Core data generation logic
│   └── utils.js                  # Utility functions
├── public/                       # Static assets
└── package.json                  # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-5
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📡 API Endpoints

### GET `/api/books`
Generates book data based on query parameters.

**Query Parameters:**
- `seed` (number): Seed value for reproducible data (default: 42)
- `locale` (string): Language/region code (default: 'en-US')
- `page` (number): Page number for pagination (default: 1)
- `count` (number): Number of books per page (default: 20, max: 100)
- `avgLikes` (number): Average likes per book (default: 5, range: 0-10)
- `avgReviews` (number): Average reviews per book (default: 3, range: 0-10)

**Response:**
```json
{
  "books": [...],
  "pagination": {
    "page": 1,
    "count": 20,
    "hasMore": true,
    "totalGenerated": 20
  },
  "parameters": {
    "seed": 42,
    "locale": "en-US",
    "avgLikes": 5,
    "avgReviews": 3
  }
}
```

## 🎨 Key Components

### ControlPanel
Manages all user input parameters with a responsive layout:
- Two-row grid layout to prevent control collisions
- Real-time parameter updates
- Enter key support for seed input
- View mode toggle (Table/Gallery)

### BookTable
Displays books in a traditional table format:
- Infinite scrolling with Intersection Observer
- Expandable rows for detailed information
- Responsive design with horizontal scrolling
- Loading states and error handling

### BookGallery
Card-based visual display:
- Responsive grid layout (1-5 columns based on screen size)
- Infinite scrolling
- Click to view detailed modal
- Image error handling with SVG fallbacks

### Data Generation
The `generateBooks.js` module provides:
- Deterministic ISBN-13 generation with check digit validation
- Template-based title generation for realistic book names
- Probabilistic distribution for likes and reviews
- Multi-language support with locale-specific content
- Unique ID generation to prevent React key conflicts

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Customization

### Adding New Languages
1. Add locale to `localeMap` in `lib/generateBooks.js`
2. Add title templates for the new language
3. Update locale options in `ControlPanel.js`
4. Add display name and flag in `lib/utils.js`

### Modifying Data Generation
- Edit `lib/generateBooks.js` to change data generation logic
- Modify templates in `titleTemplates` for different title patterns
- Adjust probability distributions in `generateLikes` and `generateReviews`

### Styling Changes
- Custom Tailwind classes in component files
- Global styles in `app/globals.css`
- Custom slider styles for range inputs

## 🐛 Troubleshooting

### Common Issues
1. **Duplicate React Keys**: Ensure each book has a unique `id` field
2. **Image Loading Errors**: Fallback SVG images are provided
3. **Performance**: Infinite scrolling is optimized with Intersection Observer
4. **Mobile Responsiveness**: All components are mobile-first responsive

### Development Tips
- Use `npm run dev` with Turbopack for faster development
- Check browser console for any React warnings
- Test on different screen sizes for responsive design

## 📄 License

This project is licensed under the Aditya Singha.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ using Next.js and Faker.js**
