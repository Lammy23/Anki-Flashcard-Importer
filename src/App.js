import { useState } from "react";
import { test, createModel, createDeck } from "./apiService";
import "./App.css";

function App() {
  const [model, setModel] = useState();
  const [deck, setDeck] = useState();
  const [parentDeck, setParentDeck] = useState();

  return (
    <div className="app">
      <div className="row">
        <div className="column">
          <p>Model</p>
          <textarea
            name="model"
            rows="40"
            cols="60"
            onChange={(e) => setModel(e.target.value)}
          />
        </div>

        <div className="column">
          <p>Deck</p>
          <textarea
            name="decks"
            rows="40"
            cols="60"
            onChange={(e) => setDeck(e.target.value)}
          />
        </div>
      </div>
      <div className="column">
        <p>parentDeck</p>
        <input
          name="parentDeck"
          type="text"
          placeholder="deck 1::deck 2:: ..."
        />
      </div>
      <div className="row">
        <button
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
