import { useEffect, useState } from 'react'

export default function Header() {
  const [dateTime, setDateTime] = useState('')

  useEffect(() => {
    const now = new Date()
    const dateStr = now.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    const timeStr = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    setDateTime(`${dateStr} • ${timeStr}`)
  }, [])

  return (
    <header className="bg-g1red text-white py-2.5">
      <div className="max-w-[1000px] mx-auto px-5 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="text-[30px] font-black italic">g1</span>
          <nav className="flex gap-4 text-[13px] font-bold">
            <span className="opacity-75 cursor-pointer">POLÍTICA</span>
            <span className="opacity-75 cursor-pointer">ECONOMIA</span>
            <span className="border-b-[3px] border-white pb-0.5 cursor-pointer">
              TECNOLOGIA
            </span>
            <span className="opacity-75 cursor-pointer">EDUCAÇÃO</span>
          </nav>
        </div>
        <span className="text-xs opacity-80">{dateTime}</span>
      </div>
    </header>
  )
}
