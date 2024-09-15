// src/apiService.js
const VERSION = 6;
const ANKI_API = "http://localhost:8765";

function invoke(action, version, params = {}) {
  return fetch(ANKI_API, {
    method: "POST",
    body: JSON.stringify({ action, version, params }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((response) => {
      console.log(`Response for action ${action}:`, response);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    });
}

function sync() {
  return invoke("sync", VERSION);
}

function getModelFieldNames(modelName) {
  console.log(modelName);
  return new Promise((resolve, reject) => {
    invoke("modelFieldNames", VERSION, { modelName })
      .then((response) => resolve(response.result))
      .catch(reject);
  });
}

function createModel(fileContent, modelType) {
  return new Promise((resolve, reject) => {
    const lines = fileContent.split("\n");
    let result = {
      modelName: "",
      inOrderFields: [],
      css:
        modelType === "model-c"
          ? `@font-face {
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
            }`
          : `@font-face {
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
              font-size: 30px;
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
            }`,
      isCloze: modelType === "model-c",
      cardTemplates: [],
    };

    let currentCard = null;
    let frontInProgress = null;

    for (let line of lines) {
      line = line.trim();

      if (line.startsWith("Note Type:")) {
        result.modelName = line.split(":")[1].trim();
      }

      if (line.startsWith("Field")) {
        result.inOrderFields.push(line.split(":")[1].trim());
      }

      if (line.startsWith("Card")) {
        if (currentCard) {
          result.cardTemplates.push(currentCard);
        }
        currentCard = { Name: line.split(":")[0].trim(), Front: "", Back: "" };
      } else if (line === "Front Template:") {
        currentCard.Front = "";
        frontInProgress = true;
      } else if (line === "Back Template:") {
        currentCard.Back = "";
        frontInProgress = false;
      } else if (currentCard && line !== "---") {
        if (frontInProgress) {
          currentCard.Front += line + "\n";
        } else {
          currentCard.Back += line + "\n";
        }
      }
    }

    if (currentCard) {
      result.cardTemplates.push(currentCard);
    }

    // Clean up the card templates
    result.cardTemplates = result.cardTemplates.map((card) => ({
      Name: card.Name,
      Front: card.Front.trim(),
      Back: card.Back.trim(),
    }));

    //DEBUG
    // console.log("modelName", result.modelName);
    // console.log("inOrderFields", result.inOrderFields);
    // console.log("css", result.css);
    // console.log("cardTemplates", result.cardTemplates);

    invoke("createModel", VERSION, result)
      .then(() =>
        resolve({
          modelName: result.modelName,
          inOrderFields: result.inOrderFields,
        })
      )
      .catch(reject);
  });
}

function addNotesOnly(fileContent, parentDeck, modelName) {
  return new Promise((resolve, reject) => {
    var deckName;
    if (!parentDeck) {
      deckName = modelName;
    } else {
      deckName = `${parentDeck}::${modelName}`;
    }
    getModelFieldNames(modelName)
      .then((inOrderFields) => {
        console.log("inOrderFields", inOrderFields);
        return new Promise((resolve, reject) => {
          const result = [];
          var lines = fileContent.split("\n");
          lines = lines.filter((line) => {
            return !(line[0] === "#") && line.length > 0;
          });

          lines = lines.map((line) => {
            var newLine = line.trim();
            newLine = newLine.split("\t").filter((word, index) => {
              return index > 1;
            });
            return newLine;
          });

          lines.forEach((line) => {
            // line[0], line[1], line[2], ...
            const note = {
              deckName: deckName,
              modelName: modelName,
            };
            var fields = inOrderFields.reduce((accumulator, key, index) => {
              accumulator[key] = line[index];
              return accumulator;
            }, {});
            note.fields = fields;
            result.push(note);
          });
          //DEBUG
          console.log("result", result);

          invoke("addNotes", VERSION, { notes: result })
            .then(resolve)
            .catch(reject);
        });
      })
      .then(resolve)
      .catch(reject);
  });
}

function createDeckAndAddNotes(
  fileContent,
  modelName,
  inOrderFields,
  parentDeck
) {
  console.log("inOrderFields", inOrderFields);
  return new Promise((resolve, reject) => {
    var deckName = modelName;
    if (parentDeck) {
      deckName = `${parentDeck}::${modelName}`;
    }
    invoke("createDeck", VERSION, { deck: deckName })
      .then(() => {
        const result = [];
        var lines = fileContent.split("\n");
        lines = lines.filter((line) => {
          console.log(line[0]);
          return !(line[0] === "#") && line.length > 0;
        });

        lines = lines.map((line) => {
          var newLine = line.trim();
          newLine = newLine.split("\t").filter((word, index) => {
            return index > 1;
          });
          return newLine;
        });

        lines.forEach((line) => {
          // line[0], line[1], line[2], ...
          const note = {
            deckName: deckName,
            modelName: modelName,
          };
          var fields = inOrderFields.reduce((accumulator, key, index) => {
            accumulator[key] = line[index];
            return accumulator;
          }, {});
          note.fields = fields;
          result.push(note);
        });
        //DEBUG
        console.log("result", result);

        invoke("addNotes", VERSION, { notes: result })
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });
}

export {
  createModel,
  createDeckAndAddNotes,
  addNotesOnly,
  sync,
  getModelFieldNames,
};
