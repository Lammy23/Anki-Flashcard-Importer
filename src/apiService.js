const VERSION = 6;
const ANKI_API = "http://localhost:8765";

function invoke(action, version, params = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("error", () => reject("failed to issue request"));
    xhr.addEventListener("load", () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (Object.getOwnPropertyNames(response).length != 2) {
          throw "response has an unexpected number of fields";
        }
        if (!response.hasOwnProperty("error")) {
          throw "response is missing required error field";
        }
        if (!response.hasOwnProperty("result")) {
          throw "response is missing required result field";
        }
        if (response.error) {
          throw response.error;
        }
        resolve(response.result);
      } catch (e) {
        reject(e);
      }
    });

    xhr.open("POST", ANKI_API);
    xhr.send(JSON.stringify({ action, version, params }));
  });
}

function createModel(fileContent) {
  const lines = fileContent.split("\n");
  let result = {
    modelName: "",
    inOrderFields: [],
    css: ".card {font-family:open sans;font-size:30px;text-align:center;color:black;background-color:white;}\n.extra {font-size:15px;}\nstrong {color:lightblue;}",
    cardTemplates: [],
  };

  let currentCard = null;
  let frontInProgress = null;
  let backInProgress = null;

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
    } else if (currentCard && line !== "```") {
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
  //   console.log("modelName", result.modelName);
  //   console.log("inOrderFields", result.inOrderFields);
  //   console.log("css", result.css);
  //   console.log("cardTemplates", result.cardTemplates);

  invoke("createModel", VERSION, result);

  return { modelName: result.modelName, inOrderFields: result.inOrderFields };
}

function createDeck(fileContent, modelName, inOrderFields, parentDeck) {
  var deckName = modelName;
  if (parentDeck) {
    deckName = `${parentDeck}::${modelName}`;
  }
  invoke("createDeck", VERSION, { deck: deckName });
  const result = [];
  var lines = fileContent.split("\n");
  lines = lines.filter((line) => {
    console.log(line[0]);
    return !(line[0] === "#") && line.length > 0;
  });

  console.log("lines", lines);

  lines = lines.map((line) => {
    var newLine = line.trim();
    newLine = newLine.split("\t").filter((word, index) => {
      return index > 1;
    });
    return newLine;
  });

  console.log("lines", lines);

  lines.forEach((line) => {
    // line[0], line[1], line[2], ...
    const note = {
      deckName: deckName,
      modelName: modelName,
    };
    var fields = inOrderFields.reduce((accumulator, key, index) => {
      // console.log(accumulator)
      accumulator[key] = line[index];
      return accumulator;
    }, {});
    note.fields = fields;
    result.push(note);
  });
  //DEBUG
  console.log("result", result);

  invoke("addNotes", VERSION, { notes: result });
}

export { createModel, createDeck };
