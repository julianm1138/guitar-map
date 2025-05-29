import React, { useState, useEffect, useRef } from "react";

const NUM_STRINGS = 6;
const NUM_FRETS = 24;

const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];
const STRING_TUNING = [4, 11, 7, 2, 9, 4];

const getFretPositions = (scaleLength: number, numFrets: number): number[] => {
  const positions: number[] = [];
  const totalLength = 1 - 1 / Math.pow(2, numFrets / 12);
  for (let i = 0; i < numFrets; i++) {
    const normalized = (1 - 1 / Math.pow(2, i / 12)) / totalLength;
    positions.push(normalized * scaleLength);
  }
  return positions;
};

function getNoteName(stringIndex: number, fretIndex: number): string {
  const baseNote = STRING_TUNING[stringIndex];
  const noteIndex = (baseNote + fretIndex + 1) % 12;
  return NOTE_NAMES[noteIndex];
}

export interface Dot {
  stringIndex: number;
  fretIndex: number;
}

export interface Diagram {
  name: string;
  id: number;
  data: Dot[];
}
interface FretboardProps {
  diagram: Dot[] | null;
  setDiagram: (dots: Dot[] | undefined) => void;
}

const Fretboard: React.FC<FretboardProps> = ({ diagram, setDiagram }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dots, setDots] = useState<Dot[]>(diagram || []);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [hoverNote, setHoverNote] = useState<{
    string: number;
    fret: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (diagram) setDots(diagram);
  }, [diagram]);

  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
      }
    };

    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);
    return () => window.removeEventListener("resize", updateContainerWidth);
  }, []);

  const fretPositions = getFretPositions(containerWidth * 0.99, NUM_FRETS);

  const stringSpacing = 41 / (NUM_STRINGS - 1);
  const baseOffset = 1;

  const toggleDot = (stringIndex: number, fretIndex: number) => {
    const index = dots.findIndex(
      (d) => d.stringIndex === stringIndex && d.fretIndex === fretIndex
    );
    const updated =
      index !== -1
        ? dots.filter(
            (d) => !(d.stringIndex === stringIndex && d.fretIndex === fretIndex)
          )
        : [...dots, { stringIndex, fretIndex }];

    setDots(updated);
    setDiagram(updated);
  };

  const handleFretClick = (stringIndex: number, fretIndex: number) => () => {
    toggleDot(stringIndex, fretIndex);
  };

  return (
    <div className="overflow-x-auto w-full">
      <div
        ref={containerRef}
        className="absolute flex flex-col justify-between items-center w-auto h-[44vh] bg-[#280606] shadow-[0_36px_92px_rgba(0,0,0,0.6)] mt-20"
        style={{ minWidth: "2100px" }}
      >
        {/* Strings */}
        {Array.from({ length: NUM_STRINGS }).map((_, i) => (
          <div
            key={i}
            className="absolute h-[5.5px] rounded-[30%] z-[5] bg-gradient-to-br from-[#646464] to-[#8b8b8b] shadow-[inset_2px_6px_0px_rgba(0,0,0,0.2),0px_-5px_7px_rgba(0,0,0,1.2)] pointer-events-none"
            style={{
              top: `calc(${baseOffset}vh + ${i * stringSpacing}vh)`,
              left: `0px`,
              width: `100%`,
            }}
          />
        ))}

        {/* Frets */}
        {fretPositions.map((left, i) => (
          <div
            key={i}
            className="absolute z-[4] rounded-sm"
            style={{
              left: `${left}px`,
              top: "0px",
              width: "10px",
              height: "44vh",
              borderRight: "1px solid #ccc",
              background: "linear-gradient(145deg, #474747, #616161)",
              boxShadow:
                "inset 6px 7px 3px rgb(235 235 235), 0 0 179px rgba(0, 0, 0, 0.3)",
              borderRadius: "2px",
            }}
          />
        ))}

        {/* Boundaries */}
        {Array.from({ length: NUM_STRINGS }).map((_, stringIndex) =>
          fretPositions.map((pos, fretIndex) => {
            const nextPos = fretPositions[fretIndex + 1] || containerWidth;
            const width = nextPos - pos;
            return (
              <div
                key={`${stringIndex}-${fretIndex}`}
                className="absolute z-[2] hover:bg-gradient-to-b from-[rgba(193,193,193,0.2)] to-[rgba(22,96,187,0.2)] hover:shadow-[0_0_10px_rgba(243,243,243,0.8),0_0_15px_rgba(189,193,197,0.6),0_0_45px_rgba(5,98,184,0.8)] rounded-[20%] cursor-pointer"
                style={{
                  top: `calc(${
                    baseOffset + 0.5 + stringIndex * stringSpacing
                  }vh`,
                  left: `${pos}px`,
                  width: `${width}px`,
                  height: "20px",
                  transform: "translateY(-50%)",
                }}
                onClick={handleFretClick(stringIndex, fretIndex)}
                onMouseEnter={() =>
                  setHoverNote({
                    string: stringIndex,
                    fret: fretIndex,
                    name: getNoteName(stringIndex, fretIndex),
                  })
                }
                onMouseMove={() =>
                  setHoverNote({
                    string: stringIndex,
                    fret: fretIndex,
                    name: getNoteName(stringIndex, fretIndex),
                  })
                }
                onMouseLeave={() => setHoverNote(null)}
              />
            );
          })
        )}

        {/* Fret Markers */}
        {[2, 4, 6, 8, 11].map((fretIndex) => {
          const pos = fretPositions[fretIndex];
          const next = fretPositions[fretIndex + 1] || containerWidth;
          const fretWidth = 10;
          const center = pos + fretWidth + (next - pos - fretWidth) / 2;
          const markerSize = 25;

          const isDouble = fretIndex === 11;

          return isDouble ? (
            <>
              <div
                key={`marker-${fretIndex}-1`}
                className="markers"
                style={{
                  top: `calc(${baseOffset + 1.2}vh + ${1 * stringSpacing}vh)`,
                  left: `${center}px`,
                  transform: "translate(-50%, -50%)",
                  width: `${markerSize}px`,
                  height: `${markerSize}px`,
                }}
              />
              <div
                key={`marker-${fretIndex}-2`}
                className="markers"
                style={{
                  top: `calc(${baseOffset + 1.2}vh + ${4 * stringSpacing}vh)`,
                  left: `${center}px`,
                  transform: "translate(-50%, -50%)",
                  width: `${markerSize}px`,
                  height: `${markerSize}px`,
                }}
              />
            </>
          ) : (
            <div
              key={`marker-${fretIndex}`}
              className="markers"
              style={{
                top: `calc(50% - ${markerSize / 20}px)`,
                left: `${center}px`,
                transform: "translate(-50%, -50%)",
                width: `${markerSize}px`,
                height: `${markerSize}px`,
              }}
            />
          );
        })}

        {/* Dots */}
        {dots.map(({ stringIndex, fretIndex }, i) => {
          const pos = fretPositions[fretIndex];
          const next = fretPositions[fretIndex + 1] || containerWidth;
          const fretWidth = 10;
          const center = pos + fretWidth + (next - pos - fretWidth) / 2;
          return (
            <div
              key={i}
              className="absolute z-[10] bg-gradient-to-b from-[#001f3f] to-[#0e4d92] rounded-full shadow-[0_0_10px_rgba(0,102,255,0.9)] border border-[#1971af] w-[35px] h-[35px] transform -translate-x-1/2 -translate-y-1/2 transition duration-100 ease-in-out cursor-pointer hover:shadow-[0_0_15px_rgba(0,150,255,1),0_0_30px_rgba(0,150,255,0.6)]"
              style={{
                top: ` calc(${baseOffset + 0.5}vh + ${
                  stringIndex * stringSpacing
                }vh`,
                left: `${center}px`,
              }}
              onMouseEnter={() =>
                setHoverNote({
                  string: stringIndex,
                  fret: fretIndex,
                  name: getNoteName(stringIndex, fretIndex),
                })
              }
              onMouseLeave={() => {
                setHoverNote(null);
              }}
              onClick={handleFretClick(stringIndex, fretIndex)}
            />
          );
        })}

        {/* Hover Note */}
        {hoverNote && (
          <div
            className="absolute text-white text-sm bg-black/70 px-2 py-1 rounded shadow-lg z-[9999]"
            style={{
              top: `calc(${baseOffset - 2}vh + ${
                hoverNote.string * stringSpacing
              }vh`,
              left: `${fretPositions[hoverNote.fret] + 30}px`,
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            {hoverNote.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default Fretboard;
