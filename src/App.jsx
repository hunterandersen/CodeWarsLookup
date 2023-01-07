import "./style.css";
import { useState, useEffect } from "react";
import {
  getUserData,
  getAllCompletedKataByUser,
} from "./services/service.data";
import UserInputForm from "./components/UserInputForm";
import UserDataDashboard from "./components/UserDataDashboard";
import KatasList from "./components/KatasList";
import ListFilterForm from "./components/ListFilterForm";
import { useCallback } from "react";

function App() {
  const [userData, setUserData] = useState(null);
  //kataData should be an object with each looked-up username as a property with the fetched data as the value
  const [kataData, setKataData] = useState({});
  //Filter Options
  const [displayCount, setDisplayCount] = useState(20);
  const [filterOptions, setFilterOptions] = useState({
    ascending: true,
    displayCount: 20,
    kyuLevelChecked: [null, null, null, null, null, null, null, true]
  });
  const [feedback, setFeedback] = useState("Feedback");

  //I think this should be useCallback();
  async function handleInputUserSubmit(event, text) {
    event.preventDefault();
    const user = await getUserData(text);

    if (user?.username) {
      setUserData(() => user);
    } else {
      setFeedback("Couldn't retrieve user");
    }
  }

  const generateDisplayData = (kataData, userData, filterOptions) => {
    if (!filterOptions || !kataData || !userData) return null;
    console.log(filterOptions, kataData, userData);
    console.log(filterOptions.kyuLevelChecked);
    //Should return an array who's shape resembles ["3 kyu", "8 kyu", "5 kyu"]
    let kyuLevelsArr = filterOptions.kyuLevelChecked.map((kyu, ind) => {
      console.log(ind, kyu?.checked);
      if (kyu?.checked) {
        //String should match the shape of any given kata.rank.name value (ex: "6 kyu")
        return `${ind + 1} kyu`;
      }
      return null;
    })
    .filter((ele) => {
      console.log(ele);
      return ele
    }); //the filter is to get rid of the null values after mapping
    
    console.log(kyuLevelsArr);

    //Filter the data based on kyu level
    let displayData = kataData[userData.username].filter((kata) => {
      return kyuLevelsArr.includes(kata.rank.name);
    });

    //Sort the data ascending/descending
    displayData.sort((a, b) => {
      if (filterOptions.ascending) {
        return a.rank.id - b.rank.id;
      }
      return b.rank.id - a.rank.id;
    });
    console.log(displayData);
  };

  function handleFilterOptionsSubmit(options) {
    console.log(options);
    setFilterOptions((prevOptions) => Object.assign(prevOptions, options));
  }

  //I think this should be useCallback();
  function handleDisplayCount(number) {
    console.log("Updating display count");
    setDisplayCount(number);
  }

  async function updateKataData(username, totalCompleted) {
    let data = await getAllCompletedKataByUser(username, totalCompleted);
    //let data = await getKataTest(user);
    console.log("All Completed MEMOIZED Kata Data", data);
    if (data) {
      setKataData((prevKataData) => {
        //Update the object with the new property
        const newObj = { ...prevKataData };
        newObj[username] = data;
        console.log("Updating kataData state: ", newObj);
        return newObj;
      });
    }
  }

  useEffect(() => {
    if (userData?.username) {
      //Check for cached data first. If there's no cached data, then fetch the data
      if (!kataData || !Object.keys(kataData).includes(userData.username)) {
        updateKataData(
          userData.username,
          userData.codeChallenges.totalCompleted
        );
      }
    }
  }, [userData]);

  return (
    <div className="flex f-column f-align-center">
      <h1>Code Wars Lookup</h1>
      {/* User Input */}
      <UserInputForm
        handleSubmit={handleInputUserSubmit}
        updateDisplayCount={handleDisplayCount}
        feedback={feedback}
      />
      {/* User's "dashboard" data */}
      <UserDataDashboard user={userData} />
      <ListFilterForm submitChanges={handleFilterOptionsSubmit} />
      {/* Completed Katas List */}
      {userData?.username && Array.isArray(kataData[userData.username]) ? (
        <KatasList
          displayCount={displayCount}
          kataData={generateDisplayData(kataData, userData, filterOptions)}
        />
      ) : (
        <div>Loading Previous Katas...</div>
      )}
    </div>
  );
}

export default App;
