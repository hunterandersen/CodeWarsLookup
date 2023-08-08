import React from "react";
import "./CheckBox.css";

export default function CheckBox({name, id, checked, onChange, content}) {
  return (
    <div className="CheckBox" onClick={onChange}>
      <input
        type="checkbox"
        name={name}
        id={id}
      />
      <label
        htmlFor={name}
        className={checked? "CheckboxSelected" : ""}
      >
        {content}
      </label>
    </div>
  );
}
