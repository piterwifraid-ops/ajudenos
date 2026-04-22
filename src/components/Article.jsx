const destinations = [
  { flag: '🇺🇸', name: 'Estados Unidos', desc: 'IA e Ciência de Dados' },
  { flag: '🇨🇦', name: 'Canadá', desc: 'Desenvolvimento de Software e Inglês' },
  { flag: '🇮🇪', name: 'Irlanda', desc: 'Hubs de Tecnologia e Inovação' },
  { flag: '🇦🇺', name: 'Austrália', desc: 'Tecnologia Sustentável e Programação' },
]

const steps = [
  <><strong>Acesse o Portal Oficial</strong> clicando no botão abaixo</>,
  <><strong>Confirme seus dados</strong> e vínculo com escola pública</>,
  <><strong>Escolha o destino</strong> de sua preferência</>,
  <><strong>Efetue o pagamento do Seguro Obrigatório</strong> para emitir seu Certificado de Intercambista</>,
]

function trackCTAClick() {
  try {
    localStorage.setItem('presell_source', 'g1')
    localStorage.setItem('presell_cta_clicked', 'true')
  } catch (e) {}
}

export default function Article({ location }) {
  const locationText = location ? (
    <>
      Inscrições já estão abertas em{' '}
      <span className="location-highlight">
        {location.city}, {location.state}
      </span>
    </>
  ) : (
    'Inscrições abertas para jovens de 14 a 24 anos'
  )

  const cityText = location ? (
    <>
      O programa já está aceitando inscrições em{' '}
      <span className="location-highlight">
        {location.city}, {location.state}
      </span>{' '}
      e em todo o Brasil
    </>
  ) : (
    'O programa já está aceitando inscrições em sua região'
  )

  return (
    <div className="bg-white max-w-[1000px] mx-auto my-5 p-10 rounded shadow-[0_4px_12px_rgba(0,0,0,0.1)] max-sm:p-5">
      <div className="article-category">EDUCAÇÃO &amp; TECNOLOGIA</div>

      <h1 className="article-title">
        CHAMADA PÚBLICA Nº 04/2026 – SELEÇÃO PARA O PROGRAMA DE MOBILIDADE
        ESTUDANTIL JOVEM NO MUNDO 2026
      </h1>

      <p className="article-subtitle">
        Governo Federal anuncia programa que enviará estudantes para imersão em
        tecnologia e novos idiomas em centros globais de inovação.{' '}
        {locationText}.
      </p>

      <div className="article-meta">
        <span>
          Por <strong>G1</strong> — Brasília
        </span>
        <span>19/04/2026 09h15 • Atualizado há 2 horas</span>
      </div>

      <img
        src="https://jovemnomundo-gov.netlify.app/index_files/bolsa-header.png"
        alt="Programa Jovem no Mundo 2026"
        className="w-full rounded-md mb-2.5 block"
      />
      <div className="image-caption">
        Programa Jovem no Mundo 2026 visa capacitar estudantes em línguas
        estrangeiras e tecnologias emergentes.
        <div className="text-[#bbb] text-xs mt-1">Foto: MEC/Divulgação</div>
      </div>

      <div className="article-content">
        <p>
          O Ministério da Educação (MEC) anunciou nesta quarta-feira a abertura
          das inscrições para o <strong>Programa Jovem no Mundo 2026</strong>. A
          iniciativa visa preparar estudantes brasileiros para o mercado global,
          unindo o aprendizado de novos idiomas com imersão em{' '}
          <strong>
            Inteligência Artificial, Programação e Tecnologias de Ponta
          </strong>
          .
        </p>

        <p>
          O programa é destinado a alunos do ensino fundamental, médio e
          superior da rede pública. Por conta do avanço tecnológico acelerado no
          exterior, o governo busca proporcionar aos jovens brasileiros o
          contato direto com o que há de mais moderno no mundo.
        </p>

        <div className="highlight-box">
          <strong>⚠️ REQUISITO:</strong> Podem participar estudantes de 14 a 24
          anos que estejam cursando ensino fundamental, médio ou faculdade em
          escola pública.
        </div>

        <h2>Foco em Inovação</h2>

        <p>
          Os estudantes selecionados terão acesso a cursos intensivos em países
          que lideram a corrida tecnológica. O objetivo é que voltem ao Brasil
          com domínio de uma nova língua e conhecimentos avançados em
          tecnologia. Os destinos incluem:
        </p>

        <ul className="destination-list">
          {destinations.map((d) => (
            <li key={d.name}>
              <span className="flag">{d.flag}</span>
              <div>
                <strong>{d.name}</strong>
                <br />
                <span className="text-[#666] text-sm">{d.desc}</span>
              </div>
            </li>
          ))}
        </ul>

        <p>
          A bolsa cobre <strong>100% dos custos</strong> de passagens aéreas,
          hospedagem, alimentação, material didático tecnológico e uma ajuda de
          custo mensal (bolsa-auxílio).
        </p>

        <hr className="divider" />

        <h2>Regras do Seguro Saúde Obrigatório</h2>

        <p>
          Embora o MEC cubra todos os custos de viagem e estadia, o regulamento
          internacional de mobilidade acadêmica exige que o estudante seja
          titular de um{' '}
          <strong>Seguro Saúde Internacional Particular (Padrão e-Visa)</strong>.
        </p>

        <p>
          Este seguro é o único custo sob responsabilidade do estudante no ato
          da inscrição, servindo para garantir atendimento médico completo no
          exterior sem custos adicionais para o governo anfitrião. O valor é
          reduzido graças a um subsídio especial do programa federal.
        </p>

        <div className="highlight-box">
          <strong>📍 DISPONIBILIDADE:</strong> {cityText}. A recomendação é
          realizar o cadastro nas próximas 24 horas para garantir sua vaga.
        </div>

        <h2>Como se Inscrever</h2>

        <p>O processo é simples e pode ser feito totalmente pelo celular:</p>

        <ol className="steps-list">
          {steps.map((s, i) => (
            <li key={i}>
              <span>{s}</span>
            </li>
          ))}
        </ol>

        <div className="text-center my-10">
          <a
            href="/cadastro"
            className="cta-button"
            onClick={trackCTAClick}
          >
            ✈️ &nbsp;QUERO FAZER MEU CADASTRO
          </a>
          <p className="text-[13px] text-[#999] mt-2.5 text-center">
            Vagas limitadas por região · Inscrições encerram em breve
          </p>
        </div>
      </div>
    </div>
  )
}
