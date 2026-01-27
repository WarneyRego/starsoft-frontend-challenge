import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import DashboardProducts from "./components/DashboardProducts";
import { getProducts } from "@/lib/services/products";

export default async function Home() {
  const queryClient = new QueryClient();

 
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(1, 10, 'name', 'ASC'),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardProducts />
    </HydrationBoundary>
  );
}
