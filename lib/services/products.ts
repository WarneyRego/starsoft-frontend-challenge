interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  createdAt: string;
}

interface ProductsResponse {
  products: Product[];
  count: number;
}

const API_BASE_URL = 'https://api-challenge.starsoft.games/api/v1';

export async function getProducts(
  page: string | number = 1,
  rows: string | number = 10,
  sortBy: string = 'name',
  orderBy: string = 'ASC'
): Promise<ProductsResponse> {
  const res = await fetch(
    `${API_BASE_URL}/products?page=${page}&rows=${rows}&sortBy=${sortBy}&orderBy=${orderBy}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error('Falha ao buscar produtos da API externa');
  }

  return res.json();
}

export async function getProductById(id: string): Promise<Product | null> {
  // Como a API externa não tem endpoint por ID, buscamos a lista e filtramos
  const data = await getProducts(1, 50, 'name', 'ASC');
  const product = data.products.find((p) => p.id.toString() === id);
  return product || null;
}
