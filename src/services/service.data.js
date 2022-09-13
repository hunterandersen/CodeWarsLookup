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

export async function getKataList(username, page=0){
    try{
        let res = await fetch(`https://www.codewars.com/api/v1/users/${username}/code-challenges/completed?page=${page}`);
        let data = await res.json();
        //console.log("Fetch Results:", data)
        return data;
    }catch(error){
        console.log("getKataList:Fetching error");
        console.error(error);
    }
    return null;
}

// export async function getKata(id){
//     try{
//         let res = await fetch(`https://www.codewars.com/api/v1/code-challenges/${id}`);
//         let data = await res.json();
//         console.log("Fetch Results:", data);
//         return data;
//     }catch(error){
//         console.log("getKata:Fetching error");
//         console.error(error);
//     }
//     return null;
// }