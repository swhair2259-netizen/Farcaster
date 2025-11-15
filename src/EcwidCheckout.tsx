import { useEffect } from "react";

interface EcwidCheckoutProps {
  storeId: string;
}

export function EcwidCheckout({ storeId }: EcwidCheckoutProps) {
  useEffect(() => {
    // Load Ecwid script dynamically
    if (!window.ec) {
      const script = document.createElement("script");
      script.src = "https://app.ecwid.com/script.js?1";
      script.async = true;
      script.onload = () => {
        if (window.ec) {
          window.ec.config = { store_id: parseInt(storeId) };
        }
      };
      document.body.appendChild(script);
    }
  }, [storeId]);

  return (
    <div className="ecwid-checkout-container">
      <h1>Checkout</h1>
      <div id="ecwid-checkout"></div>
    </div>
  );
}

// Declare Ecwid global object
declare global {
  interface Window {
    ec?: {
      config?: {
        store_id: number;
      };
    };
  }
}
