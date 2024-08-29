import React, { useState } from "react";
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
  const [showSave, setShowSave] = useState<boolean>(true);
  const [savedDiagrams, setSavedDiagrams] = useState<Diagram[]>([]);
  const [currentDiagram, setCurrentDiagram] = useState<
    Array<{ top: string; left: string }>
  >([]);

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
