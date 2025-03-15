import React from "react";
import Image from "next/image";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  selectedRole: string | null;
  setSelectedRole: (role: string | null) => void;
}

export default function SearchBar({ search, setSearch, selectedRole, setSelectedRole }: SearchBarProps) {
  const roles = ["Top", "Jg", "Mid", "Adc", "Supp"];

  const handleRoleClick = (role: string) => {
    setSelectedRole(selectedRole === role ? null : role);
  };

  return (
    <div className="flex items-center gap-4 w-full max-w-lg">
      <div className="flex gap-2 items-center">
        {roles.map((role) => (
          <div
            key={role}
            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
              selectedRole === role ? "bg-[#02637B]" : "bg-transparent"
            }`}
            onClick={() => handleRoleClick(role)}
          >
            <Image
              src={`/icons/${role}Icon.png`}
              alt={`${role} icon`}
              width={27}
              height={27}
            />
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Buscar campeón"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border rounded-lg w-40 text-black"
      />
    </div>
  );
}
