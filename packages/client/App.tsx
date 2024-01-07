import React, { useEffect, useState } from "react";
import Home from "./pages/Home";
import { map } from "lodash";
import Palette from "./assets/palette.png";

function App() {
  const [message, setMessage] = useState([]);

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data));
  }, []);

  console.log("message: ", message);

  return (
    <div className="bg-black h-screen text-xl text-white font-bold">
      <img alt="palette-rand" src={Palette} />
      <Home />
      <p>
        {map(message, (item, index) => {
          return <span key={index}>{item.email}</span>;
        })}
      </p>
    </div>
  );
}

export default App;
