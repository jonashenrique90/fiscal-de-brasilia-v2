/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://dadosabertos.camara.leg.br/api/v2";

// Tipagem inline compatível com App Router
export async function GET(request: NextRequest, context: any) {
  const searchParams = request.nextUrl.searchParams;
  const ano = searchParams.get("ano");
  const mes = searchParams.get("mes");
  const id = context.params.id;

  if (!ano || !mes) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_URL}/deputados/${id}/despesas?ano=${ano}&mes=${mes}&itens=100&ordem=DESC&ordenarPor=dataDocumento`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Erro da API da Câmara: status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar despesas:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar despesas" },
      { status: 500 }
    );
  }
}
