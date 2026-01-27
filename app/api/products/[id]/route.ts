import { NextResponse } from "next/server";
import { getProductById } from "@/lib/services/products";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro interno ao processar produto", message: error.message },
      { status: 500 }
    );
  }
}
