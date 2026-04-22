import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop.jsx'
import App from './App.jsx'
import Cadastro from './pages/Cadastro.jsx'
import ValidarDados from './pages/ValidarDados.jsx'
import ValidacaoEmAndamento from './pages/ValidacaoEmAndamento.jsx'
import Questionario from './pages/Questionario.jsx'
import Endereco from './pages/Endereco.jsx'
import ConsultaRegional from './pages/ConsultaRegional.jsx'
import InstituicaoProva from './pages/InstituicaoProva.jsx'
import Selecao from './pages/Selecao.jsx'
import TermoCompromisso from './pages/TermoCompromisso.jsx'
import AgendarProva from './pages/AgendarProva.jsx'
import GerandoProtocolo from './pages/GerandoProtocolo.jsx'
import Solicitacao from './pages/Solicitacao.jsx'
import PagamentoPix from './pages/PagamentoPix.jsx'
import PresseG1 from './pages/PresseG1.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PresseG1 />} />
        <Route path="/app" element={<App />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/validar-dados" element={<ValidarDados />} />
        <Route path="/validacao-em-andamento" element={<ValidacaoEmAndamento />} />
        <Route path="/questionario" element={<Questionario />} />
        <Route path="/endereco" element={<Endereco />} />
        <Route path="/consulta-regional" element={<ConsultaRegional />} />
        <Route path="/instituicao-prova" element={<InstituicaoProva />} />
        <Route path="/selecao" element={<Selecao />} />
        <Route path="/termo-compromisso" element={<TermoCompromisso />} />
        <Route path="/agendar-prova" element={<AgendarProva />} />
        <Route path="/gerando-protocolo" element={<GerandoProtocolo />} />
        <Route path="/solicitacao" element={<Solicitacao />} />
        <Route path="/pagamento-pix" element={<PagamentoPix />} />
        <Route path="/presse-g1" element={<PresseG1 />} />
        <Route path="/presell-g1" element={<PresseG1 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
