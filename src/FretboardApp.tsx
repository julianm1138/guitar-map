import React, { useState, useEffect } from "react";
import Fretboard from "./Components/Fretboard";
import DotToggle from "./Components/Dots";
import SaveDiagrams from "./Components/SaveDiagrams";
import LoadDiagrams from "./Components/LoadDiagrams";

import "./assets/styles/Fretboard.css";

import "./index.css";

// Define types for the diagrams
interface Diagram {
  name: string;
  dots: Array<{ top: string; left: string }>;
}

const App: React.FC = () => {
  const [user, setUser] = useState<string>("");
  const [showSave, setShowSave] = useState<boolean>(true);
  const [savedDiagrams, setSavedDiagrams] = useState<Diagram[]>([]);
  const [currentDiagram, setCurrentDiagram] = useState<
    Array<{ top: string; left: string }>
  >([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/secure", {
          //client says: server, I need this stuff
          method: "GET",
          credentials: "include", //request for cookies
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          console.log("Fetched user:", data.username);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  const handleSave = (name: string) => {
    // Save diagram logic
    setSavedDiagrams((prevDiagrams) => [
      ...prevDiagrams,
      { name, dots: [...currentDiagram] },
    ]);
  };

  const handleDelete = (index: number) => {
    // Delete diagram logic
    setSavedDiagrams((prevDiagrams) =>
      prevDiagrams.filter((_, i) => i !== index)
    );
  };

  const handleLoad = (diagram: Diagram) => {
    // Load diagram logic
    setCurrentDiagram(diagram.dots);
  };

  return (
    <div className="hero">
      <h1>FretMap</h1>
      {user && <div className="user-display">{user}</div>}
      <Fretboard />
      <DotToggle top="0px" left="0px" />
      <DotToggle top="-54px" left="0px" />
      <DotToggle top="-105px" left="0px" />
      <DotToggle top="-156px" left="0px" />
      <DotToggle top="-205px" left="0px" />
      <DotToggle top="-257px" left="0px" />
      {showSave ? (
        <SaveDiagrams onSave={handleSave} onSwitch={() => setShowSave(false)} />
      ) : (
        <LoadDiagrams
          savedDiagrams={savedDiagrams} // props can take state or functions
          onDelete={handleDelete}
          onLoad={handleLoad}
          onSwitch={() => setShowSave(true)}
        />
      )}
    </div>
  );
};

export default App;
