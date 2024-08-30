import React, { useState, useRef, MutableRefObject } from "react";
import "../assets/styles/Fretboard.css";

interface DotToggleProps {
  top: string;
  left: string;
}

const DotToggle: React.FC<DotToggleProps> = ({ top, left }) => {
  const [dot, setDot] = useState<boolean[]>(Array(24).fill(false));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [diagramName, setDiagramName] = useState<string>("");
  const [savedDiagrams, setSavedDiagrams] = useState<
    { name: string; dots: boolean[] }[]
  >([]);
  const boundaries = Array.from({ length: 24 }, (_, index) => index);
  const refs = useRef<(HTMLDivElement | null)[]>(Array(24).fill(null));

  const handleClick = (index: number) => {
    setDot((prevDot) => {
      const newDots = [...prevDot];
      newDots[index] = !newDots[index];
      return newDots;
    });
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick(index);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      moveFocus(index, 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveFocus(index, -1);
    }
  };

  const moveFocus = (currentIndex: number, direction: number) => {
    const newIndex = Math.max(0, Math.min(23, currentIndex + direction));
    setFocusedIndex(newIndex);

    if (refs.current[newIndex]) {
      refs.current[newIndex]?.focus({ preventScroll: true });
    }
  };

  return (
    <div
      className="dots-instance"
      style={{ position: "absolute", top: top, left: left }}
    >
      {boundaries.map((index) => (
        <div
          key={index}
          className={`boundary boundary-${index}`}
          tabIndex={0}
          onClick={() => handleClick(index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (refs.current[index] = el)}
        >
          {dot[index] && (
            <div
              className="dot"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default DotToggle;
