# Jovem no Mundo — G1 (React + Tailwind)

Página em React + Vite + TailwindCSS replicando o artigo do G1 sobre o Programa Jovem no Mundo 2026.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço exibido pelo Vite (normalmente http://localhost:5173).

## Build de produção

```bash
npm run build
npm run preview
```

## Estrutura

- `src/App.jsx` — Composição da página e fetch de geolocalização via `ipapi.co`.
- `src/components/Header.jsx` — Cabeçalho G1 com data/hora.
- `src/components/Article.jsx` — Corpo do artigo.
- `src/components/Footer.jsx` — Rodapé G1.
- `src/index.css` — Tailwind + estilos utilitários personalizados.
- `tailwind.config.js` — Cores e fontes customizadas.
