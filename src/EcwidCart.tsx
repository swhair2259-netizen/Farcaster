import { useEffect } from "react";

interface EcwidCartProps {
  storeId: string;
}

export function EcwidCart({ storeId }: EcwidCartProps) {
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
    <div className="ecwid-cart-container">
      <div id="ecwid-minicart"></div>
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
