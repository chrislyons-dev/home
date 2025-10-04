# Installation

Get the project up and running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **Git** for version control

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/chrislyons-dev/home.git
cd home
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:

- Astro and its plugins
- React and React DOM
- Tailwind CSS
- TypeScript
- Development tools

### 3. Start Development Server

```bash
npm run dev
```

The development server will start at `http://localhost:4321`

## Verification

To verify your installation is working:

1. Open your browser to `http://localhost:4321`
2. You should see the home page load
3. Test the dark mode toggle
4. Navigate between pages to ensure routing works

## Troubleshooting

### Port Already in Use

If port 4321 is already in use, Astro will automatically try the next available port. Check the console output for the actual port being used.

### Module Not Found Errors

If you encounter module errors:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

For TypeScript or build errors:

```bash
npm run build
```

This will show detailed error messages for any issues.

## Next Steps

- [Quick Start Guide](quick-start.md) - Build your first page
- [Configuration](configuration.md) - Customize the site
