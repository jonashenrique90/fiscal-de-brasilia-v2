// Função para obter as cores do partido
export const getPartyColors = (party: string): { bg: string; text: string } => {
  const colors: { [key: string]: { bg: string; text: string } } = {
    PT: { bg: "bg-red-100", text: "text-red-700" },
    PSOL: { bg: "bg-red-100", text: "text-red-700" },
    PCdoB: { bg: "bg-red-100", text: "text-red-700" },
    PSB: { bg: "bg-yellow-100", text: "text-yellow-800" },
    PDT: { bg: "bg-red-100", text: "text-red-700" },
    PV: { bg: "bg-green-100", text: "text-green-700" },
    REDE: { bg: "bg-green-100", text: "text-green-700" },
    MDB: { bg: "bg-blue-100", text: "text-blue-700" },
    PSD: { bg: "bg-blue-100", text: "text-blue-700" },
    UNIÃO: { bg: "bg-blue-100", text: "text-blue-700" },
    PSDB: { bg: "bg-blue-100", text: "text-blue-700" },
    PP: { bg: "bg-blue-100", text: "text-blue-700" },
    REPUBLICANOS: { bg: "bg-blue-100", text: "text-blue-700" },
    PL: { bg: "bg-blue-100", text: "text-blue-700" },
    NOVO: { bg: "bg-orange-100", text: "text-orange-700" },
    AVANTE: { bg: "bg-orange-100", text: "text-orange-700" },
    CIDADANIA: { bg: "bg-pink-100", text: "text-pink-700" },
    SOLIDARIEDADE: { bg: "bg-pink-100", text: "text-pink-700" },
    PATRIOTA: { bg: "bg-green-100", text: "text-green-700" },
    PROS: { bg: "bg-purple-100", text: "text-purple-700" },
    PSC: { bg: "bg-green-100", text: "text-green-700" },
    PODE: { bg: "bg-blue-100", text: "text-blue-700" },
  };

  return colors[party] || { bg: "bg-gray-100", text: "text-gray-700" };
};
