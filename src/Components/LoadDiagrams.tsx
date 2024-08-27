import React from "react";
import "../assets/styles/interface.css";

// Define types for the diagram and props
interface Diagram {
  name: string;
  dots: Array<{ top: string; left: string }>;
}

interface LoadDiagramsProps {
  savedDiagrams: Diagram[];
  onDelete: (index: number) => void;
  onLoad: (diagram: Diagram) => void;
  onSwitch: () => void;
}

const LoadDiagrams: React.FC<LoadDiagramsProps> = ({
  savedDiagrams,
  onDelete,
  onLoad,
  onSwitch,
}) => {
  return (
    <div className="interface-container">
      <button className="switch-button" onClick={onSwitch}>
        Go Back
      </button>
      {savedDiagrams.length > 0 ? (
        <ul>
          {savedDiagrams.map((diagram, index) => (
            <li key={index} className="saved-diagram-item">
              <span>{diagram.name}</span>
              <button className="load-button" onClick={() => onLoad(diagram)}>
                Load
              </button>
              <button className="delete-button" onClick={() => onDelete(index)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="load-description">No diagrams saved.</p>
      )}
    </div>
  );
};

export default LoadDiagrams;
