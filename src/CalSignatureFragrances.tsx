import { useState } from "react";
import "./CalSignatureFragrances.css";

type FragranceType = "strawberry" | "satin" | "vanilla" | "beach" | "frangipani";

interface Product {
  id: string;
  name: string;
  price: string;
  size: string;
  description: string;
  icon: string;
}

interface FragranceInfo {
  id: FragranceType;
  label: string;
  color: string;
  description: string;
  products: Product[];
}

export function CalSignatureFragrances() {
  const [activeFragrance, setActiveFragrance] = useState<FragranceType>("strawberry");

  const fragrances: FragranceInfo[] = [
    {
      id: "strawberry",
      label: "Strawberry",
      color: "#E63946",
      description: "Sweet and luscious strawberry scent with fresh berry notes. Perfect for spring and summer days.",
      products: [
        {
          id: "strawberry-1",
          name: "Strawberry Eau de Parfum",
          price: "$45.00",
          size: "50ml",
          description: "Luxurious eau de parfum with 20% fragrance concentration",
          icon: "🍓",
        },
        {
          id: "strawberry-2",
          name: "Strawberry Cologne",
          price: "$32.00",
          size: "100ml",
          description: "Lightweight cologne perfect for daily wear",
          icon: "🍓",
        },
        {
          id: "strawberry-3",
          name: "Strawberry Body Mist",
          price: "$18.00",
          size: "200ml",
          description: "Light, refreshing body mist for layering",
          icon: "💨",
        },
        {
          id: "strawberry-4",
          name: "Strawberry Scented Candle",
          price: "$24.00",
          size: "200g",
          description: "Hand-poured soy candle with natural fragrance",
          icon: "🕯️",
        },
      ],
    },
    {
      id: "satin",
      label: "Satin Sheets",
      color: "#FF69B4",
      description: "Luxurious and sensual pink fragrance with smooth, silky notes. A sophisticated choice for any occasion.",
      products: [
        {
          id: "satin-1",
          name: "Satin Sheets Eau de Parfum",
          price: "$52.00",
          size: "50ml",
          description: "Luxurious eau de parfum with premium notes",
          icon: "✨",
        },
        {
          id: "satin-2",
          name: "Satin Sheets Parfum",
          price: "$65.00",
          size: "30ml",
          description: "Pure parfum with highest concentration",
          icon: "💎",
        },
        {
          id: "satin-3",
          name: "Satin Sheets Body Lotion",
          price: "$28.00",
          size: "200ml",
          description: "Silky body lotion with matching fragrance",
          icon: "🧴",
        },
        {
          id: "satin-4",
          name: "Satin Sheets Diffuser",
          price: "$35.00",
          size: "100ml",
          description: "Home fragrance diffuser for elegant spaces",
          icon: "🏠",
        },
      ],
    },
    {
      id: "vanilla",
      label: "French Vanilla",
      color: "#9D4EDD",
      description: "Classic French vanilla with warm, creamy undertones. Timeless elegance in every spritz.",
      products: [
        {
          id: "vanilla-1",
          name: "French Vanilla Eau de Parfum",
          price: "$48.00",
          size: "50ml",
          description: "Classic French vanilla in eau de parfum",
          icon: "🌸",
        },
        {
          id: "vanilla-2",
          name: "French Vanilla Cologne",
          price: "$35.00",
          size: "100ml",
          description: "Versatile cologne for everyday elegance",
          icon: "🌾",
        },
        {
          id: "vanilla-3",
          name: "French Vanilla Shower Gel",
          price: "$16.00",
          size: "250ml",
          description: "Luxurious shower gel with cream fragrance",
          icon: "🚿",
        },
        {
          id: "vanilla-4",
          name: "French Vanilla Scent Stick",
          price: "$12.00",
          size: "30g",
          description: "Portable fragrance stick for on-the-go",
          icon: "📍",
        },
      ],
    },
    {
      id: "beach",
      label: "Sex on the Beach (Fruit Tingles)",
      color: "#3A86FF",
      description: "Tropical paradise in a bottle with fruity tingles and exotic beach vibes. Sweet and refreshing.",
      products: [
        {
          id: "beach-1",
          name: "Beach Eau de Parfum",
          price: "$49.00",
          size: "50ml",
          description: "Tropical eau de parfum with fruity notes",
          icon: "🏝️",
        },
        {
          id: "beach-2",
          name: "Beach Cologne",
          price: "$36.00",
          size: "100ml",
          description: "Refreshing cologne for sunny days",
          icon: "☀️",
        },
        {
          id: "beach-3",
          name: "Beach Body Spray",
          price: "$20.00",
          size: "150ml",
          description: "Quick-drying fruity body spray",
          icon: "💦",
        },
        {
          id: "beach-4",
          name: "Beach Room Spray",
          price: "$22.00",
          size: "150ml",
          description: "Instant freshness for any room",
          icon: "🌺",
        },
      ],
    },
    {
      id: "frangipani",
      label: "Frangipani",
      color: "#FFD60A",
      description: "Bright and exotic yellow fragrance with floral frangipani blossoms. Uplifting and energetic.",
      products: [
        {
          id: "frangipani-1",
          name: "Frangipani Eau de Parfum",
          price: "$46.00",
          size: "50ml",
          description: "Exotic floral eau de parfum with frangipani",
          icon: "🌼",
        },
        {
          id: "frangipani-2",
          name: "Frangipani Cologne",
          price: "$33.00",
          size: "100ml",
          description: "Light and uplifting daily cologne",
          icon: "🌻",
        },
        {
          id: "frangipani-3",
          name: "Frangipani Hair Mist",
          price: "$21.00",
          size: "100ml",
          description: "Delicate fragrance mist for hair",
          icon: "💇",
        },
        {
          id: "frangipani-4",
          name: "Frangipani Solid Perfume",
          price: "$19.00",
          size: "10g",
          description: "Portable solid perfume compact",
          icon: "💄",
        },
      ],
    },
  ];

  const active = fragrances.find((f) => f.id === activeFragrance);

  return (
    <div className="fragrances-page">
      <h1>✨ Cal Signature Fragrances</h1>
      <p className="fragrances-intro">Discover our exclusive collection of signature scents, each with its own unique character and charm</p>

      <div className="fragrances-tabs-container">
        <div className="fragrances-tabs">
          {fragrances.map((frag) => (
            <button
              key={frag.id}
              className={`fragrance-tab ${activeFragrance === frag.id ? "active" : ""}`}
              onClick={() => setActiveFragrance(frag.id)}
              style={{
                backgroundColor: activeFragrance === frag.id ? frag.color : "white",
                color: activeFragrance === frag.id ? "white" : frag.color,
                borderColor: frag.color,
              }}
            >
              {frag.label}
            </button>
          ))}
        </div>
      </div>

      {active && (
        <>
          <div className="fragrance-content">
            <div className="fragrance-card" style={{ borderTopColor: active.color }}>
              <div className="fragrance-header" style={{ backgroundColor: active.color }}>
                <h2>{active.label}</h2>
              </div>
              <div className="fragrance-body">
                <p className="fragrance-description">{active.description}</p>
                <div className="fragrance-details">
                  <div className="detail-item">
                    <h4>Fragrance Profile</h4>
                    <p>Premium quality, long-lasting scent with carefully selected ingredients</p>
                  </div>
                  <div className="detail-item">
                    <h4>Best For</h4>
                    <p>All-day wear, special occasions, gifts, personal collection</p>
                  </div>
                  <div className="detail-item">
                    <h4>Longevity</h4>
                    <p>8+ hours of beautiful, sophisticated fragrance</p>
                  </div>
                </div>
                <button className="add-to-cart-btn" style={{ backgroundColor: active.color }}>
                  Add to Cart
                </button>
              </div>
            </div>

            <div className="fragrance-showcase" style={{ backgroundColor: `${active.color}20` }}>
              <div className="showcase-content">
                <div className="fragrance-icon" style={{ backgroundColor: active.color }}>
                  💐
                </div>
                <div className="showcase-text">
                  <h3>{active.label}</h3>
                  <p>Experience the essence of luxury with our signature {active.label.toLowerCase()} fragrance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="products-section">
            <h2 className="products-title">Available Products - {active.label}</h2>
            <div className="products-grid">
              {active.products.map((product) => (
                <div key={product.id} className="product-card" style={{ borderTopColor: active.color }}>
                  <div className="product-icon">{product.icon}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-size">{product.size}</p>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">{product.price}</span>
                    <button
                      className="product-add-btn"
                      style={{
                        backgroundColor: active.color,
                        borderColor: active.color,
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
