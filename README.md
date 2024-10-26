# Anki Importer

A React-based web application for efficiently importing customized flashcards into Anki. This tool specializes in handling cloze deletions and supports LaTeX math formatting, code snippets, and HTML formatting. Supports 'Basic' (MODEL-A) note type with one or more card types as well as 'Cloze' (MODEL-C) note type. 

%% TODO: Insert Preview Here %%

## Features

- **Multiple Import Modes**
  - Model & Deck: Create both note type and deck simultaneously
  - Model Only: Create just the note type template
  - Deck Only: Add cards to existing note types

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


## Model and Deck Formats

### Model-A Format (INPUT)
```
Note Type: [NoteName]
Field 1: [Field1Name]
Field 2: [Field2Name]
Field 3: [Field3Name]

Card [Number]: 
	Front Template:
	---
	<p class='extra'>[Supplementary text 1]</p>
	{{[Field 1 Name]}}
	---
	Back Template:
	---
	{{FrontSide}} 
	<hr id=answer> 
	{{[Field 2 Name]}} 
	---
Card [Number]: 
	Front Template:
	---
	<p class='extra'>[Supplementary text 2]</p>
	{{[Field 2 Name]}}
	---
	Back Template:
	---
	{{FrontSide}} 
	<hr id=answer> 
	{{[Field 3 Name]}} 
	---
```

For 'Basic' Notes with one or more card types.

### Deck-A Format (INPUT)
```
#separator:|||SEPARATOR|||
#html:true
#notetype column:1
#deck column:2
[NoteName]|||SEPARATOR|||[DeckName]|||SEPARATOR|||[Field1Content]|||SEPARATOR|||[Field2Content]|||SEPARATOR|||[Field3Content]
```

### Model-C Format (INPUT)
```
Note Type: [NoteName]
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
For 'Cloze' Notes.

### Deck-C Format (INPUT)
```
#separator:|||SEPARATOR|||
#html:true
#notetype column:1
#deck column:2
[NoteName]|||SEPARATOR|||[DeckName]|||SEPARATOR|||[Field1Content]|||SEPARATOR|||[Field2Content]
```

`|||SEPARATOR|||` used as the separator instead of the default `#` to prevent clashes with code or other specific content.

### Styling Format (NOT INPUT)
```
	@font-face {
	  font-family: 'Open Sans';
	  src: url('_OpenSans-Regular.ttf') format('truetype');
	  font-weight: normal;
	  font-style: normal;
	}

	@font-face {
	  font-family: 'Open Sans';
	  src: url('_OpenSans-Bold.ttf') format('truetype');
	  font-weight: bold;
	  font-style: normal;
	}

	@font-face {
	  font-family: 'Fira Code';
	  src: url('_FiraCode-Regular.ttf');
	}

	.card {
	  font-family: 'Open Sans', sans-serif;
	  font-size: 20px;
	  text-align: center;
	  color: black;
	  background-color: white;
	}

	.extra {
	  font-size: 15px;
	}

	strong {
	  color: lightblue;
	}

	code {
	  font-family: 'Fira Code', monospace;
	  background-color: #424242;
	  padding: 2px;
	  border-radius: 3px;
	}

	.code-block {
	  font-family: 'Fira Code', monospace;
	  display: block;
	  text-align: left;
	  background-color: #424242;
	  padding: 20px;
	  border-radius: 5px;
	  overflow-x: auto;
	  overflow-y: auto;
	  white-space: pre;
	  max-width: 1200px;
	  max-height: 600px;
	  margin: 10px auto;
	}

	.cloze {
	  font-weight: bold;
	  color: blue;
	}

	.nightMode .cloze {
	  color: lightblue;
	}

	@media (max-width: 768px) {
	  .code-block {
		padding: 10px;
		max-height: 650px;
	  }
	}

	@media (max-width: 480px) {
	  .code-block {
		padding: 8px;
		max-height: 500px;
		font-size: 14px;
	  }
	}
```
This is optional styling you can use in your Anki program. The advantage of this styling structure is the code element, code-block class and strong class I created.
![image](https://github.com/user-attachments/assets/e8596dcf-579a-4b24-a05d-4bd9c2fe2f73)
An example of the code element

## Important Rules for LLM
You can give the LLM you decide to use these rules:

1. Deck and Note Type names must match and end with 'Cloze'
2. No duplicate content in Field 1
3. Use `<br>` for line breaks (not raw newlines)
4. (For Model-C) Place cloze deletions only in Field 1
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

%% TODO: Add details here %%

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Integrates with [AnkiConnect](https://foosoft.net/projects/anki-connect/)
