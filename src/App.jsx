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
import { useQuery } from "react-query";

function App() {
  const [userSearchName, setUserSearchName] = useState("");
  //const [userData, setUserData] = useState(null);
  //kataData should be an object with each looked-up username as a property with the fetched data as the value
  //const [kataData, setKataData] = useState({});
  //Filter Options
  const [displayCount, setDisplayCount] = useState(20);
  const [filterOptions, setFilterOptions] = useState({
    ascending: true,
    displayCount: 20,
    kyuLevelChecked: [null, null, null, null, null, null, null, true],
  });
  const [feedback, setFeedback] = useState("Feedback");

  //React Query
  const queriedUserData = useQuery(
    ["userDataFetch", userSearchName],
    () => getUserData(userSearchName),
    { enabled: !!userSearchName,
      refetchOnWindowFocus:false
    }
  );

  const queriedKataData = useQuery(
    ["kataDataFetch", userSearchName],
    () =>
      updateKataData(
        queriedUserData.data.username,
        queriedUserData.data.codeChallenges.totalCompleted
      ),
    { enabled: !!queriedUserData?.data?.username, 
      refetchOnWindowFocus:false,
    }
  );

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
        kyuLevelChecked: options.kyuLevelChecked,
      };
    });
  }

  //I think this should be useCallback();
  function handleDisplayCount(number) {
    console.log("Updating display count");
    setDisplayCount(number);
  }

  async function updateKataData(username, totalCompleted) {
    let data = await getAllCompletedKataByUser(username, totalCompleted);
    return data;
  }

  console.log(queriedUserData);

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
      {(queriedUserData.isSuccess && queriedUserData.data.success === false) && <div style={{color: "red"}}>{queriedUserData.data.reason}</div>}
      {(queriedUserData.isSuccess && queriedUserData.data.success != false) && (
        <UserDataDashboard user={queriedUserData.data} />
      )}
      <ListFilterForm submitChanges={handleFilterOptionsSubmit} />
      {/* Completed Katas List */}
      {queriedKataData.isIdle && <div>No username to search for katas</div>}
      {queriedKataData.isLoading && <div>Loading Previous Katas...</div>}
      {queriedKataData.isError && <div>Error fetching kata data</div>}
      {queriedKataData.isSuccess && (
        <KatasList
          displayCount={displayCount}
          kataData={queriedKataData.data}
          userData={queriedUserData.data}
          filterOptions={filterOptions}
        />
      )}
    </div>
  );
}

export default App;
