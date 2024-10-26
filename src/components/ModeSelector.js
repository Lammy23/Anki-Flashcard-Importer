import React from 'react';

const MODES = {
  MODEL_AND_DECK: "modelAndDeck",
  MODEL_ONLY: "modelOnly",
  DECK_ONLY: "deckOnly",
};

function ModeSelector({ mode, onChange }) {
  return (
    <div className="column">
      <p>Mode</p>
      <select
        className="mode-dropdown"
        name="mode"
        value={mode}
        onChange={onChange}
      >
        <option value={MODES.MODEL_AND_DECK}>Model & Deck</option>
        <option value={MODES.MODEL_ONLY}>Model Only</option>
        <option value={MODES.DECK_ONLY}>Deck Only</option>
      </select>
    </div>
  );
}

export { MODES, ModeSelector };