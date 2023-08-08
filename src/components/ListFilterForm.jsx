import React from "react";
import { useState } from "react";
import "./ListFilterForm.css";
import CheckBox from "../styledComponents/CheckBox";

export default function ListFilterForm({ submitChanges }) {
  //The controlled state for all the filtering options
  const [kyuLevelChecked, setKyuLevelChecked] = useState(Array(8).fill(false));
  const kyuLevels = [1, 2, 3, 4, 5, 6, 7, 8];

  //This handler can run on either the parent div 
  //or the underlying input element. 
  //We handle both cases and prevent propagation as needed.
  function updateCheckBox(e) {
    let checkBoxNumber;
    //If the user clicked the actual checkbox input element
    if (e.target.tagName == "INPUT"){
      checkBoxNumber = e.target.id.match(/[1-8]/)[0];
      setKyuLevelChecked((prev) => {
        prev[checkBoxNumber - 1] = e.target.checked;
        console.log("updating checklist filter", prev);
        return [...prev];
      });
      e.stopPropagation();
    }
    //If the user only clicked the parent, containing div 
    else if (e.target.classList.contains("CheckBox")){
      const childCheckbox = e.target.children[0];
      checkBoxNumber = childCheckbox.id.match(/[1-8]/)[0];
      childCheckbox.checked = !childCheckbox.checked;
      setKyuLevelChecked((prev) => {
        prev[checkBoxNumber - 1] = childCheckbox.checked;
        console.log("updating checklist filter", prev);
        return [...prev];
      });
    }
  }

  return (
    <div id="ListFilterForm" className="flex f-column f-align-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          //Build the options object
          submitChanges({ kyuLevelChecked });
        }}
      >
        <fieldset id="kyuCheckBoxesFieldset">
          <legend>Kyu Selection</legend>
          {kyuLevels.map((level) => {
            return <CheckBox
              key={`filterKyuCheck-${level}`}
              name={`filterKyuCheck${level}`}
              id={`filterKyuCheck${level}`}
              onChange={updateCheckBox}
              checked={kyuLevelChecked[level-1]}
              content={level}
            />
          })}
          {/* {JSON.stringify(kyuLevelChecked)} */}
          <button type="submit" className="button">Apply Filters</button>
        </fieldset>
      </form>
    </div>
  );
}
