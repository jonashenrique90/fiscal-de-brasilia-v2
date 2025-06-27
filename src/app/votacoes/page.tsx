"use client";

import { useQuery } from "@tanstack/react-query";
import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";
import { HiChevronDown } from "react-icons/hi";
import { useState } from "react";

interface Votacao {
  id: string;
  data: string;
  dataHoraRegistro: string;
  descricao: string;
  aprovacao: boolean;
  placarSim: number;
  placarNao: number;
  placarAbstencao: number;
}

export default function VotacoesPage() {
  const [expandedVotacao, setExpandedVotacao] = useState<string | null>(null);

  const {
    data: votacoes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["votacoes"],
    queryFn: async () => {
      const response = await fetch("/api/votacoes");
      const data = await response.json();
      return data.dados as Votacao[];
    },
  });

  const formatDate = (date: string) => {
    return formatInTimeZone(
      new Date(date),
      "America/Sao_Paulo",
      "d 'de' MMMM 'de' yyyy 'às' HH:mm",
      { locale: ptBR }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-red-500">
        Erro ao carregar os dados das votações
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Votações</h1>
        <div className="grid gap-4">
          {votacoes?.map((votacao) => (
            <div
              key={votacao.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                onClick={() =>
                  setExpandedVotacao(
                    expandedVotacao === votacao.id ? null : votacao.id
                  )
                }
              >
                <div>
                  <p className="text-sm text-gray-500">
                    {formatDate(votacao.dataHoraRegistro)}
                  </p>
                  <h2 className="text-lg font-semibold mt-1 text-gray-900">
                    {votacao.descricao}
                  </h2>
                </div>
                <HiChevronDown
                  className={`w-6 h-6 transform transition-transform text-gray-500 ${
                    expandedVotacao === votacao.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedVotacao === votacao.id ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="p-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        votacao.aprovacao
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {votacao.aprovacao ? "Aprovada" : "Rejeitada"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Sim</p>
                      <p className="text-2xl font-bold text-green-600">
                        {votacao.placarSim}
                      </p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Não</p>
                      <p className="text-2xl font-bold text-red-600">
                        {votacao.placarNao}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Abstenção</p>
                      <p className="text-2xl font-bold text-gray-600">
                        {votacao.placarAbstencao}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
