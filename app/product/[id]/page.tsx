import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ProductDetailsClient from "./ProductDetailsClient";
import { getProductById, getProducts } from "@/lib/services/products";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetailsClient id={id} />
    </HydrationBoundary>
  );
}

export async function generateStaticParams() {
  try {
    const data = await getProducts(1, 50);
    return data.products.map((product) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    return [];
  }
}
