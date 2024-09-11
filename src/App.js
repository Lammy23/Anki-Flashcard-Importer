// src/App.js
import { useState } from "react";
import { createModel, createDeck, sync } from "./apiService";
import "./App.css";

function App() {
  const [model, setModel] = useState("");
  const [deck, setDeck] = useState("");
  const [parentDeck, setParentDeck] = useState("");
  const [modelType, setModelType] = useState("model-a");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const clearFields = () => {
    setModel("");
    setDeck("");
    setSuccessMessage(""); // Clear the success message when fields are cleared
    setErrorMessage(""); // Clear the error message when fields are cleared
  };

  const handleUpload = () => {
    setSuccessMessage(""); // Clear any previous success message
    setErrorMessage(""); // Clear any previous error message
    createModel(model, modelType)
      .then(({ modelName, inOrderFields }) => {
        return createDeck(deck, modelName, inOrderFields, parentDeck);
      })
      .then(() => {
        setSuccessMessage("Model and Deck created successfully!");
        sync(); // Sync the changes to the server
        setTimeout(() => {
          setSuccessMessage(""); // Clear the success message after 5 seconds
        }, 5000);
      })
      .catch((error) => {
        setErrorMessage(`Error: ${error.message}`);
        console.error("Error creating model or deck:", error);
      });
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

      <div className="row">
        <button className="clear-button" onClick={clearFields}>
          Clear
        </button>
        <div className="column">
          <p>Model Type</p>
          <select
            className="model-type-dropdown"
            name="modelType"
            value={modelType}
            onChange={(e) => setModelType(e.target.value)}
          >
            <option value="model-a">Model A</option>
            <option value="model-c">Model C</option>
          </select>
        </div>
        <div className="column">
          <p>Parent Deck</p>
          <input
            name="parentDeck"
            type="text"
            placeholder="deck 1::deck 2:: ..."
            onChange={(e) => setParentDeck(e.target.value)}
          />
        </div>
      </div>

      <div className="center">
        <button className="upload-button" onClick={handleUpload}>
          Upload
        </button>
      </div>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}

export default App;
