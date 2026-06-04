import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CrystalThemeProvider } from "./theme/CrystalThemeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CrystalThemeProvider>
      <App />
    </CrystalThemeProvider>
  </StrictMode>
);
