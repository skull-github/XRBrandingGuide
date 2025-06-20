# MLB XR Branding Guide v1.6

A consolidated and streamlined version of the MLB XR Branding Guide application.

## Features

- Clean, responsive interface for viewing MLB team branding assets
- Real-time spot color extraction from team logos
- Modal overlay for viewing high-resolution assets
- One-click URL copying for assets
- Support for both web and Electron desktop deployment

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Electron Desktop App

Run in Electron development mode:

```bash
npm run electron:dev
```

Build Electron app for distribution:

```bash
npm run electron:package
```

## Team Data

The application uses `src/team-extras.json` as the primary data source for MLB team information including:

- Team URLs
- Regular season stats venue IDs
- Venue names

## Asset Types

The application displays the following MLB team assets:

- **Cap Logos**: Default team cap logos
- **Spot Logos**: Primary team spot logos
- **Spot Colors**: Automatically extracted primary colors from team fills
- **Wordmark Light**: Light version team wordmarks
- **Wordmark Dark**: Dark version team wordmarks

## Architecture

- **React 19**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **Electron**: Desktop application wrapper
- **CSS**: Custom styling with dark/light mode support

## Consolidated Features

This v1.6 consolidates the best features from previous versions:

- Simplified codebase with essential functionality only
- Removed unused dependencies and assets
- Optimized for performance and maintainability
- Clean, modern UI design

## License

Internal MLB use only.
