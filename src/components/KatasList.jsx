import React from "react";
import { useState } from "react";

export default function KatasList({ kataData, userData, filterOptions, displayCount }) {

  const [displayStartIndex, setDisplayStartIndex] = useState(0);

  const generateDisplayData = (kataData, userData, filterOptions) => {
    if (!filterOptions || !kataData || !userData) return null;
    console.log(filterOptions, kataData, userData);
    //Should return an array who's shape resembles ["3 kyu", "8 kyu", "5 kyu"]
    let kyuLevelsArr = filterOptions.kyuLevelChecked.map((kyu, ind) => {
      if (kyu) {
        //String should match the shape of any given kata.rank.name value (ex: "6 kyu")
        return `${ind + 1} kyu`;
      }
      return null;
    })
    .filter((ele) => {
      return ele;
    }); //the filter is to get rid of the null values after mapping

    let displayData = kataData.slice(0);
    if (kyuLevelsArr.length > 0){
      //Filter the data based on kyu level
      displayData = displayData.filter((kata) => {
        return kyuLevelsArr.includes(kata.rank.name);
      });
    }

    //Sort the data ascending/descending
    displayData.sort((a, b) => {
      if (filterOptions.ascending) {
        return a.rank.id - b.rank.id;
      }
      return b.rank.id - a.rank.id;
    });

    return displayData;
  };

  function handleUpArrow(){
    setDisplayStartIndex((prev) => {
      if (prev - displayCount >= 0){
        return prev - displayCount;
      }
      return 0;
    });
  }
  
  function handleDownArrow(){
    setDisplayStartIndex((prev) => {
      if (prev + displayCount <= kataInfo.length){
        return prev + displayCount;
      }
      return prev;
    });
  }

  const kataInfo = generateDisplayData(kataData, userData, filterOptions);

  return (
    <div className="container">
      <h1 className="m-auto" style={{ textAlign: "center" }}>
        Previous Katas
      </h1>
      {kataInfo && (
        <div className="list-control flex f-column">
          <div className="flex f-space-between">
            <h2>Total Filtered Katas: {kataInfo.length}</h2>
            <h3>Starting Index: {displayStartIndex}</h3>
            <div>
              {/* Up and Down Arrows */}
              <button type="button" className="button fit-content" onClick={handleUpArrow}>&#9650;</button>
              <button type="button" className="button fit-content" onClick={handleDownArrow}>&#9660;</button>
            </div>
          </div>
          <ol id="katasList flex f-column">
            {kataInfo.slice(displayStartIndex, displayStartIndex + displayCount).map((kata) => {
              return (
                <div
                  key={kata.id}
                  className={`flex f-space-between`}
                >
                  <li>{kata.name}</li>
                  <p>{kata.rank.name}</p>
                </div>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
