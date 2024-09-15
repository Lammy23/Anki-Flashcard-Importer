import React, { useState, useCallback } from "react";
import {
  createModel,
  createDeckAndAddNotes,
  addNotesOnly,
  sync,
} from "./apiService";
import Header from "./components/Header";
import "./App.css";

const MODES = {
  MODEL_AND_DECK: "modelAndDeck",
  MODEL_ONLY: "modelOnly",
  DECK_ONLY: "deckOnly",
};

const MODEL_TYPES = {
  MODEL_A: "model-a",
  MODEL_C: "model-c",
};

function App() {
  const [formState, setFormState] = useState({
    model: "",
    deck: "",
    parentDeck: "",
    modelType: MODEL_TYPES.MODEL_A,
    modelName: "",
    mode: MODES.MODEL_AND_DECK,
  });

  const [message, setMessage] = useState({ success: "", error: "" });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }, []);

  const clearFields = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      model: "",
      deck: "",
      modelName: "",
    }));
    setMessage({ success: "", error: "" });
  }, []);

  const handleUpload = useCallback(() => {
    setMessage({ success: "", error: "" });

    const { mode, model, modelType, deck, parentDeck, modelName } = formState;

    const operations = {
      [MODES.MODEL_ONLY]: () => createModel(model, modelType),
      [MODES.DECK_ONLY]: () => addNotesOnly(deck, parentDeck, modelName),
      [MODES.MODEL_AND_DECK]: () =>
        createModel(model, modelType).then(({ modelName, inOrderFields }) =>
          createDeckAndAddNotes(deck, modelName, inOrderFields, parentDeck)
        ),
    };

    operations[mode]()
      .then(() => {
        setMessage({ success: "Operation completed successfully!", error: "" });
        sync(); // Uncommented the sync function
      })
      .catch((error) => {
        setMessage({ success: "", error: `Error: ${error.message}` });
        console.error("Error:", error);
      });
  }, [formState]);

  return (
    <div className="app">
      <Header /> {/* Add this line to render the Header component */}
      <div className="row">
        <div className="column">
          <p>Mode</p>
          <select
            className="mode-dropdown"
            name="mode"
            value={formState.mode}
            onChange={handleInputChange}
          >
            <option value={MODES.MODEL_AND_DECK}>Model & Deck</option>
            <option value={MODES.MODEL_ONLY}>Model Only</option>
            <option value={MODES.DECK_ONLY}>Deck Only</option>
          </select>
        </div>
      </div>
      {(formState.mode === MODES.MODEL_AND_DECK ||
        formState.mode === MODES.MODEL_ONLY) && (
        <div className="row">
          <div className="column">
            <p>Model</p>
            <textarea
              name="model"
              rows="10"
              cols="60"
              value={formState.model}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}
      {(formState.mode === MODES.MODEL_AND_DECK ||
        formState.mode === MODES.DECK_ONLY) && (
        <div className="row">
          <div className="column">
            <p>Deck</p>
            <textarea
              name="deck"
              rows="10"
              cols="60"
              value={formState.deck}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}
      {(formState.mode === MODES.MODEL_AND_DECK ||
        formState.mode === MODES.DECK_ONLY) && (
        <div className="column">
          <p>Parent Deck</p>
          <input
            name="parentDeck"
            type="text"
            placeholder="deck 1::deck 2:: ..."
            value={formState.parentDeck}
            onChange={handleInputChange}
          />
        </div>
      )}
      {(formState.mode === MODES.MODEL_AND_DECK ||
        formState.mode === MODES.MODEL_ONLY) && (
        <div className="column">
          <p>Model Type</p>
          <select
            className="model-type-dropdown"
            name="modelType"
            value={formState.modelType}
            onChange={handleInputChange}
          >
            <option value={MODEL_TYPES.MODEL_A}>Model A</option>
            <option value={MODEL_TYPES.MODEL_C}>Model C</option>
          </select>
        </div>
      )}
      {formState.mode === MODES.DECK_ONLY && (
        <div className="column">
          <p>Model & Deck Name (Required)</p>
          <input
            name="modelName"
            type="text"
            placeholder="Enter model & deck name"
            value={formState.modelName}
            onChange={handleInputChange}
          />
        </div>
      )}
      <div className="row">
        <button className="upload-button" onClick={handleUpload}>
          Upload
        </button>
        <button className="clear-button" onClick={clearFields}>
          Clear
        </button>
      </div>
      {message.success && (
        <div className="success-message">{message.success}</div>
      )}
      {message.error && <div className="error-message">{message.error}</div>}
    </div>
  );
}

export default App;
