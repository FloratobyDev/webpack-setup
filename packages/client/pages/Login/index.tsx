import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@client/contexts/AuthProvider";

/**
 * We would like to be able to login with GITHUB
 * Once we login, we redirect to the journal page
 * If we are not logged in, we redirect to the login page
 * We will use JWT to authenticate the user
 * To persist the user, we will use a cookie
 * If there's a cookie, we will check if the user is authenticated
 * If not, we will redirect to the login page
 */

function Login() {
  const [users, setUsers] = useState([]);
  const { setCurrentUser, isVerified } = useAuth();

  const authorizeApp = () => {
    const clientID = "Iv1.d6f08907cca5eef0"; // Replace with your actual client ID
    const redirectUri = encodeURIComponent(
      "http://localhost:4242/auth/authorize",
    );
    const scope = "repo";
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = githubAuthUrl;
  };

  const addUser = () => {
    axios
      .post("api/adduser", {
        username: "testuser",
        password: "testpassword",
      })
      .then((res) => {
        setUsers([...users, ...res.data]);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (!isVerified)
    return (
      <div className=" bg-primary-black h-screen flex items-center justify-center text-white">
        <h1>Not Authorized</h1>
        <button onClick={authorizeApp}>Authorize</button>
      </div>
    );

  return (
    <div className=" bg-primary-black h-screen flex items-center justify-center text-white">
      {/* <button onClick={authorizeApp}>Authorize</button> */}
      <button onClick={addUser}>Add User</button>
      {users.map((user) => {
        return <p key={user.name}>{user.name}</p>;
      })}
    </div>
  );
}

export default Login;
