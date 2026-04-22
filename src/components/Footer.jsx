export default function Footer() {
  return (
    <footer className="bg-g1red text-white pt-10 pb-5 mt-[60px]">
      <div className="max-w-[1000px] mx-auto px-5">
        <div className="flex items-baseline gap-2.5 mb-[30px] border-b border-white/20 pb-5">
          <span className="text-[28px] font-black italic">g1</span>
          <span className="text-sm opacity-90">últimas notícias</span>
        </div>
        <div className="flex justify-between items-center text-[11px] flex-wrap gap-[15px] max-sm:flex-col max-sm:items-start">
          <div className="opacity-80">
            © Copyright 2000-2026 Globo Comunicação e Participações S.A.
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <a href="#" className="text-white no-underline opacity-80 hover:opacity-100 hover:underline">princípios editoriais</a>
            <span className="opacity-30">|</span>
            <a href="#" className="text-white no-underline opacity-80 hover:opacity-100 hover:underline">política de privacidade</a>
            <span className="opacity-30">|</span>
            <a href="#" className="text-white no-underline opacity-80 hover:opacity-100 hover:underline">minha conta</a>
            <span className="opacity-30">|</span>
            <a href="#" className="text-white no-underline opacity-80 hover:opacity-100 hover:underline">anuncie conosco</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
