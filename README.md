# Code Splitter

A simple web application that allows you to split a single text file containing multiple code files into individual files with proper directory structure.

## Overview

Code Splitter is a React-based tool designed to help developers organize code that may be contained in a single file. It parses file headers in the format `### path/to/file.ext` and splits the content into separate files, preserving the directory structure. All processed files are then packaged into a downloadable ZIP file.

## Features

- 📝 Paste code directly or upload a text file
- 🔍 Automatically recognizes file headers in the format `### path/to/file.ext`
- 📁 Preserves folder structure based on file paths
- 📦 Generates a ZIP file with all extracted files
- 🔄 View a preview of all extracted files before downloading

## How It Works

1. Input your code (paste or upload a file)
2. Click "Process" to analyze and split the code
3. Review the extracted files
4. Click "Create ZIP" to package the files
5. Download the ZIP file

## Directory Structure

### Application Structure

```
code-splitter-app/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── index.js        # Entry point that renders the app
│   ├── App.js          # Main application container
│   ├── CodeSplitter.js # Our main component with all functionality
│   └── index.css       # Global styles
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation
```

### Output ZIP Structure

The output ZIP file's structure is dynamically generated based on the file headers in your input. For example, with the following input:

```
### src/App.tsx
import React from 'react';
function App() {
  return <div>Hello World</div>;
}
export default App;

### src/components/Button.tsx
import React from 'react';
function Button() {
  return <button>Click me</button>;
}
export default Button;

### config/settings.json
{
  "theme": "dark",
  "api": "https://api.example.com"
}
```

The generated ZIP file would have this structure:

```
split_files.zip/
├── src/
│   ├── App.tsx
│   └── components/
│       └── Button.tsx
└── config/
    └── settings.json
```

## File Header Format

File headers must follow this format:

```
### path/to/file.ext
```

- Must start with `###` followed by a space
- The path should include the filename with extension
- Directories are indicated by forward slashes (`/`)

## Dependencies

- React
- JSZip (for creating ZIP files)

## Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm start`

## Usage Examples

### Example 1: Splitting a React project

```
### src/App.tsx
import React from 'react';
import Button from './components/Button';

function App() {
  return (
    <div className="App">
      <h1>Hello World</h1>
      <Button />
    </div>
  );
}

export default App;

### src/components/Button.tsx
import React from 'react';

function Button() {
  return <button className="btn">Click me</button>;
}

export default Button;

### src/index.css
body {
  margin: 0;
  font-family: sans-serif;
}

.btn {
  background-color: blue;
  color: white;
  padding: 8px 16px;
}
```

### Example 2: Splitting configuration files

```
### .env
API_URL=https://api.example.com
DEBUG=true

### config/database.json
{
  "host": "localhost",
  "port": 5432,
  "user": "admin"
}

### docker-compose.yml
version: '3'
services:
  web:
    image: nginx
    ports:
      - "80:80"
```

## License

MIT
