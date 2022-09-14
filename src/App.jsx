import "./style.css";
import { useState } from "react";
import { useEffect } from "react";
import { getUserData, getKataList, getAllCompletedKataByUser } from "./services/service.data";
import UserInputForm from "./components/UserInputForm";
import UserDataDashboard from "./components/UserDataDashboard";
import KatasList from "./components/KatasList";

function App() {
  const [userData, setUserData] = useState(null);
  const [userKataData, setUserKataData] = useState();
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

  async function handleKataData(username){
    const res = await getKataList(username);
    if (res){
      setUserKataData(res);
    }
  }

  function handleDisplayCount(number){
    setDisplayCount(number);
  }

  useEffect(() => {
    if (userData?.username){
      handleKataData(userData.username);
    }
  }, [userData]);

  return (
    <div className="flex f-column f-align-center">
      <h1>Code Wars Lookup</h1>
      {/* User Input */}
      <UserInputForm handleSubmit={handleInputUserSubmit} updateDisplayCount={handleDisplayCount} feedback={feedback}/>
      {/* User's "dashboard" data */}
      <UserDataDashboard user={userData}  />
      {/* Listed Data */}
      {userKataData? <KatasList displayCount={displayCount} kataData={userKataData}/> : <></>}
    </div>
  );
}

export default App;
