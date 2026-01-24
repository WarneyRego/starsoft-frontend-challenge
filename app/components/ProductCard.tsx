import Image from "next/image";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  createdAt: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const formatPrice = (price: string) => {
    return parseFloat(price).toFixed(0);
  };

  return (
    <div
      style={{
        width: "345px",
        height: "555px",
        backgroundColor: "#191A20",
        borderRadius: "8px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.10)",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "296px",
          height: "258px",
          backgroundColor: "#22232C",
          borderRadius: "8px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          overflow: "hidden",
        }}
      >
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
          style={{ objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
        }}
      >
        <h2
          style={{
            color: "#FFFFFF",
            fontSize: "18px",
            fontWeight: "600",
            margin: 0,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {product.name}
        </h2>
        <p
          style={{
            color: "#CCCCCC",
            fontSize: "12px",
            margin: 0,
            lineHeight: "1.6",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Redesigned from scratch and completely revised.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "#5D6AE1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
            }}
          >
            <span style={{ color: "#FFFFFF" }}>Ξ</span>
          </div>
          <p
            style={{
              color: "#FFFFFF",
              fontSize: "20px",
              fontWeight: "700",
              margin: 0,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {formatPrice(product.price)} ETH
          </p>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          style={{
            width: "100%",
            height: "48px",
            backgroundColor: "#FF8310",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
            letterSpacing: "0.1em",
          }}
        >
          COMPRAR
        </button>
      </div>
    </div>
  );
}
