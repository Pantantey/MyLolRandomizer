import React, { useState } from "react";
import Image from "next/image";

interface CardProps {
  initialName: string;
  imageName: string;
  description: string;
}

export default function Card({
  initialName,
  imageName,
  description,
}: CardProps) {
  const [name, setName] = useState(initialName);
  const [kills, setKills] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [assists, setAssists] = useState(0);

  return (
    <div className="bg-white flex flex-col w-[210px] border border-2 border-[#CBAB70] rounded-b-full">
      <div className="flex flex-col items-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-lg font-bold py-3 bg-black text-white w-full text-center"
        />
        <Image
          src={`/icons/${imageName}`}
          alt={name}
          width={128}
          height={128}
          className="w-12 h-12 object-cover rounded-md mt-5"
        />
        <p className="text-sm font-semibold text-gray-700 text-center mt-3">
          {description}
        </p>
      </div>

      <div className="text-black font-semibold mt-5">
        {/* Contador de Asesinatos */}
        <div className="flex justify-between items-center">
          <h2>Más Asesinatos:</h2>
          <div className="flex items-center">
            <button
              onClick={() => setKills((prev) => Math.max(0, prev - 1))}
              className="px-2 bg-gray-300 rounded-l"
            >
              -
            </button>
            <span className="px-3">{kills}</span>
            <button
              onClick={() => setKills((prev) => prev + 1)}
              className="px-2 bg-gray-300 rounded-r"
            >
              +
            </button>
          </div>
        </div>

        {/* Contador de Muertes */}
        <div className="flex justify-between items-center my-2">
          <h2>Más Muertes:</h2>
          <div className="flex items-center">
            <button
              onClick={() => setDeaths((prev) => Math.max(0, prev - 1))}
              className="px-2 bg-gray-300 rounded-l"
            >
              -
            </button>
            <span className="px-3">{deaths}</span>
            <button
              onClick={() => setDeaths((prev) => prev + 1)}
              className="px-2 bg-gray-300 rounded-r"
            >
              +
            </button>
          </div>
        </div>

        {/* Contador de Asistencias */}
        <div className="flex justify-between items-center mb-5">
          <h2>Más Asistencias:</h2>
          <div className="flex items-center">
            <button
              onClick={() => setAssists((prev) => Math.max(0, prev - 1))}
              className="px-2 bg-gray-300 rounded-l"
            >
              -
            </button>
            <span className="px-3">{assists}</span>
            <button
              onClick={() => setAssists((prev) => prev + 1)}
              className="px-2 bg-gray-300 rounded-r"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mb-6">
        <Image
          src={`/icons/${imageName}`}
          alt={name}
          width={128}
          height={128}
          className="w-12 h-12 object-cover rounded-md mt-5"
        />
      </div>
    </div>
  );
}
