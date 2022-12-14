export async function getUserData(username){
    try {
        let res = await fetch(`https://www.codewars.com/api/v1/users/${username}`);
        let data = await res.json();
        //console.log("Fetch Results:", data);
        return data;
    } catch(error){
        console.log("getUserData:Fetching error");
        console.error(error);
    }
    return null;
}

export async function getKataList(username, page = 0){
    try{
        let res = await fetch(`https://www.codewars.com/api/v1/users/${username}/code-challenges/completed?page=${page}`);
        let data = await res.json();
        return data;
    }catch(error){
        console.log("getKataList:Fetching error");
        console.error(error);
    }
    return null;
}

export async function getAllCompletedKataByUser(username, totalCompleted) {
    if (!username || !totalCompleted){ 
      console.log("Invalid username or totalCompleted", username, totalCompleted);
      return null;
    };

    //CodeWars' API returns 200 completed challenges per API request, offset by the page count. (200/page)
    const numPerPage = 200;
    const kataPages = [];

    //If the user has completed ANY challenges
    if (totalCompleted > 0){
        //Continue fetching each page necessary to find all the user's completed challenges
        for (let page = 0; page <= Math.floor(totalCompleted/numPerPage); page++){
            //Store all of the promises in an array
            kataPages.push(getKataList(username, page));
        }
    }else{
        //Return a falsy value that signifies that the user has no completed challenges
        console.log("That user has not completed any challenges");
        return -1;
    }
    const listOfKatasPromises = await Promise.allSettled(kataPages);
    //Now I want to extract the data from the fulfilled promises
    //listOfKatasPromises[0].value.data;
    let listOfKatas = [];
    for (const arr of listOfKatasPromises){
      listOfKatas = listOfKatas.concat(arr.value.data);
    }
    if (!listOfKatas) return null;
    //Now we should have a list of all the completed katas inside of ``listOfKatas``
    //and can now use that list to get the information about each specific kata

    let kataPromises = [];
    //Build a list of promises for all the fetch requests
    for (const kata of listOfKatas) {
      kataPromises.push(
        fetch(`https://www.codewars.com/api/v1/code-challenges/${kata.id}`)
      );
    }
    //Wait for all of those promises to finish (fulfilled or not)
    let results = await Promise.allSettled(kataPromises);
    const kataFulfilled = [];
    //Build a list of the fulfilled promises and turn them to json
    for (const result of results) {
      if (result?.status === "fulfilled") {
        kataFulfilled.push(result.value.json());
      } else {
        console.log("Rejected kata request", result);
        //do something with the rejected fetch requests
      }
    }
    
    //Wait for all the promsises to have been turned to json
    let data = await Promise.allSettled(kataFulfilled);
    //Now that the information has been parsed to json, we want to extract and return the value properties, 
    //which hold all the actual kata info that we want
    return data.map((item) => item.value);
  }