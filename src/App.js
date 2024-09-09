import { useState } from "react";
import { createModel, createDeck } from "./apiService";
import "./App.css";

function App() {
  const [model, setModel] = useState("");
  const [deck, setDeck] = useState("");
  const [parentDeck, setParentDeck] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const clearFields = () => {
    setModel("");
    setDeck("");
    setSuccessMessage(""); // Clear the success message when fields are cleared
  };

  const handleUpload = () => {
    setSuccessMessage(""); // Clear any previous success message
    createModel(model)
      .then(({ modelName, inOrderFields }) => {
        return createDeck(deck, modelName, inOrderFields, parentDeck);
      })
      .then(() => {
        setSuccessMessage("Model and Deck created successfully!");
        setTimeout(() => {
          setSuccessMessage(""); // Clear the success message after 5 seconds
        }, 5000);
      })
      .catch((error) => {
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
        <button className="upload-button" onClick={handleUpload}>
          Upload
        </button>
      </div>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
}

export default App;