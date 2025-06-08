import { useEffect, useState } from "react";
import { loadDiagrams, deleteDiagram } from "../diagramService";
import type { Diagram, Dot } from "./Fretboard";

interface Props {
  onLoadDiagram: (diagram: Dot[]) => void;
}

export default function DiagramList({ onLoadDiagram }: Props) {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);

  const refresh = async () => {
    const { data, error } = await loadDiagrams();
    setDiagrams(!error && data ? data : []);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="flex flex-col w-[30rem] h-[16rem] mx-auto mt-6 tracking-wide bg-white shadow-xl rounded-2xl border-1 font-baloo border-[#280606] overflow-hidden">
      <h2 className="text-md font-bold py-3 px-3 border-b border-gray-200 bg-gray-50 text-center">
        Your Diagrams
      </h2>

      <div className="flex-1 overflow-y-auto h-full px-8 py-3 space-y-5 text-2xl">
        {diagrams.length === 0 ? (
          <div className="flex justify-center h-full items-center text-gray-400 text-3xl">
            No diagrams saved
          </div>
        ) : (
          diagrams.map((d) => (
            <div
              key={d.id}
              className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 font-semibold transition-colors p-3 rounded-xl shadow-sm "
            >
              <span>
                {(d.name || "Unnamed Diagram").slice(0, 20)}
                {d.name?.length && d.name.length > 9 ? "…" : ""}
              </span>
              <div className="flex gap-12">
                <button
                  onClick={() => onLoadDiagram(d.data)}
                  className="text-[#380909c4] hover:text-[#280606]  duration-200 ease-in-out"
                >
                  Load
                </button>
                <button
                  onClick={() => deleteDiagram(d.id).then(refresh)}
                  className="text-[#380909c4] hover:text-[#280606]  duration-200 ease-in-out"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
