import React from "react";
import { useState } from "react";

export default function UserInputForm({
  handleSubmit,
  updateDisplayCount,
  feedback,
}) {
  const [inputText, setInputText] = useState("");
  const [displayCount, setDisplayCount] = useState(20);

  function handleChange(event) {
    switch (event.target.name) {
      case "userNameInput":
        setInputText(() => event.target.value);
        break;
      case "displayCountInput":
        event.preventDefault();
        setDisplayCount(() => event.target.value);
        break;
      default:
        console.log("No action for ", event.target.name);
    }
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
        <label htmlFor="userNameInput">Input username:</label>
        <input
          onChange={handleChange}
          type="text"
          name="userNameInput"
          id="userNameInput"
          value={inputText}
        />
        <button className="button">Search User</button>
      </form>
      <form onSubmit={(e) => {
        e.preventDefault();
        updateDisplayCount(displayCount);
      }} className="flex">
        <label htmlFor="displayCountInput">Number of Katas to Display:</label>
        <input
          onChange={handleChange}
          type="number"
          step={5}
          min={10}
          max={50}
          value={displayCount}
          name="displayCountInput"
          id="displayCountInput"
        />
        <button className="button">Update List Length</button>
      </form>
    </div>
  );
}
