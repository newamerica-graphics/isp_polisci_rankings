import React from "react";
import "./InfoContainer.scss";

export default props => (
  <div className="dv-InfoContainer">
    {props.definitions.map((def, i) => {
      return (
        <div className="dv-InfoContainer__item">
          <h3>{def.indicator}</h3>
          <p>{def.definition}</p>
          {def.type && (
            <span className="dv-InfoContainer__type">{def.type}</span>
          )}
        </div>
      );
    })}
  </div>
);
