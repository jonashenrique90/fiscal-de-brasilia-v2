"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DeputadoDetalhado, getDeputado } from "@/services/api";
import { DespesasDashboard } from "@/components/DespesasDashboard";
import { LoadingSpinnerWithText } from "@/components/LoadingSpinner";
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
} from "react-icons/hi";
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import { getPartyColors } from "@/utils/colors";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinnerWithText text="Carregando informações do deputado..." />
      </div>
    );
  }

  if (error || !deputado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-red-600">
          {error || "Deputado não encontrado"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Aside com informações do deputado - visível apenas em desktop */}
        <aside className="hidden lg:block w-80 min-h-screen bg-white border-r border-gray-200 overflow-y-auto">
          <div className="sticky top-0">
            {/* Foto do deputado */}
            <div className="flex justify-center items-center py-6 bg-white">
              <div className="w-40 h-40 relative rounded-full overflow-hidden bg-gray-100 ring-4 ring-primary/10">
                {deputado.ultimoStatus.urlFoto && (
                  <Image
                    src={deputado.ultimoStatus.urlFoto}
                    alt={deputado.ultimoStatus.nome}
                    fill
                    sizes="10rem"
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
                  <span
                    className={`px-3 py-1 ${
                      getPartyColors(deputado.ultimoStatus.siglaPartido).bg
                    } ${
                      getPartyColors(deputado.ultimoStatus.siglaPartido).text
                    } rounded-full text-sm font-medium`}
                  >
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

              {/* Redes Sociais */}
              {deputado.redeSocial && deputado.redeSocial.length > 0 && (
                <div className="border-t border-gray-100 pt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Redes Sociais
                  </h2>
                  <div className="flex gap-4">
                    {deputado.redeSocial.map((url, index) => {
                      let icon = null;
                      let label = "";

                      if (url.includes("twitter.com")) {
                        icon = <FaTwitter className="w-6 h-6" />;
                        label = "Twitter";
                      } else if (url.includes("facebook.com")) {
                        icon = <FaFacebook className="w-6 h-6" />;
                        label = "Facebook";
                      } else if (url.includes("instagram.com")) {
                        icon = <FaInstagram className="w-6 h-6" />;
                        label = "Instagram";
                      } else if (url.includes("youtube.com")) {
                        icon = <FaYoutube className="w-6 h-6" />;
                        label = "YouTube";
                      }

                      if (!icon) return null;

                      return (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-primary transition-colors"
                          title={label}
                        >
                          {icon}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Status Atual */}
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Status Atual
                </h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Situação:</span>{" "}
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        deputado.ultimoStatus.situacao === "Exercício"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {deputado.ultimoStatus.situacao}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Condição Eleitoral:</span>{" "}
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        deputado.ultimoStatus.condicaoEleitoral === "Titular"
                          ? "bg-blue-100 text-blue-700"
                          : deputado.ultimoStatus.condicaoEleitoral ===
                            "Suplente"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {deputado.ultimoStatus.condicaoEleitoral}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gabinete */}
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Gabinete
                </h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <HiOutlineLocationMarker className="w-5 h-5 text-primary" />
                    {`${deputado.ultimoStatus.gabinete.predio}º Andar, Sala ${deputado.ultimoStatus.gabinete.sala}`}
                  </p>
                  <p className="flex items-center gap-2">
                    <HiOutlinePhone className="w-5 h-5 text-primary" />
                    {deputado.ultimoStatus.gabinete.telefone}
                  </p>
                  {deputado.ultimoStatus.gabinete.email && (
                    <p className="flex items-center gap-2">
                      <HiOutlineMail className="w-5 h-5 text-primary" />
                      <a
                        href={`mailto:${deputado.ultimoStatus.gabinete.email}`}
                        className="hover:text-primary transition-colors"
                      >
                        {deputado.ultimoStatus.gabinete.email}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Área principal para o dashboard */}
        <main className="flex-1 min-h-screen px-8 pt-8 pb-24 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h2>
            <DespesasDashboard deputadoId={Number(id)} />
          </div>
        </main>

        {/* Container inferior para informações do deputado em mobile/tablet */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-100 ring-2 ring-primary/10">
              {deputado.ultimoStatus.urlFoto && (
                <Image
                  src={deputado.ultimoStatus.urlFoto}
                  alt={deputado.ultimoStatus.nome}
                  fill
                  sizes="3rem"
                  className="object-cover"
                  priority
                />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {deputado.ultimoStatus.nome}
              </h3>
              <span
                className={`text-sm ${
                  getPartyColors(deputado.ultimoStatus.siglaPartido).text
                }`}
              >
                {deputado.ultimoStatus.siglaPartido} -{" "}
                {deputado.ultimoStatus.siglaUf}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
