"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Fiscal de Brasília
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Acompanhe as atividades dos deputados federais, suas votações e
            despesas
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/deputados"
              className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 relative">
                  <Image
                    src="/file.svg"
                    alt="Deputados"
                    fill
                    className="object-contain"
                  />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  Deputados
                </h2>
                <p className="text-gray-600">
                  Pesquise e acompanhe os deputados federais
                </p>
              </div>
            </Link>

            <Link
              href="/votacoes"
              className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 relative">
                  <Image
                    src="/window.svg"
                    alt="Votações"
                    fill
                    className="object-contain"
                  />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  Votações
                </h2>
                <p className="text-gray-600">
                  Acompanhe as votações na Câmara dos Deputados
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
