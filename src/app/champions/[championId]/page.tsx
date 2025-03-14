"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface Ability {
  id: string;
  name: string;
  image: {
    full: string;
  };
}

interface ChampionDetails {
  passive: { image: { full: string }; description: string };
  spells: Ability[];
  lines: string[];
  spellsDescription: { [key: string]: string };
}

export default function ChampionDetails() {
  const { championId } = useParams();
  const [champion, setChampion] = useState<ChampionDetails | null>(null);
  const version = "15.5.1";

  useEffect(() => {
    async function fetchChampionDetails() {
      try {
        const res = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${championId}.json`
        );
        const data = await res.json();
        const championDataFromApi = data.data[championId as string];

        const resLocal = await fetch("/data/championData.json");
        const localData = await resLocal.json();


        const championLocalData = localData[championId as string] || {};

        setChampion({
          ...championDataFromApi,
          passive: {
            ...championDataFromApi.passive,
            description: championLocalData.passiveDescription || "",
          },
          spells: championDataFromApi.spells,
          lines: championLocalData.lines || [],
          spellsDescription: championLocalData.spellsDescription || {},
        });
      } catch (error) {
        console.error("Error al obtener detalles del campeón:", error);
      }
    }

    if (championId) fetchChampionDetails();
  }, [championId]);

  if (!champion) return <p>Cargando...</p>;

  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-red-800">
      <div className="grid gap-4 bg-black">
        <div className="flex gap-4 items-center">
          <Image
            src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${champion.passive.image.full}`}
            alt="Pasiva"
            width={64}
            height={64}
            className="rounded-lg"
          />
          <p className="text-sm text-white">{champion.passive.description || "Descripción no disponible"}</p>
        </div>
        {champion.spells.map((spell, index) => {
          const spellKeys = ["q", "w", "e", "r"];
          const spellKey = `${championId}_${spellKeys[index]}`;

          return (
            <div key={index} className="flex items-center gap-4">
              <Image
                src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.image.full}`}
                alt={`Habilidad ${index + 1}`}
                width={64}
                height={64}
                className="rounded-lg"
              />
              <p className="text-sm text-white">
                {champion.spellsDescription?.[spellKey] ||
                  "Descripción no disponible"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
