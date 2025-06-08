import { BrowserRouter, Routes, Route } from "react-router-dom";
import Fretboard from "./components/Fretboard";
import LandingPage from "./components/LandingPage";
import SaveDiagramButton from "./components/SaveDiagramButton";
import DiagramList from "./components/DiagramList";
import Tuning from "./components/Tuning";
import { useState } from "react";
import Header from "./components/Header";
import type { Dot } from "./components/Fretboard";

function App() {
  const [currentDiagram, setCurrentDiagram] = useState<Dot[] | null>(null);
  const [diagramListKey, setDiagramListKey] = useState(0);
  const [tuning, setTuning] = useState<number[]>([4, 11, 7, 2, 9, 4]); // E Standard
  const [dropTuning, setDropTuning] = useState<boolean>(false);

  const triggerRefresh = () => setDiagramListKey((prev) => prev + 1);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/app"
          element={
            <>
              <Header />
              <Fretboard
                diagram={currentDiagram}
                setDiagram={(dots) => setCurrentDiagram(dots ?? null)}
                tuning={tuning}
              />

              <div className="flex gap-20 fixed bottom-2 right-[8%] top-[57%]">
                <Tuning
                  tuning={tuning}
                  setTuning={setTuning}
                  dropTuning={dropTuning}
                  setDropTuning={setDropTuning}
                />
                <DiagramList
                  key={diagramListKey}
                  onLoadDiagram={(diagram) =>
                    setCurrentDiagram(diagram ?? null)
                  }
                />

                <div className="flex items-start mt-59">
                  <SaveDiagramButton
                    diagram={currentDiagram}
                    onSave={triggerRefresh}
                  />
                </div>
              </div>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
