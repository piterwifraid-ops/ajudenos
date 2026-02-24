import { BrowserRouter, Routes, Route } from "react-router-dom";
import AjudeNosPage from "./pages/AjudeNosPage";
import PagamentosPage from "./pages/PagamentosPage";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/ajudenos" element={<AjudeNosPage />} />
      <Route path="/pagamentos" element={<PagamentosPage />} />
      <Route path="*" element={<AjudeNosPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
