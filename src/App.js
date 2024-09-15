import React, { useState, useCallback } from "react";
import {
  createModel,
  createDeckAndAddNotes,
  addNotesOnly,
  sync,
} from "./apiService";
import Header from "./components/Header";
import { MODES, ModeSelector } from "./components/ModeSelector";
import { MODEL_TYPES, ModelForm } from "./components/ModelForm";
import DeckForm from "./components/DeckForm";
import "./App.css";

function App() {
  const [formState, setFormState] = useState({
    model: "",
    deck: "",
    parentDeck: "",
    modelType: MODEL_TYPES.MODEL_A,
    modelName: "",
    mode: MODES.MODEL_AND_DECK,
  });

  const [message, setMessage] = useState({
    success: "",
    error: "",
    synced: "",
  });
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
      deckToDelete: "",
    }));
    setMessage({ success: "", error: "", synced: "" });
  }, []);

  const handleSync = useCallback(() => {
    setMessage((prev) => ({ ...prev, synced: "Syncing..." }));
    sync()
      .then(() =>
        setMessage((prev) => ({ ...prev, synced: "Synced successfully" }))
      )
      .catch((error) =>
        setMessage((prev) => ({
          ...prev,
          error: `Sync error: ${error.message}`,
          synced: "",
        }))
      );
  }, []);

  const handleUpload = useCallback(() => {
    setMessage({ success: "", error: "", synced: "" });

    const {
      mode,
      model,
      modelType,
      deck,
      parentDeck,
      modelName,
    } = formState;

    const operations = {
      [MODES.MODEL_ONLY]: () => createModel(model, modelType),
      [MODES.DECK_ONLY]: () => addNotesOnly(deck, parentDeck, modelName),
      [MODES.MODEL_AND_DECK]: () =>
        createModel(model, modelType).then(({ modelName, inOrderFields }) =>
          createDeckAndAddNotes(deck, modelName, inOrderFields, parentDeck)
        ),
    };

    operations[mode]()
      .then((result) => {
        setMessage({
          success: result || "Operation completed successfully!",
          error: "",
          synced: "",
        });
      })
      .catch((error) => {
        setMessage({
          success: "",
          error: `Error: ${error.message}`,
          synced: "",
        });
        console.error("Error:", error);
      });
  }, [formState]);

  return (
    <div className="app">
      <Header />
      <div className="sync-button-container">
        <button className="sync-button" onClick={handleSync}>
          Sync
        </button>
      </div>
      <div className="row">
        <ModeSelector mode={formState.mode} onChange={handleInputChange} />
      </div>
      {(formState.mode === MODES.MODEL_AND_DECK ||
        formState.mode === MODES.MODEL_ONLY) && (
        <ModelForm
          model={formState.model}
          modelType={formState.modelType}
          onChange={handleInputChange}
        />
      )}
      {(formState.mode === MODES.MODEL_AND_DECK ||
        formState.mode === MODES.DECK_ONLY) && (
        <DeckForm
          deck={formState.deck}
          parentDeck={formState.parentDeck}
          modelName={formState.modelName}
          onChange={handleInputChange}
          isDeckOnly={formState.mode === MODES.DECK_ONLY}
        />
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
      {message.synced && <div className="synced-message">{message.synced}</div>}
    </div>
  );
}

export default App;
