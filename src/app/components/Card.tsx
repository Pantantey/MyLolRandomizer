import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface CardProps {
  initialName: string;
  role: string;
  champion: { id: string; name: string; imageUrl: string } | null;
  isLocked: boolean;
  changeIcon: () => void;
  setRole: (newRole: string) => void;
}

const roleIcons = [
  "TopIcon.png",
  "JgIcon.png",
  "MidIcon.png",
  "AdcIcon.png",
  "SuppIcon.png",
  "FillIcon.png",
];

const colorCycle = [
  "bg-white",
  "bg-blue-500",
  "bg-green-500",
  "bg-pink-500",
  "bg-yellow-700",
];

export default function Card({
  initialName,
  role,
  champion,
  isLocked,
  changeIcon,
  setRole,
}: CardProps) {
  const [name, setName] = useState(initialName);

  const [cardColorIndex, setCardColorIndex] = useState(0);
  const [buttonColorIndex, setButtonColorIndex] = useState(1);

  const changeRole = () => {
    if (isLocked) return;
  
    const currentIndex = roleIcons.indexOf(role);
    const nextIndex = (currentIndex + 1) % roleIcons.length;
    const newRole = roleIcons[nextIndex];
  
    setRole(newRole); 
  };

  const handleFButtonClick = () => {
    setCardColorIndex(buttonColorIndex);
    setButtonColorIndex((prevIndex) => (prevIndex + 1) % colorCycle.length);
  };

  return (
    <div
      className={`flex flex-col w-[210px] border border-2 border-[#CBAB70] rounded-b-full ${colorCycle[cardColorIndex]}`}
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-lg font-bold py-3 bg-black text-white w-full text-center"
      />

      <div className="flex justify-center mt-4">
        <div className="flex flex-col items-center">
          {champion && (
            <>
              <Link href={`/champions/${champion.id}`} target="_blank">
                <Image
                  src={champion.imageUrl}
                  alt={champion.id}
                  width={100}
                  height={100}
                  className="hover:filter hover:brightness-50 transition-all"
                />
              </Link>
              <h3 className="text-lg font-bold text-black">{champion.name}</h3>
            </>
          )}
        </div>

        <button
          onClick={handleFButtonClick}
          className={`flex-end w-7 h-7 rounded-full ${colorCycle[buttonColorIndex]}`}
        />
      </div>

      <div className="flex justify-center pb-5 gap-2 h-[100] items-center">
        <div
          onClick={changeRole}
          className={`cursor-pointer ${isLocked ? "opacity-65" : ""}`}
        >
          <Image
            src={`/icons/${role}`}
            alt="RoleIcon"
            width={50}
            height={50}
            className="hover:opacity-80"
          />
        </div>

        <button onClick={changeIcon} className="cursor-pointer">
          <Image
            src="/Icons/LockIcon.png"
            alt="Lock Icon"
            width={25}
            height={25}
            className={`cursor-pointer p-1 rounded-lg ${
              isLocked ? "bg-blue-500" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}
