import React, { useEffect, useState } from "react";
import Home from "./Home";

const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
    console.log("hello");
  }, []);

  return (
    <div className="bg-black h-screen text-xl text-white font-bold">
      <p>{message}</p>
    </div>
  );
};

export default App;
