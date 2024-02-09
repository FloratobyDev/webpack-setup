import React, { useState } from "react";
import API from "@client/api";
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
      "https://git-journal-backend.onrender.com/auth/authorize",
    );
    const scope = "repo";
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = githubAuthUrl;
  };

  const addUser = () => {
    API
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
      <div className=" bg-primary-black h-screen flex flex-col items-center justify-center text-white">
        {/* <p className="text-2xl">Welcome to</p> */}
        <h1 className="text-primary-yellow text-8xl">
          GIT<span className="italic text-paragraph">Reflect</span>
        </h1>
        <button
          className="duration-500 transition-all px-4 py-2 hover:bg-primary-yellow hover:text-primary-black text-primary-yellow border border-primary-yellow font-medium rounded-smd mt-8"
          onClick={authorizeApp}
        >
          Go to App
        </button>
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
