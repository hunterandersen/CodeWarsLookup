import "./style.css";
import { useState } from "react";
import { getUserData, getAllCompletedKataByUser } from "./services/service.data";
import UserInputForm from "./components/UserInputForm";
import UserDataDashboard from "./components/UserDataDashboard";
import KatasList from "./components/KatasList";
import { useMemo } from "react";

function App() {
  const [userData, setUserData] = useState(null);
  const [displayCount, setDisplayCount] = useState(20);
  const [feedback, setFeedback] = useState("Feedback");

  async function handleInputUserSubmit(event, text) {
    event.preventDefault();
    const user = await getUserData(text);

    if (user?.username) {
      setUserData(() => user);
    } else {
      setFeedback("Couldn't retrieve user");
    }
  }

  function handleDisplayCount(number){
    setDisplayCount(number);
  }

  //The function for useMemo to call
  async function getUserKataData(username){
    let data = await getAllCompletedKataByUser(username);
    console.log("All Completed Kata Data", data);
    return data;
  }

  //Turn this into useMemo
  //const [userKataData, setUserKataData] = useState();
  const memoizedKataData = useMemo(() => getUserKataData(userData.username), [userData]);

  // async function handleKataData(username){
  //   const res = await getKataList(username);
  //   if (res){
  //     setUserKataData(res);
  //   }
  // }

  // useEffect(() => {
  //   if (userData?.username){
  //     handleKataData(userData.username);
  //   }
  // }, [userData]);

  return (
    <div className="flex f-column f-align-center">
      <h1>Code Wars Lookup</h1>
      {/* User Input */}
      <UserInputForm handleSubmit={handleInputUserSubmit} updateDisplayCount={handleDisplayCount} feedback={feedback}/>
      {/* User's "dashboard" data */}
      <UserDataDashboard user={userData}  />
      {/* Listed Data */}
      {memoizedKataData && <KatasList displayCount={displayCount} kataData={memoizedKataData}/>}
    </div>
  );
}

export default App;
