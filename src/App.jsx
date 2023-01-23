import "./style.css";
import { useState, useEffect } from "react";
import {
  getUserData,
  getAllCompletedKataByUser,
  getKataList,
} from "./services/service.data";
import UserInputForm from "./components/UserInputForm";
import UserDataDashboard from "./components/UserDataDashboard";
import KatasList from "./components/KatasList";
import ListFilterForm from "./components/ListFilterForm";
import { useCallback } from "react";
import { useQuery } from "react-query";

function App() {
  const [userSearchName, setUserSearchName] = useState("");
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

  //React Query
  const queriedUserData = useQuery(["userDataFetch", userSearchName], 
    ()=> getUserData(userSearchName), {enabled: !!userSearchName });
  const queriedKataData = useQuery(["kataDataFetch", userSearchName, queriedUserData.codeChallenges.totalCompleted], 
    ()=> updateKataData(queriedUserData.username, queriedUserData.codeChallenges.totalCompleted), {enabled: !!queriedUserData.username})

  //I think this should be useCallback();
  async function handleInputUserSubmit(event, userName) {
    event.preventDefault();
    //Setting the userSearchName will allow the first react-query to start fetching
    setUserSearchName(userName);

    //const user = await getUserData(text);

    // if (user?.username) {
    //   setUserData(() => user);
    // } else {
    //   setFeedback("Couldn't retrieve user");
    // }
  }

  function handleFilterOptionsSubmit(options) {
    console.log("Options update:", options);
    //setFilterOptions((prevOptions) => Object.assign(prevOptions, options));
    setFilterOptions((prevOptions) => {
      return {
        ...prevOptions,
        "kyuLevelChecked": options.kyuLevelChecked
      }
    });
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

  /* useEffect(() => {
    if (userData?.username) {
      //Check for cached data first. If there's no cached data, then fetch the data
      if (!kataData || !Object.keys(kataData).includes(userData.username)) {
        updateKataData(
          userData.username,
          userData.codeChallenges.totalCompleted
        );
      }
    }
  }, [userData]); */

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
      {queriedUserData.isIdle && <div>No username to search</div>}
      {queriedUserData.isLoading && <div>Loading Previous Katas...</div>}
      {queriedUserData.isError && <div>Error fetching username data</div>}
      {queriedUserData.isSuccess &&
        <KatasList
          displayCount={displayCount}
          kataData={kataData}
          userData={queriedUserData}
          filterOptions={filterOptions}
        />}
      {/* {userData?.username && Array.isArray(kataData[userData.username]) ? (
        <KatasList
          displayCount={displayCount}
          kataData={kataData}
          userData={queriedUserData}
          filterOptions={filterOptions}
        />
      ) : (
        <div>Loading Previous Katas...</div>
      )} */}
    </div>
  );
}

export default App;
