import React from "react";
import { useState } from "react";

export default function ListFilterForm({ submitChanges }) {
  //The controlled state for all the filtering options
  const [kyuLevelChecked, setKyuLevelChecked] = useState(Array(8));
  const kyuLevels = [1, 2, 3, 4, 5, 6, 7, 8];

  function updateCheckBox(e) {
    let checkBoxNumber = e.target.id.match(/[1-8]/)[0];

    //kyuLevelChecked[checkBoxNumber-1] = e.target.value;
    setKyuLevelChecked((prev) => {
      prev[checkBoxNumber - 1] = e.target.checked;
      console.log("updating checklist filter", prev);
      return [...prev];
    });
  }

  return (
    <div id="ListFilterForm" className="flex f-column f-align-center">
      <h1>ListFilterForm</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          //Build the options object
          submitChanges({ kyuLevelChecked });
        }}
      >
        <fieldset id="kyuCheckBoxesFieldset">
          {kyuLevels.map((level) => {
            return (
              <div key={`filterKyuCheck-${level}`} className="checkContainer">
                <input
                  type="checkbox"
                  name={`filterKyuCheck${level}`}
                  id={`filterKyuCheck${level}`}
                  onChange={updateCheckBox}
                />
                <label htmlFor={`filterKyuCheck${level}`}>{level} Kyu</label>
              </div>
            );
          })}
          {JSON.stringify(kyuLevelChecked)}
        </fieldset>
        <button type="submit" className="button">Apply Filters</button>
      </form>
    </div>
  );
}
