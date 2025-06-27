"use client";

import { useState } from "react";
import { Deputado, searchDeputados } from "@/services/api";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [deputados, setDeputados] = useState<Deputado[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError("");
    setDeputados([]);

    try {
      const results = await searchDeputados(searchTerm);
      if (results.length === 0) {
        setError("Nenhum deputado encontrado com esse nome.");
      } else {
        setDeputados(results);
      }
    } catch (err) {
      console.error("Erro na busca:", err);
      setError("Erro ao buscar deputados. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="search"
                className="text-lg font-medium text-primary-dark"
              >
                Pesquisar Deputado
              </label>
              <div className="flex gap-2">
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite o nome do deputado..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-900 placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors whitespace-nowrap font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Buscando..." : "Pesquisar"}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {deputados.length > 0 && (
            <div className="mt-8 space-y-4">
              {deputados.map((deputado) => (
                <div
                  key={deputado.id}
                  onClick={() => router.push(`/deputados/${deputado.id}`)}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:scale-[1.02] p-4 cursor-pointer"
                >
                  <div className="flex gap-6">
                    <div className="w-32 h-40 relative flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {deputado.urlFoto && (
                        <Image
                          src={deputado.urlFoto}
                          alt={deputado.nome}
                          fill
                          sizes="128px"
                          className="object-cover"
                          priority
                        />
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {deputado.nome}
                      </h3>
                      <div className="flex items-center">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {deputado.siglaPartido} - {deputado.siglaUf}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && searchTerm && deputados.length === 0 && !error && (
            <div className="mt-4 text-center text-gray-500">
              Nenhum deputado encontrado com esse nome.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
