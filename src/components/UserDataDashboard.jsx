import React from "react";

export default function UserDataDashboard({ user }) {

  if (user) {
    return (
      <div className="user-dashboard flex f-column">
        <h1>{user.name}</h1>
        <h2>{user.username}</h2>
        <p>Honor: {user.honor}</p>
        <p>Rank: {user.ranks.overall.name}</p>
      </div>
    );
  }
  return <div className="user-dashboard">No user data to display</div>
}
