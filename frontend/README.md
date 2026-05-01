# Blog Frontend

A modern, responsive blog frontend built with React, TypeScript, and Tailwind CSS v4.

## Features

- 🎨 Beautiful UI with Tailwind CSS v4 and OKLCH colors
- ⚡ Fast and optimized with Vite
- 📱 Fully responsive design
- ♿ Accessible components (WCAG AA compliant)
- 🔄 Reusable component architecture
- 🎯 Type-safe with TypeScript
- 🚀 Scalable folder structure

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Card.tsx
│   │   ├── home/            # Home page components
│   │   │   ├── Hero.tsx
│   │   │   ├── FeaturedPosts.tsx
│   │   │   ├── PostCard.tsx
│   │   │   ├── Categories.tsx
│   │   │   └── Newsletter.tsx
│   │   └── layout/          # Layout components
│   │       ├── Layout.tsx
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── pages/               # Page components
│   │   └── Home.tsx
│   ├── services/            # API services
│   │   ├── postService.ts
│   │   └── categoryService.ts
│   ├── config/              # Configuration files
│   │   └── api.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env
├── .env.example
└── package.json
```

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

```bash
npm run build
```

## Component Guidelines

### Common Components

Reusable UI components that can be used throughout the app:

- **Button**: Primary, secondary, and ghost variants with loading states
- **Badge**: Color-coded labels for categories and tags
- **Card**: Container component with optional hover effects

### Layout Components

- **Layout**: Main layout wrapper with header and footer
- **Header**: Fixed navigation bar with logo and menu
- **Footer**: Site footer with links and information

### Home Components

Page-specific components for the home page:

- **Hero**: Landing section with CTA buttons
- **FeaturedPosts**: Grid of featured blog posts
- **PostCard**: Individual post card with image, title, and metadata
- **Categories**: Category grid for topic exploration
- **Newsletter**: Email subscription form

## Design System

The project follows a comprehensive design system based on OKLCH color space:

- **Primary Color**: Red (`oklch(63.7% 0.237 25.331)`)
- **Neutral Colors**: Slate palette
- **Semantic Colors**: Success, Warning, Error, Info

See `DESIGN.md` for complete design specifications.

## API Integration

API calls are centralized in the `services/` directory:

- Axios instance with interceptors
- Automatic token management
- Error handling
- Type-safe responses

## TypeScript Types

All API responses and data structures are typed in `types/index.ts`:

- User
- Post
- Category
- Tag
- Comment
- API responses

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Color contrast compliance (WCAG AA)

## Performance

- Code splitting with React Router
- Lazy loading for images
- Optimized bundle size
- Fast refresh in development

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing folder structure
2. Use TypeScript for all new files
3. Follow the design system guidelines
4. Ensure accessibility standards
5. Write reusable components

## License

MIT
