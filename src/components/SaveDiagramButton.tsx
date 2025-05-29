import { useState } from "react";
import { saveDiagram } from "../diagramService";

interface Props {
  diagram: unknown;
  onSave?: () => void;
}

export default function SaveDiagramButton({ diagram, onSave }: Props) {
  const [name, setName] = useState("");

  const handleSave = async () => {
    if (!name) return alert("Name required.");
    const { error } = await saveDiagram(diagram, name);
    if (error) alert("Failed to save.");
    else {
      setName("");
      onSave?.();
    }
  };

  return (
    <div className="flex gap-2 items-center text-2xl relative">
      <input
        className="border p-1 rounded font-baloo"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="bg-[#280606] text-white px-3 py-1 rounded font-baloo cursor-pointer"
      >
        Save
      </button>
    </div>
  );
}
