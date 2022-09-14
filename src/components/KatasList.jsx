import React from "react";
import { useState, useEffect } from "react";

export default function KatasList({ kataData, displayCount }) {
  const [kataInfo, setKataInfo] = useState();

  async function getKataInfo(searchArr) {
    let kataPromises = [];
    for (const kata of searchArr) {
      kataPromises.push(
        fetch(`https://www.codewars.com/api/v1/code-challenges/${kata.id}`)
      );
    }
    let results = await Promise.allSettled(kataPromises);
    const kataFulfilled = [];
    for (const result of results) {
      if (result?.status === "fulfilled") {
        kataFulfilled.push(result.value.json());
      } else {
        console.log(result);
        //do something with the rejected fetch requests
      }
    }
    let data = await Promise.allSettled(kataFulfilled);
    setKataInfo(data);
  }

  useEffect(() => {
    getKataInfo(kataData.data.slice(0, displayCount));
  }, [kataData, displayCount]);

  return (
    <div className="container">
      <h1 className="m-auto" style={{ textAlign: "center" }}>
        Previous Katas
      </h1>
      {kataData?.data && (
        <div className="list-control flex f-column">
          <div className="flex f-space-between">
            <h2>Total Katas: {kataData.totalItems}</h2>
            <div>
              <button className="button fit-content">&#9650;</button>
              <button className="button fit-content">&#9660;</button>
            </div>
          </div>
          <ol id="katasList flex f-column">
            {kataData.data.slice(0, displayCount).map((kata, ind) => {
              if (kataInfo?.length > ind && kata.id == kataInfo[ind].value.id) {
                return (
                  <div
                    key={kata.id}
                    className={`flex f-space-between -${kataInfo[ind].value.rank.color}`}
                  >
                    <li>{kata.name}</li>
                    <p>{kataInfo[ind].value.rank.name}</p>
                  </div>
                );
              }
              return <li key={kata.id}>{kata.name}</li>;
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
