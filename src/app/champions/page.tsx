"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/Header";

interface Champion {
  id: string;
  name: string;
}

export default function Champions() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const version = "15.5.1";

  useEffect(() => {
    async function fetchChampions() {
      try {
        const res = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
        );
        const data = await res.json();
        const championsArray = Object.values(data.data) as Champion[];
        setChampions(championsArray);
      } catch (error) {
        console.error("Error al obtener los campeones:", error);
      }
    }

    fetchChampions();
  }, []);

  return (
    <div>
      <Header />
      <div className="flex flex-wrap justify-center gap-6 p-8">
        {champions.map((champ) => (
          <div key={champ.id} className="text-center">
            <Link href={`/champions/${champ.id}`}>
              <Image
                src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.id}.png`}
                alt={champ.name}
                width={90}
                height={90}
                className="rounded-lg cursor-pointer"
              />
            </Link>
            <p className="mt-2 font-semibold text-sm">{champ.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
