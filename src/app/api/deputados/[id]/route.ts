/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

const API_URL = "https://dadosabertos.camara.leg.br/api/v2";

export async function GET(request: Request, context: any) {
  const id = context.params.id;

  try {
    const response = await fetch(`${API_URL}/deputados/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching deputy details:", error);
    return NextResponse.json(
      { error: "Failed to fetch deputy details" },
      { status: 500 }
    );
  }
}
