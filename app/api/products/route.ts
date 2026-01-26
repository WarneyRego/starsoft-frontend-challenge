import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const rows = searchParams.get("rows") || "10";
  const sortBy = searchParams.get("sortBy") || "name";
  const orderBy = searchParams.get("orderBy") || "ASC";

  try {
    const res = await fetch(
      `https://api-challenge.starsoft.games/api/v1/products?page=${page}&rows=${rows}&sortBy=${sortBy}&orderBy=${orderBy}`
    );
    
    if (!res.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar produtos da API externa" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno ao buscar produtos" },
      { status: 500 }
    );
  }
}
