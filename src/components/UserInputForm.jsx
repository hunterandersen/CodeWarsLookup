import React from "react";
import { useState } from "react";

export default function UserInputForm({ handleSubmit, feedback }) {
  const [inputText, setInputText] = useState("");

  function handleChange(event) {
    console.log(event.target.value);
    setInputText(() => event.target.value);
  }

  return (
    <div className="flex f-column f-align-center">
      <p>{feedback}</p>
      <form
        onSubmit={(e) => {
          handleSubmit(e, inputText);
          setInputText("");
        }}
        className="flex"
      >
        <label htmlFor="userInput">Input username:</label>
        <input
          onChange={handleChange}
          type="text"
          name="userInput"
          id="useInput"
          value={inputText}
        />
        <button className="button">Search User</button>
      </form>
    </div>
  );
}
