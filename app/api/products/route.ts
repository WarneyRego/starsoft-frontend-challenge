import { NextResponse } from "next/server";
import { getProducts } from "@/lib/services/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const rows = searchParams.get("rows") || "10";
  const sortBy = searchParams.get("sortBy") || "name";
  const orderBy = searchParams.get("orderBy") || "ASC";

  try {
    const data = await getProducts(page, rows, sortBy, orderBy);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao buscar produtos" },
      { status: 500 }
    );
  }
}
