import { sdk } from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { EcwidCart } from "./EcwidCart";
import { EcwidShop } from "./EcwidShop";
import { EcwidCheckout } from "./EcwidCheckout";
import { SocialMediaPage } from "./SocialMediaPage";
import { CalSignatureFragrances } from "./CalSignatureFragrances";
import { ContactUs } from "./ContactUs";
import "./EcwidCart.css";
import "./App.css";

// Replace with your Ecwid store ID
const ECWID_STORE_ID = "649213";

type Page = "home" | "shop" | "checkout" | "social" | "fragrances" | "contact";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🕯️ Gem Candles</h1>
          <nav className="app-nav">
            <button
              className={`nav-button ${currentPage === "home" ? "active" : ""}`}
              onClick={() => setCurrentPage("home")}
            >
              Home
            </button>
            <button
              className={`nav-button ${currentPage === "shop" ? "active" : ""}`}
              onClick={() => setCurrentPage("shop")}
            >
              Shop
            </button>
            <button
              className={`nav-button ${currentPage === "checkout" ? "active" : ""}`}
              onClick={() => setCurrentPage("checkout")}
            >
              Checkout
            </button>
            <button
              className={`nav-button ${currentPage === "social" ? "active" : ""}`}
              onClick={() => setCurrentPage("social")}
            >
              Community
            </button>
            <button
              className={`nav-button ${currentPage === "fragrances" ? "active" : ""}`}
              onClick={() => setCurrentPage("fragrances")}
            >
              Fragrances
            </button>
            <button
              className={`nav-button ${currentPage === "contact" ? "active" : ""}`}
              onClick={() => setCurrentPage("contact")}
            >
              Contact
            </button>
          </nav>
          <div className="header-right">
            <div className="header-cart">
              <EcwidCart storeId={ECWID_STORE_ID} />
            </div>
            <div className="header-wallet">
              <ConnectMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        {currentPage === "home" && (
          <div className="home-page">
            <div className="hero-section">
              <h2>Welcome to Gem Candles</h2>
              <p>Premium handcrafted candles with stunning crystalline designs</p>
              <button className="cta-button" onClick={() => setCurrentPage("shop")}>
                Explore Our Collection
              </button>
            </div>
          </div>
        )}

        {currentPage === "shop" && <EcwidShop storeId={ECWID_STORE_ID} />}

        {currentPage === "checkout" && <EcwidCheckout storeId={ECWID_STORE_ID} />}

        {currentPage === "social" && <SocialMediaPage />}

        {currentPage === "fragrances" && <CalSignatureFragrances />}
        {currentPage === "contact" && <ContactUs />}
      </main>
    </div>
  );
}

function ConnectMenu() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  if (isConnected) {
    return (
      <>
        <div>Connected account:</div>
        <div>{address}</div>
        <SignButton />
      </>
    );
  }

  return (
    <button type="button" onClick={() => connect({ connector: connectors[0] })}>
      Connect
    </button>
  );
}

function SignButton() {
  const { signMessage, isPending, data, error } = useSignMessage();

  return (
    <>
      <button type="button" onClick={() => signMessage({ message: "hello world" })} disabled={isPending}>
        {isPending ? "Signing..." : "Sign message"}
      </button>
      {data && (
        <>
          <div>Signature</div>
          <div>{data}</div>
        </>
      )}
      {error && (
        <>
          <div>Error</div>
          <div>{error.message}</div>
        </>
      )}
    </>
  );
}

export default App;
