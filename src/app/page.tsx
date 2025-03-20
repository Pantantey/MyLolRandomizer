"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/app/components/Header";
import Card from "./components/Card";

const icons = ["TopIcon.png", "JgIcon.png", "MidIcon.png", "AdcIcon.png", "SuppIcon.png", "FillIcon.png"];
const rolesMap: Record<string, string | null> = {
  "TopIcon.png": "Top",
  "JgIcon.png": "Jg",
  "MidIcon.png": "Mid",
  "AdcIcon.png": "Adc",
  "SuppIcon.png": "Supp",
  "FillIcon.png": null,
};


type Champion = {
  id: string;
  name: string;
  image: { full: string };
};

type ChampionRoles = {
  [key: string]: {
    id: string;
    roles: string[];
  };
};

export default function Home() {
  const version = '15.6.1'
  const [cards, setCards] = useState([
    { id: 1, name: "Player1", imageName: "MidIcon.png", description: "Campeón" },
  ]);
  const [randomChampion, setRandomChampion] = useState<{ name: string; imageUrl: string } | null>(null);
  const [iconIndex, setIconIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [championRoles, setChampionRoles] = useState<ChampionRoles | null>(null);

  useEffect(() => {
    if (championRoles) {
      generateRandomChampion();
    }
  }, [championRoles]);

  useEffect(() => {
    const fetchChampionRoles = async () => {
      try {
        const response = await fetch("/data/championData.json");
        const data: ChampionRoles = await response.json();
        setChampionRoles(data);
      } catch (error) {
        console.error("Error fetching champion role data:", error);
      }
    };
    fetchChampionRoles();
  }, []);

  const addCard = () => {
    if (cards.length < 5) {
      setCards((prevCards) => [
        ...prevCards,
        {
          id: prevCards.length + 1,
          name: `Player${prevCards.length + 1}`,
          imageName: "MidIcon.png",
          description: "Campeon",
        },
      ]);
    }
  };

  const removeCard = () => {
    if (cards.length > 1) {
      setCards((prevCards) => prevCards.slice(0, -1));
    }
  };

  const generateRandomChampion = async () => {
    try {
      const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`);
      const data = await response.json();
      const champions = Object.values(data.data) as Champion[];
  
      if (!championRoles) return;
  
      if (!isLocked) {
        // Filtrar los íconos para que no incluya FillIcon
        const filteredIcons = icons.filter((icon) => icon !== "FillIcon.png");
        const randomIconIndex = Math.floor(Math.random() * filteredIcons.length);
        const selectedIcon = filteredIcons[randomIconIndex];
  
        setIconIndex(icons.indexOf(selectedIcon)); // Buscar el índice correcto en la lista original
  
        setTimeout(() => {
          const selectedRole = rolesMap[selectedIcon];
  
          let filteredChampions: Champion[];
          if (selectedRole) {
            filteredChampions = champions.filter((champion) => {
              const champData = championRoles[champion.id];
              return champData && champData.roles.includes(selectedRole);
            });
          } else {
            filteredChampions = champions;
          }
  
          if (filteredChampions.length > 0) {
            const randomChampion = filteredChampions[Math.floor(Math.random() * filteredChampions.length)];
            setRandomChampion({
              name: randomChampion.name,
              imageUrl: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${randomChampion.image.full}`,
            });
          } else {
            console.warn("No champions found for role", selectedRole);
          }
        }, 0);
      } else {
        const selectedIcon = icons[iconIndex];
        const selectedRole = rolesMap[selectedIcon];
  
        let filteredChampions: Champion[];
        if (selectedRole) {
          filteredChampions = champions.filter((champion) => {
            const champData = championRoles[champion.id];
            return champData && champData.roles.includes(selectedRole);
          });
        } else {
          filteredChampions = champions;
        }
  
        if (filteredChampions.length > 0) {
          const randomChampion = filteredChampions[Math.floor(Math.random() * filteredChampions.length)];
          setRandomChampion({
            name: randomChampion.name,
            imageUrl: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${randomChampion.image.full}`,
          });
        } else {
          console.warn("No champions found for role", selectedRole);
        }
      }
    } catch (error) {
      console.error("Error fetching champion data:", error);
    }
  };
  
  

  const changeIcon = () => {
    if (!isLocked) {
      setIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
    }
  };

  return (
    <div>
      <Header />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center">
          {randomChampion && (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <Image src={randomChampion.imageUrl} alt={randomChampion.name} width={100} height={100} className="rounded-lg" />
                <h3 className="text-lg font-bold">{randomChampion.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src={`/Icons/${icons[iconIndex]}`}
                  alt="Role Icon"
                  width={50}
                  height={50}
                  className={`rounded-lg cursor-pointer ${isLocked ? "opacity-50" : ""}`}
                  onClick={changeIcon}
                />
                <button onClick={() => setIsLocked(!isLocked)} className="p-2 rounded bg-gray-800 hover:bg-gray-700">
                  {isLocked ? "🔒" : "🔓"}
                </button>
              </div>
            </div>
          )}
          <div className="flex w-full justify-center gap-2">
            <h2 className="text-xl font-bold">Equipo:</h2>
            <div className="flex gap-2 ms-2">
              <button onClick={removeCard} disabled={cards.length <= 1} className={`text-white font-bold px-3 py-1 rounded ${cards.length > 1 ? "bg-red-500 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"}`}>-</button>
              <button onClick={addCard} disabled={cards.length >= 5} className={`text-white font-bold px-3 py-1 rounded ${cards.length < 5 ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}>+</button>
              <button onClick={generateRandomChampion} className="text-white font-bold px-3 py-1 rounded bg-green-500 hover:bg-green-700">R</button>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {cards.map((card) => (
              <Card key={card.id} initialName={card.name} imageName={card.imageName} description={card.description} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
