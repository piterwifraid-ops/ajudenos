import { BrowserRouter, Routes, Route } from "react-router-dom";
import AjudeNosPage from "./pages/AjudeNosPage";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/ajudenos" element={<AjudeNosPage />} />
      <Route path="*" element={<AjudeNosPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
