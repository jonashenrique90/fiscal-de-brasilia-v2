import { NextRequest, NextResponse } from "next/server";
git;
const API_URL = "https://dadosabertos.camara.leg.br/api/v2";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching deputy expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch deputy expenses" },
      { status: 500 }
    );
  }
}
