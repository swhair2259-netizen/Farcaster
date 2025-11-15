import { useEffect } from "react";

interface EcwidShopProps {
  storeId: string;
}

export function EcwidShop({ storeId }: EcwidShopProps) {
  useEffect(() => {
    // Load Ecwid script dynamically and render the product browser
    if (typeof window !== "undefined") {
      // If the script for this store isn't already present, add it
      const scriptSelector = `script[src*="app.ecwid.com/script.js?${storeId}"]`;
      if (!document.querySelector(scriptSelector)) {
        const script = document.createElement("script");
        script.src = `https://app.ecwid.com/script.js?${storeId}`;
        script.async = true;
        script.onload = () => {
          if (window.ec) {
            window.ec.config = { store_id: parseInt(storeId) };
          }

          // Try to call Ecwid's xProductBrowser to render the catalog (shows all products)
          try {
            const fn = (window as any).xProductBrowser;
            const idParam = `id=${storeId}`;
            const args = [
              "categoriesPerRow=3",
              "views=grid(100,3)",
              "categoryView=grid",
              "searchView=list",
              idParam,
            ];

            if (typeof fn === "function") {
              fn.apply(null, args);
            } else {
              const inline = document.createElement("script");
              inline.type = "text/javascript";
              inline.innerHTML = `xProductBrowser(${args.map((a) => JSON.stringify(a)).join(",")});`;
              document.body.appendChild(inline);
            }
          } catch (e) {
            // silently ignore — script may not expose xProductBrowser immediately in some contexts
          }
        };
        document.body.appendChild(script);
      } else {
        // script exists (maybe from other component) — try to call the product browser immediately
        const fn = (window as any).xProductBrowser;
        if (typeof fn === "function") {
          fn("categoriesPerRow=3", "views=grid(100,3)", "categoryView=grid", "searchView=list", `id=${storeId}`);
        }
      }
    }
  }, [storeId]);

  return (
    <div className="ecwid-shop-container">
      <h1>Gem Candles Shop</h1>
      <div id={`my-store-${storeId}`}></div>
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
