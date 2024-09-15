import React from 'react';

function DeckForm({ deck, parentDeck, modelName, onChange, isDeckOnly }) {
  return (
    <>
      <div className="row">
        <div className="column">
          <p>Deck</p>
          <textarea
            name="deck"
            rows="10"
            cols="60"
            value={deck}
            onChange={onChange}
          />
        </div>
      </div>
      <div className="column">
        <p>Parent Deck</p>
        <input
          name="parentDeck"
          type="text"
          placeholder="deck 1::deck 2:: ..."
          value={parentDeck}
          onChange={onChange}
        />
      </div>
      {isDeckOnly && (
        <div className="column">
          <p>Model & Deck Name (Required)</p>
          <input
            name="modelName"
            type="text"
            placeholder="Enter model & deck name"
            value={modelName}
            onChange={onChange}
          />
        </div>
      )}
    </>
  );
}

export default DeckForm;