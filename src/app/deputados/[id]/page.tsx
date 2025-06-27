"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DeputadoDetalhado, getDeputado } from "@/services/api";
import { DespesasDashboard } from "@/components/DespesasDashboard";
import Image from "next/image";

export default function DeputadoPage() {
  const { id } = useParams();
  const [deputado, setDeputado] = useState<DeputadoDetalhado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDeputado() {
      try {
        const data = await getDeputado(Number(id));
        setDeputado(data);
      } catch {
        setError("Erro ao carregar dados do deputado");
      } finally {
        setLoading(false);
      }
    }

    loadDeputado();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (error || !deputado) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">
          {error || "Deputado não encontrado"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Aside com informações do deputado */}
        <aside className="w-96 min-h-screen bg-white border-r border-gray-200 overflow-y-auto">
          <div className="sticky top-0">
            {/* Foto do deputado */}
            <div className="flex justify-center items-center py-6 bg-white">
              <div className="w-48 h-48 relative rounded-full overflow-hidden bg-gray-100 ring-4 ring-primary/10">
                {deputado.ultimoStatus.urlFoto && (
                  <Image
                    src={deputado.ultimoStatus.urlFoto}
                    alt={deputado.ultimoStatus.nome}
                    fill
                    sizes="12rem"
                    className="object-cover"
                    priority
                  />
                )}
              </div>
            </div>

            <div className="px-6 pb-6 space-y-6">
              {/* Cabeçalho com nome e partido */}
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  {deputado.ultimoStatus.nome}
                </h1>
                <div className="mt-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {deputado.ultimoStatus.siglaPartido} -{" "}
                    {deputado.ultimoStatus.siglaUf}
                  </span>
                </div>
              </div>

              {/* Informações Pessoais */}
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Informações Pessoais
                </h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Nome Civil:</span>{" "}
                    {deputado.nomeCivil}
                  </p>
                  <p>
                    <span className="font-medium">Nascimento:</span>{" "}
                    {new Date(deputado.dataNascimento).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                  <p>
                    <span className="font-medium">Naturalidade:</span>{" "}
                    {deputado.municipioNascimento} - {deputado.ufNascimento}
                  </p>
                  {deputado.escolaridade && (
                    <p>
                      <span className="font-medium">Escolaridade:</span>{" "}
                      {deputado.escolaridade}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Atual */}
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Status Atual
                </h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Situação:</span>{" "}
                    {deputado.ultimoStatus.situacao}
                  </p>
                  <p>
                    <span className="font-medium">Condição Eleitoral:</span>{" "}
                    {deputado.ultimoStatus.condicaoEleitoral}
                  </p>
                </div>
              </div>

              {/* Gabinete */}
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Gabinete
                </h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Localização:</span>{" "}
                    {`${deputado.ultimoStatus.gabinete.predio}º Andar, Sala ${deputado.ultimoStatus.gabinete.sala}`}
                  </p>
                  <p>
                    <span className="font-medium">Telefone:</span>{" "}
                    {deputado.ultimoStatus.gabinete.telefone}
                  </p>
                  {deputado.ultimoStatus.gabinete.email && (
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {deputado.ultimoStatus.gabinete.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Área principal para o dashboard */}
        <main className="flex-1 min-h-screen p-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h2>
            <DespesasDashboard deputadoId={Number(id)} />
          </div>
        </main>
      </div>
    </div>
  );
}
