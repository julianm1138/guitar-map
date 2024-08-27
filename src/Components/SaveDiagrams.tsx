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

  // Toggles the visibility of the input field
  const toggleInputVisibility = () => {
    setInputIsVisible(!inputIsVisible);
  };

  // Handles the save action
  const handleSave = () => {
    if (diagramName) {
      onSave(diagramName);
      setDiagramName(""); // Clear input after saving
      setInputIsVisible(false); // Hide input field after saving
    } else {
      alert("Please enter a diagram name."); // Prompt user if input is empty
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
