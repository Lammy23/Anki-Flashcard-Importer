import React from 'react';

const MODEL_TYPES = {
  MODEL_A: "model-a",
  MODEL_C: "model-c",
};

function ModelForm({ model, modelType, onChange }) {
  return (
    <>
      <div className="row">
        <div className="column">
          <p>Model</p>
          <textarea
            name="model"
            rows="10"
            cols="60"
            value={model}
            onChange={onChange}
          />
        </div>
      </div>
      <div className="column">
        <p>Model Type</p>
        <select
          className="model-type-dropdown"
          name="modelType"
          value={modelType}
          onChange={onChange}
        >
          <option value={MODEL_TYPES.MODEL_A}>Model A</option>
          <option value={MODEL_TYPES.MODEL_C}>Model C</option>
        </select>
      </div>
    </>
  );
}

export { MODEL_TYPES, ModelForm };