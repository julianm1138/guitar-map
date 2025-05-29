import { BrowserRouter, Routes, Route } from "react-router-dom";
import Fretboard from "./components/Fretboard";
import LandingPage from "./components/LandingPage";
import SaveDiagramButton from "./components/SaveDiagramButton";
import DiagramList from "./components/DiagramList";
import { useState } from "react";
import Header from "./components/Header";
import type { Dot } from "./components/Fretboard";

function App() {
  const [currentDiagram, setCurrentDiagram] = useState<Dot[] | null>(null);
  const [diagramListKey, setDiagramListKey] = useState(0);

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
              />

              <div className="flex gap-40 fixed bottom-2 right-[18%] top-[57%]">
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
