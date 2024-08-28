import React, { useState } from "react";
import "../assets/styles/interface.css";

// Define types for the props
interface SaveDiagramsProps {
  onSave: (name: string) => void;
  onSwitch: () => void;
}

const SaveDiagrams: React.FC<SaveDiagramsProps> = ({ onSave, onSwitch }) => {
  const [diagramName, setDiagramName] = useState<string>("");
  const [inputIsVisible, setInputIsVisible] = useState<boolean>(false);

  const toggleInputVisibility = () => {
    setInputIsVisible(!inputIsVisible);
  };

  const handleSave = () => {
    if (diagramName) {
      onSave(diagramName);
      setDiagramName("");
      setInputIsVisible(false);
    } else {
      alert("Please enter a diagram name.");
    }
  };

  return (
    <div className="interface-container">
      {inputIsVisible ? (
        <div>
          <input
            type="text"
            value={diagramName}
            onChange={(e) => setDiagramName(e.target.value)}
            placeholder="Enter name for your diagram"
          />
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
          <button className="save-button-alt" onClick={toggleInputVisibility}>
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <button className="save-button" onClick={toggleInputVisibility}>
            Save Diagram
          </button>
          <button className="menu-load-button" onClick={onSwitch}>
            Load Diagrams
          </button>
        </div>
      )}
    </div>
  );
};

export default SaveDiagrams;
