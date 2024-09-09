// src/App.js
import { useState } from "react";
import { createModel, createDeck } from "./apiService";
import "./App.css";

function App() {
  const [model, setModel] = useState("");
  const [deck, setDeck] = useState("");
  const [parentDeck, setParentDeck] = useState("");

  const clearFields = () => {
    setModel("");
    setDeck("");
  };

  return (
    <div className="app">
      <div className="row">
        <div className="column">
          <p>Model</p>
          <textarea
            name="model"
            rows="10"
            cols="60"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>

        <div className="column">
          <p>Deck</p>
          <textarea
            name="decks"
            rows="10"
            cols="60"
            value={deck}
            onChange={(e) => setDeck(e.target.value)}
          />
        </div>
      </div>
      <button className="clear-button" onClick={clearFields}>
          Clear
        </button>
      <div className="column">
        <p>Parent Deck</p>
        <input
          name="parentDeck"
          type="text"
          placeholder="deck 1::deck 2:: ..."
          onChange={(e) => setParentDeck(e.target.value)}
        />
      </div>
      <div className="row">
        <button
          className="upload-button"
          onClick={() => {
            const { modelName, inOrderFields } = createModel(model);
            createDeck(deck, modelName, inOrderFields, parentDeck);
          }}
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export default App;