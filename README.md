# Anki Importer

A React-based web application for efficiently importing customized flashcards into Anki. This tool specializes in handling cloze deletions and supports LaTeX math formatting, code snippets, and HTML formatting.

![Preview of Anki Importer](https://placeholder-for-screenshot.png)

## Features

- **Multiple Import Modes**
  - Model & Deck: Create both note type and deck simultaneously
  - Model Only: Create just the note type template
  - Deck Only: Add cards to existing note types

- **Rich Formatting Support**
  - LaTeX for mathematical expressions
  - Code blocks with syntax highlighting
  - HTML formatting
  - Custom styling for code and math content

- **Anki Integration**
  - Direct sync with Anki using AnkiConnect
  - Bulk import support
  - Parent deck organization

## Prerequisites

- [Anki](https://apps.ankiweb.net/) installed on your system
- [AnkiConnect](https://ankiweb.net/shared/info/2055492159) add-on installed
- Node.js and npm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/anki-importer.git
cd anki-importer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Make sure Anki is running and AnkiConnect is properly installed

## Usage

### Creating a New Model and Deck

1. Select "Model & Deck" mode
2. Enter your model template in the Model field
3. Choose the model type (Model A or Model C)
4. Enter your deck content with proper separators
5. Click "Upload" to create both model and deck

### Model Format
```
Note Type: [Name]-Cloze
Field 1: [Field1Name]
Field 2: [Field2Name]

Card 1:
Front Template:
---
{{cloze:Field1Name}}
---
Back Template:
---
{{cloze:Field1Name}}<br>
{{Field2Name}}
---
```

### Deck Format
```
#separator:|||SEPARATOR|||
#html:true
#notetype column:1
#deck column:2
[NoteName]|||SEPARATOR|||[DeckName]|||SEPARATOR|||[Field1Content]|||SEPARATOR|||[Field2Content]
```

## Important Rules

1. Deck and Note Type names must match and end with 'Cloze'
2. No duplicate content in Field 1
3. Use `<br>` for line breaks (not raw newlines)
4. Place cloze deletions only in Field 1
5. Use web URLs for images
6. Enclose LaTeX in `\(` and `\)`

## Development

The project uses Create React App and is structured as follows:

```
src/
  ├── components/          # React components
  │   ├── DeckForm.js     # Deck input form
  │   ├── ModelForm.js    # Model input form
  │   ├── Header.js       # App header
  │   └── ModeSelector.js # Mode selection dropdown
  ├── App.js              # Main application component
  ├── apiService.js       # AnkiConnect API integration
  └── App.css             # Application styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Integrates with [AnkiConnect](https://foosoft.net/projects/anki-connect/)
- Uses [Create React App](https://create-react-app.dev/)