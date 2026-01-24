import Image from "next/image";

interface HeaderProps {
  onOpenCart: () => void;
  cartCount: number;
}

export default function Header({ onOpenCart, cartCount }: HeaderProps) {
  return (
    <header
      style={{
        height: "100px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 60px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.21)",
        backgroundColor: "transparent",
      }}
    >
      <div>
        <Image
          src="/images/icons/logo.svg"
          alt="Starsoft Logo"
          width={150}
          height={40}
          priority
        />
      </div>
      <div
        onClick={onOpenCart}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          cursor: "pointer",
        }}
      >
        <Image
          src="/images/icons/shopcart.svg"
          alt="Shopping Cart"
          width={24}
          height={24}
        />
        <span
          style={{
            color: "#FFFFFF",
            fontSize: "18px",
            fontWeight: "400",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {cartCount}
        </span>
      </div>
    </header>
  );
}
