# Express.js Application

A basic Express.js application with a modern project structure.

## Features

- Express.js server with basic middleware setup
- CORS enabled
- Environment variables support
- Request logging with Morgan
- Error handling middleware
- Basic project structure

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a .env file in the root directory (already done)
```
PORT=3000
NODE_ENV=development
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

The server will start on http://localhost:3000

## Available Scripts

- `npm start` - Starts the production server
- `npm run dev` - Starts the development server with hot-reload
- `npm test` - Runs the test suite

## Project Structure

```
├── app.js              # Application entry point
├── package.json        # Project dependencies and scripts
├── .env               # Environment variables
├── .gitignore         # Git ignore rules
└── README.md          # Project documentation
```

## License

This project is licensed under the MIT License. 