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
          method: "GET",
          credentials: "include", // Request for cookies
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched user data:", data);
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

  const handleSave = async (name: string) => {
    try {
      const response = await fetch("http://localhost:5000/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dots: currentDiagram }),
        credentials: "include",
      });
      if (response.ok) {
        console.log("Diagram saved successfully");
        const savedData = await response.json();
        setSavedDiagrams((prevDiagrams) => [...prevDiagrams, savedData]);
      } else {
        console.error("Failed to save diagram");
      }
    } catch (error) {
      console.error("Error during save", error);
    }
  };

  const handleDelete = async (index: number) => {
    try {
      const diagramToDelete = savedDiagrams[index];
      const response = await fetch(`http://localhost:5000/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Diagram deleted successfully");
        setSavedDiagrams((prevDiagrams) =>
          prevDiagrams.filter((_, i) => i !== index)
        );
      } else {
        console.error("Failed to delete diagram");
      }
    } catch (error) {
      console.error("Error during delete:", error);
    }
  };

  const handleLoad = async (diagram: Diagram) => {
    try {
      const response = await fetch("http://localhost:5000/load", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentDiagram(data.dots);
      } else {
        console.error("Failed to load diagram");
      }
    } catch (error) {
      console.error("Error during diagram load:", error);
    }
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
          savedDiagrams={savedDiagrams}
          onDelete={handleDelete}
          onLoad={handleLoad}
          onSwitch={() => setShowSave(true)}
        />
      )}
    </div>
  );
};

export default App;
