"use client";
import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Card from "./components/Card";

const icons = [
  "TopIcon.png",
  "JgIcon.png",
  "MidIcon.png",
  "AdcIcon.png",
  "SuppIcon.png",
  "FillIcon.png",
];

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
  const version = "15.6.1";

  const [cards, setCards] = useState([
    {
      id: 1,
      name: "Player 1",
      role: "FillIcon.png",
      champion: {
        id: "Ziggs",
        name: "Ziggs",
        imageUrl:
          "https://ddragon.leagueoflegends.com/cdn/15.6.1/img/champion/Ziggs.png",
      } as { id: string; name: string; imageUrl: string } | null,
    },
  ]);
  const [championRoles, setChampionRoles] = useState<ChampionRoles | null>(
    null
  );
  const [lockedRoles, setLockedRoles] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchChampionData = async () => {
      try {
        const rolesResponse = await fetch("/data/championData.json");
        const rolesData: ChampionRoles = await rolesResponse.json();
        setChampionRoles(rolesData);
      } catch (error) {
        console.error("Error fetching champion data:", error);
      }
    };

    fetchChampionData();
  }, []);

  const getRandomChampionByRole = (role: string, champions: Champion[]) => {
    if (!championRoles) return null;
    const selectedRole = rolesMap[role];

    let filteredChampions: Champion[] = [];
    if (selectedRole) {
      filteredChampions = champions.filter((champion) => {
        const champData = championRoles[champion.id];
        return champData && champData.roles.includes(selectedRole);
      });
    } else {
      filteredChampions = champions;
    }

    const newChampion =
      filteredChampions.length > 0
        ? filteredChampions[
            Math.floor(Math.random() * filteredChampions.length)
          ]
        : null;

    return newChampion
      ? {
          id: newChampion.id,
          name: newChampion.name,
          imageUrl: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${newChampion.image.full}`,
        }
      : null;
  };

  const generateRandomForAllCards = async () => {
    try {
      const response = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
      );
      const data = await response.json();
      const champions = Object.values(data.data) as Champion[];
  
      if (!championRoles) return;
  
      setCards((prevCards) => {
        const lockedRolesSet = new Set(
          prevCards.filter((card) => lockedRoles[card.id]).map((card) => card.role)
        );
  
        let availableRoles = icons.filter(
          (role) => role !== "FillIcon.png" && !lockedRolesSet.has(role)
        );
  
        availableRoles = availableRoles.sort(() => Math.random() - 0.5);
  
        let roleIndex = 0;
        const usedChampionIds = new Set<string>();  // Aquí almacenamos los campeones ya utilizados
  
        return prevCards.map((card) => {
          let newRole = card.role;
  
          if (!lockedRoles[card.id]) {
            newRole = availableRoles[roleIndex] || "FillIcon.png";
            roleIndex++;
          }
  
          // Aquí seleccionamos un campeón aleatorio que no haya sido usado aún
          let newChampion = getRandomChampionByRole(newRole, champions);
          
          // Aseguramos que el campeón sea único
          while (newChampion && usedChampionIds.has(newChampion.id)) {
            newChampion = getRandomChampionByRole(newRole, champions);  // Generamos uno nuevo
          }
  
          // Si encontramos un campeón único, lo agregamos al set de usados
          if (newChampion) {
            usedChampionIds.add(newChampion.id);
          }
  
          return {
            ...card,
            role: newRole,
            champion: newChampion,
          };
        });
      });
    } catch (error) {
      console.error("Error fetching champion data:", error);
    }
  };
  
  

  const addCard = async () => {
    if (cards.length < 5) {
      try {
        const response = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
        );
        const data = await response.json();
        const champions = Object.values(data.data) as Champion[];

        const assignedRoles = new Set(cards.map((card) => card.role));

        const availableRoles = icons.filter(
          (icon) => icon !== "FillIcon.png" && !assignedRoles.has(icon)
        );

        if (availableRoles.length === 0) {
          console.warn("No hay roles disponibles");
          return;
        }

        const newRole =
          availableRoles[Math.floor(Math.random() * availableRoles.length)];
        const newChampion = getRandomChampionByRole(newRole, champions);

        setCards((prevCards) => {
          const newId = prevCards.length + 1;
          return [
            ...prevCards,
            {
              id: newId,
              name: `Player ${newId}`,
              role: newRole,
              champion: newChampion,
            },
          ];
        });

        setLockedRoles((prevState) => ({
          ...prevState,
          [cards.length + 1]: false,
        }));
      } catch (error) {
        console.error("Error fetching champion data:", error);
      }
    }
  };

  const removeCard = () => {
    if (cards.length > 1) {
      setCards((prevCards) => prevCards.slice(0, -1));
    }
  };

  const toggleLockRole = (cardId: number) => {
    setLockedRoles((prevState) => ({
      ...prevState,
      [cardId]: !prevState[cardId],
    }));
  };
  

  return (
    <div>
      <Header />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center">
          <div className="flex w-full justify-center gap-2">
            <h2 className="text-xl font-bold">Equipo:</h2>
            <div className="flex gap-2 ms-2">
              <button
                onClick={removeCard}
                disabled={cards.length <= 1}
                className="bg-red-500 hover:bg-red-700 text-white font-bold px-3 py-1 rounded disabled:bg-gray-400"
              >
                -
              </button>
              <button
                onClick={addCard}
                disabled={cards.length >= 5}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded disabled:bg-gray-400"
              >
                +
              </button>
              <button
                onClick={generateRandomForAllCards}
                className="bg-green-500 hover:bg-green-700 text-white font-bold px-3 py-1 rounded"
              >
                R
              </button>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {cards.map((card) => (
              <Card
                key={card.id}
                initialName={card.name}
                role={card.role}
                champion={card.champion}
                isLocked={lockedRoles[card.id] || false}
                changeIcon={() => toggleLockRole(card.id)}
                setRole={(newRole) => {
                  setCards((prevCards) =>
                    prevCards.map((c) =>
                      c.id === card.id ? { ...c, role: newRole } : c
                    )
                  );
                }} // <-- Ahora actualiza el estado de Home
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
