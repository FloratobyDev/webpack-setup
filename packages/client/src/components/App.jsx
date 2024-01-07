import React, { useEffect } from "react";
import NewFile from "./NewFile";

const App = () => {
  // useEffect(() => {
  //   fetch("/api/hello")
  //     .then((res) => res.json())
  //     .then((data) => console.log(data));
  //   console.log('hello'); 
  // }, []);

  return (
    <div className="bg-black h-screen text-xl text-white font-bold">
      <NewFile />
      <p>App Dev</p>
      <p>App Dev</p>
      <p>App Dev</p>
      <p>App Dev</p>
    </div>
  );
};

export default App;
