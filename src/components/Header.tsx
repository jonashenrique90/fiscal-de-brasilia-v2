"use client";

import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary text-white border-b border-primary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">Fiscal de Brasília</span>
            </Link>
          </div>

          <nav className="flex items-center space-x-6">
            <Link
              href="/deputados"
              className="text-white/80 hover:text-white transition-colors"
            >
              Deputados
            </Link>
            <Link
              href="/votacoes"
              className="text-white/80 hover:text-white transition-colors"
            >
              Votações
            </Link>
            <Link
              href="https://github.com/jonashenrique90/fiscal-de-brasilia-v2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
              aria-label="GitHub repository"
            >
              <FaGithub className="w-6 h-6" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
