import React from "react";

const HourButtonHotKeys = props => {
  return (
    <div>
      <button
        className="btn btn-space btn-secondary btn-sm"
        onClick={() => props.click(-1, props.name)}
      >
        NOW
      </button>
      <button
        className="btn btn-space btn-secondary btn-sm"
        onClick={() => props.click(2, props.name)}
      >
        Add 2HR
      </button>
      <button
        className="btn btn-space btn-secondary btn-sm"
        onClick={() => props.click(4, props.name)}
      >
        Add 4HR
      </button>
      <button
        className="btn btn-space btn-secondary btn-sm"
        onClick={() => props.click(6, props.name)}
      >
        Add 8HR
      </button>
    </div>
  );
};

export default HourButtonHotKeys;
