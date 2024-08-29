import React from "react";

import "../assets/styles/Fretboard.css";

const Fretboard: React.FC = () => {
  const fretWire: number[] = Array.from(
    { length: 25 },
    (_, index) => index + 1
  );
  const markers: number[] = Array.from({ length: 10 }, (_, index) => index + 1);

  return (
    <div className="fretboard-container">
      <div className="frets-container">
        {fretWire.map((fretNumber) => (
          <div key={fretNumber} className={`fret fret-${fretNumber}`}></div>
        ))}
      </div>
      <div className="marker-container">
        {markers.map((markerNumber) => (
          <div
            key={markerNumber}
            className={`markers marker-${markerNumber}`}
          ></div>
        ))}
      </div>
      <div className="fretboard">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="string"></div>
        ))}
      </div>
    </div>
  );
};

export default Fretboard;
