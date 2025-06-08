import React from "react";

interface TuningProps {
  tuning: number[];
  setTuning: (tuning: number[]) => void;
  dropTuning: boolean;
  setDropTuning: (state: boolean) => void;
}

const Tuning: React.FC<TuningProps> = ({
  tuning,
  setTuning,
  dropTuning,
  setDropTuning,
}) => {
  const shiftTuning = (delta: number) => {
    const newTuning = tuning.map((note, i) => {
      if (dropTuning && i === 2) return (tuning[0] + delta + 12) % 12; // preserve drop
      return (note + delta + 12) % 12;
    });
    setTuning(newTuning);
  };

  const toggleDrop = () => {
    if (dropTuning) {
      setTuning([4, 11, 7, 2, 9, 4]);
      setDropTuning(false);
    } else {
      const newTuning = [...tuning];
      newTuning[5] = tuning[3];
      setTuning(newTuning);
      setDropTuning(true);
    }
  };

  return (
    <div className="flex flex-col w-[20rem] h-[8rem] mx-auto mt-6 tracking-wide bg-white shadow-xl rounded-2xl border border-[#280606] font-baloo overflow-hidden">
      <h2 className="text-md font-bold py-3 px-3 border-b border-gray-200 bg-gray-50 text-center">
        Tuning Controls
      </h2>
      <div className="flex-1 flex gap-4 items-center justify-center text-lg">
        <button
          onClick={() => shiftTuning(1)}
          className=" text-[#380909c4] hover:text-[#280606] duration-200 ease-in-out font-semibold px-4 py-2 rounded-xl shadow-sm bg-gray-100 hover:bg-gray-200 cursor-pointer"
        >
          ↑
        </button>
        <button
          onClick={() => shiftTuning(-1)}
          className=" text-[#380909c4] hover:text-[#280606] duration-200 ease-in-out font-semibold px-4 py-2 rounded-xl shadow-sm bg-gray-100 hover:bg-gray-200 cursor-pointer"
        >
          ↓
        </button>
        <button
          onClick={toggleDrop}
          className=" text-[#380909c4] hover:text-[#280606] duration-200 ease-in-out font-semibold px-4 py-2 rounded-xl shadow-sm bg-gray-100 hover:bg-gray-200 cursor-pointer"
        >
          {dropTuning ? "Standard Tuning" : "Drop Tuning"}
        </button>
      </div>
    </div>
  );
};

export default Tuning;
