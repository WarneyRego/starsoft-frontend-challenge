import Image from "next/image";

interface CartItem {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  quantity: number;
}

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
}

export default function CartOverlay({
  isOpen,
  onClose,
  items,
  onRemove,
  onUpdateQuantity,
}: CartOverlayProps) {
  if (!isOpen) return null;

  const total = items.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "100%",
        maxWidth: "480px",
        height: "100vh",
        backgroundColor: "#191A20",
        boxShadow: "-10px 0px 30px rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        padding: "40px 30px",
      }}
    >
      {/* Header do Carrinho */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          marginBottom: "60px",
        }}
      >
        <button
          onClick={onClose}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "#373737",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Image src="/images/arrow.svg" alt="Voltar" width={24} height={24} />
        </button>
        <h2
          style={{
            color: "#FFFFFF",
            fontSize: "24px",
            fontWeight: "600",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Mochila de Compras
        </h2>
      </div>

      {/* Lista de Itens */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          paddingRight: "10px",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: "#22232C",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              gap: "16px",
              position: "relative",
            }}
          >
            {/* Foto do Produto */}
            <div
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "#191A20",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* Detalhes */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <h3 style={{ color: "#FFFFFF", fontSize: "16px", margin: 0 }}>
                {item.name}
              </h3>
              <p
                style={{
                  color: "#CCCCCC",
                  fontSize: "12px",
                  margin: 0,
                  maxWidth: "180px",
                }}
              >
                {item.description.length > 50
                  ? item.description.substring(0, 50) + "..."
                  : item.description}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "4px",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: "#5D6AE1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                  }}
                >
                  <span style={{ color: "#FFFFFF", transform: "scale(0.8)" }}>
                    Ξ
                  </span>
                </div>
                <span
                  style={{
                    color: "#FFFFFF",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  {parseFloat(item.price).toFixed(0)} ETH
                </span>
              </div>

              {/* Quantidade */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#191A20",
                  borderRadius: "8px",
                  width: "fit-content",
                  marginTop: "8px",
                  padding: "4px 8px",
                  gap: "16px",
                }}
              >
                <button
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  style={{
                    color: "#FFFFFF",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  -
                </button>
                <span style={{ color: "#FFFFFF" }}>{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  style={{
                    color: "#FFFFFF",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Botão Remover */}
            <button
              onClick={() => onRemove(item.id)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#FF8310",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                alignSelf: "flex-end",
              }}
            >
              <Image src="/images/trash.svg" alt="Remover" width={18} height={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer do Carrinho */}
      <div style={{ marginTop: "40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontSize: "24px",
              fontWeight: "700",
            }}
          >
            TOTAL
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#5D6AE1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#FFFFFF", fontSize: "16px" }}>Ξ</span>
            </div>
            <span
              style={{
                color: "#FFFFFF",
                fontSize: "28px",
                fontWeight: "700",
              }}
            >
              {total.toFixed(0)} ETH
            </span>
          </div>
        </div>

        <button
          style={{
            width: "100%",
            height: "64px",
            backgroundColor: "#FF8310",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "12px",
            fontSize: "18px",
            fontWeight: "700",
            cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          FINALIZAR COMPRA
        </button>
      </div>
    </div>
  );
}
