"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/Header";
import SearchBar from "@/app/components/SearchBar";

interface Champion {
  id: string;
  roles?: string[];
}

export default function Champions() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [filteredChampions, setFilteredChampions] = useState<Champion[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const version = "15.5.1";

  useEffect(() => {
    async function fetchChampions() {
      try {
        const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`);
        const localRes = await fetch("/data/championData.json");
        if (!res.ok || !localRes.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        const riotData = await res.json();
        const localData = await localRes.json();

        const championsArray = Object.keys(riotData.data).map((key) => {
          return {
            id: key,
            roles: localData[key]?.roles || []
          };
        });

        setChampions(championsArray);
        setFilteredChampions(championsArray);
      } catch (error) {
        console.error("Error al obtener los campeones:", error);
      }
    }

    fetchChampions();
  }, []);

  useEffect(() => {
    let results = champions.filter((champ) => champ.id.toLowerCase().includes(search.toLowerCase()));
    
    if (selectedRole) {
      results = results.filter((champ) => champ.roles?.includes(selectedRole));
    }

    setFilteredChampions(results);
  }, [search, selectedRole, champions]);

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center gap-4 p-8">
        <SearchBar search={search} setSearch={setSearch} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {filteredChampions.length > 0 ? (
            filteredChampions.map((champ) => (
              <div key={champ.id} className="text-center">
                <Link href={`/champions/${champ.id}`}>
                  <Image
                    src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.id}.png`}
                    alt={`Imagen de ${champ.id}`}
                    width={90}
                    height={90}
                    className="rounded-lg cursor-pointer"
                  />
                </Link>
                <p className="mt-2 font-semibold text-sm">{champ.id}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No se encontraron campeones.</p>
          )}
        </div>
      </div>
    </div>
  );
}
