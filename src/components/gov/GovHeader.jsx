const GOV_LOGO =
  'https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png'

export default function GovHeader() {
  return (
    <header className="gov-header">
      <div className="border-b border-gray-100 pb-3 mb-3">
        <div className="container-gov flex items-center justify-between">
          <div className="flex items-center">
            <img src={GOV_LOGO} alt="gov.br" style={{ height: 40 }} className="mr-4" />
            <div style={{ width: 1, height: 24, background: '#eee', margin: '0 10px' }} />

            <div className="flex flex-col gap-0.5 cursor-pointer">
              <div className="w-1 h-1 bg-[#1351b4] rounded-full" />
              <div className="w-1 h-1 bg-[#1351b4] rounded-full" />
              <div className="w-1 h-1 bg-[#1351b4] rounded-full" />
            </div>

            <div style={{ width: 1, height: 24, background: '#eee', margin: '0 15px' }} />

            <div className="flex items-center gap-5 opacity-70">
              <svg className="w-5 h-5 text-[#1351b4]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.598 11.064a1.006 1.006 0 0 0-.854-.832A7.012 7.012 0 0 1 14.73 3.5a1.006 1.006 0 0 0-1.014-1.014 7.012 7.012 0 0 1-6.733 6.012 1.006 1.006 0 0 0-.832.854 7.012 7.012 0 0 1-1.151 12.148 1.006 1.006 0 0 0 .445 1.956 9.016 9.016 0 1 0 15.153-12.39zM12 19a1 1 0 1 1-1 1 1 1 0 0 1 1-1zm3-3a1 1 0 1 1-1 1 1 1 0 0 1 1-1zm-6 0a1 1 0 1 1-1 1 1 1 0 0 1 1-1zm3-3a1 1 0 1 1-1 1 1 1 0 0 1 1-1zm3-3a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
              </svg>
              <svg className="w-5 h-5 text-[#1351b4]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18V4c4.42 0 8 3.58 8 8s-3.58 8-8 8z" />
              </svg>
              <svg className="w-5 h-5 text-[#1351b4]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
              </svg>
            </div>
          </div>

          <button className="bg-[#1351b4] text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 text-base hover:bg-[#0c326f] transition-all">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            Entrar
          </button>
        </div>
      </div>

      <div className="container-gov flex items-center justify-between pb-2">
        <div className="flex items-center gap-4">
          <svg className="w-8 h-8 text-[#1351b4] cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-xl font-light tracking-tight text-gray-600">
            Ministério da Educação
          </span>
        </div>
        <div className="flex items-center gap-6">
          <svg className="w-6 h-6 text-[#1351b4] cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
          <svg className="w-6 h-6 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </header>
  )
}
