import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AjudeNosPage from "./pages/AjudeNosPage";
import PagamentosPage from "./pages/PagamentosPage";

const UTM_KEYS = ["utm_source", "utm_campaign", "utm_medium", "utm_content", "utm_term"];

function UtmPersistor() {
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stored: Record<string, string> = JSON.parse(sessionStorage.getItem("utms") || "{}");
    let found = false;
    UTM_KEYS.forEach((k) => { if (params.has(k)) { stored[k] = params.get(k)!; found = true; } });
    if (found) { sessionStorage.setItem("utms", JSON.stringify(stored)); return; }
    if (Object.keys(stored).length) {
      const url = new URL(window.location.href);
      let changed = false;
      UTM_KEYS.forEach((k) => { if (stored[k] && !url.searchParams.has(k)) { url.searchParams.set(k, stored[k]); changed = true; } });
      if (changed) history.replaceState(null, "", url.toString());
    }
  }, [location]);
  return null;
}

const App = () => (
  <BrowserRouter>
    <UtmPersistor />
    <Routes>
      <Route path="/ajudenos" element={<AjudeNosPage />} />
      <Route path="/pagamentos" element={<PagamentosPage />} />
      <Route path="*" element={<AjudeNosPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
