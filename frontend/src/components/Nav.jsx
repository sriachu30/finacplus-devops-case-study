import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV_ITEMS } from '../data/sections'
import { useActiveSection } from '../hooks/useActiveSection'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const activeId = useActiveSection(NAV_ITEMS.map((n) => n.id))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (id) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-base-950/90 backdrop-blur border-b border-line' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container-industrial flex items-center justify-between h-16">
        <button
          onClick={() => goTo('hero')}
          className="flex items-baseline gap-2 group"
          aria-label="FUSE — scroll to top"
        >
          <span className="font-display font-extrabold text-lg tracking-tight text-paper">
            FUSE
          </span>
          <span className="hidden md:inline font-mono text-[10px] tracking-widest2 uppercase text-paper-faint group-hover:text-amber-bright transition-colors">
            /finacplus
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => goTo(item.id)}
              className={`px-3 py-2 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors border-b-2 ${
                activeId === item.id
                  ? 'text-paper border-amber'
                  : 'text-paper-faint border-transparent hover:text-paper-dim'
              }`}
              aria-current={activeId === item.id ? 'true' : undefined}
            >
              {item.num} / {item.label}
            </button>
          ))}
        </nav>

        <button
          className="md:hidden text-paper p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav
          className="md:hidden border-t border-line bg-base-950 px-6 py-4 flex flex-col gap-1"
          aria-label="Primary mobile"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => goTo(item.id)}
              className={`text-left py-2.5 font-mono text-xs tracking-[0.12em] uppercase ${
                activeId === item.id ? 'text-amber-bright' : 'text-paper-dim'
              }`}
            >
              {item.num} / {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  )
}
