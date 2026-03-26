# Pamir Academy - React Application

This is the React + Vite version of the Pamir Academy platform, converted from the vanilla HTML/JavaScript version.

## Features

- **Home Page**: Image slider, statistics counters, student/teacher/team profile sliders
- **Learn More Page**: FAQ section with expandable details
- **Products Page**: Product gallery with image navigation and cart functionality
- **Subjects Page**: Subject listings with expandable video players
- **About Page**: About video and component buttons

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Shared components
│   ├── Header.jsx      # Navigation header with logo and login/apply buttons
│   ├── Footer.jsx      # Footer with links and social media
│   ├── LoginModal.jsx  # Login modal component
│   └── ApplyModal.jsx  # Apply/Register modal component
├── pages/              # Page components
│   ├── Home.jsx        # Home page with sliders and profiles
│   ├── LearnMore.jsx   # Learn More/FAQ page
│   ├── Products.jsx    # Products page with cart
│   ├── Subjects.jsx    # Subjects page with video players
│   └── About.jsx       # About page
├── styles/             # CSS files (copied from vanilla HTML project)
│   ├── general.css
│   ├── home.css
│   ├── products.css
│   ├── subjects.css
│   ├── learn-more.css
│   ├── about.css
│   └── footer/
└── App.jsx             # Main app with React Router setup
```

## Technologies Used

- React 19
- Vite
- React Router DOM
- Tailwind CSS (configured, ready for future migration)
- Traditional CSS (copied from original project)

## Notes

- All CSS files from the original project have been copied and are being used as-is
- Assets (images, icons, logos) have been copied to the `public` folder
- The app uses React Router for navigation
- All interactive features from the original HTML/JS version have been converted to React hooks and state management

## Future Improvements

- Migrate CSS to Tailwind CSS classes
- Add state management (Redux/Context API) if needed
- Add form validation for login/apply modals
- Implement actual cart functionality with backend integration
- Add loading states and error handling
