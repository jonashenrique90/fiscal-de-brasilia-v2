import { NextResponse } from "next/server";

const BASE_URL = "https://dadosabertos.camara.leg.br/api/v2";

export async function GET() {
  try {
    const response = await fetch(
      `${BASE_URL}/votacoes?ordem=DESC&ordenarPor=dataHoraRegistro`
    );
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching voting data:", error);
    return NextResponse.json(
      { error: "Failed to fetch voting data" },
      { status: 500 }
    );
  }
}
