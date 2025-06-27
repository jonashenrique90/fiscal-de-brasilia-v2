"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getPartyColors } from "@/utils/colors";
import { LoadingSpinnerWithText } from "@/components/LoadingSpinner";
import { searchDeputados } from "@/services/api";

interface Deputado {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
}

export default function DeputadosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Deputado[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data: deputados, isLoading } = useQuery({
    queryKey: ["deputados"],
    queryFn: async () => {
      const response = await fetch("/api/deputados");
      const data = await response.json();
      return data.dados as Deputado[];
    },
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setSearchError("");
    setSearchResults([]);
    setHasSearched(true);
    setCurrentPage(1);

    try {
      const results = await searchDeputados(searchTerm);
      if (results.length === 0) {
        setSearchError("Nenhum deputado encontrado com esse nome.");
      } else {
        setSearchResults(results);
      }
    } catch (err) {
      console.error("Erro na busca:", err);
      setSearchError("Erro ao buscar deputados. Por favor, tente novamente.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!e.target.value.trim()) {
      setHasSearched(false);
      setSearchResults([]);
      setSearchError("");
      setCurrentPage(1);
    }
  };

  // Calcular deputados da página atual
  const displayedDeputados = hasSearched ? searchResults : deputados || [];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDeputados = displayedDeputados.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(displayedDeputados.length / itemsPerPage);

  // Componente de Paginação
  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-3 mt-8 pb-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              if (totalPages <= 5) return true;
              if (page === 1 || page === totalPages) return true;
              if (page >= currentPage - 1 && page <= currentPage + 1)
                return true;
              return false;
            })
            .map((page, index, array) => {
              if (index > 0 && array[index - 1] !== page - 1) {
                return (
                  <div key={`ellipsis-${page}`} className="flex items-center">
                    <span className="px-2 text-gray-400">...</span>
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        currentPage === page
                          ? "bg-primary text-white font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                );
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    currentPage === page
                      ? "bg-primary text-white font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}
        </div>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          <span className="hidden sm:inline">Próxima</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          {/* <h1 className="text-3xl font-bold mb-6 text-gray-900">Deputados</h1> */}

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="search"
                className="text-lg font-medium text-primary"
              >
                Pesquisar Deputado
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  placeholder="Digite o nome do deputado..."
                  className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-900 placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  disabled={isSearching || !searchTerm.trim()}
                  className="w-full sm:w-auto px-6 py-3 sm:py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? "Buscando..." : "Pesquisar"}
                </button>
              </div>
            </div>
          </form>

          {isSearching && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <LoadingSpinnerWithText text="Buscando deputados..." />
              </div>
            </div>
          )}

          {searchError && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {searchError}
            </div>
          )}

          {displayedDeputados.length > 0 && (
            <div className="flex justify-between items-center text-gray-600 mb-4">
              <div>
                {displayedDeputados.length}{" "}
                {displayedDeputados.length === 1 ? "deputado" : "deputados"}
                {hasSearched && " encontrados"}
              </div>
              {totalPages > 1 && (
                <div>
                  Mostrando {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, displayedDeputados.length)} de{" "}
                  {displayedDeputados.length}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {currentDeputados.map((deputado) => {
            const colors = getPartyColors(deputado.siglaPartido);
            return (
              <Link
                href={`/deputados/${deputado.id}`}
                key={deputado.id}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
              >
                <div className="flex gap-6 p-4">
                  <div className="w-32 h-40 relative flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={deputado.urlFoto}
                      alt={deputado.nome}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {deputado.nome}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                        }}
                      >
                        {deputado.siglaPartido} - {deputado.siglaUf}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <Pagination />
      </div>
    </div>
  );
}
