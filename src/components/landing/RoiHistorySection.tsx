'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Reveal from '../Reveal'
import LupaVehicleReveal from '../LupaVehicleReveal'

/** Anima a contagem de um número quando ele muda.
 *  Respeita prefers-reduced-motion (mostra o valor final sem animar). */
function useCountUp(target: number, duration = 600) {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValue(target)
      return
    }
    const from = fromRef.current
    if (from === target) {
      setValue(target)
      return
    }
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(from + (target - from) * eased))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = target
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration])

  return { value }
}

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const ANTES_FLOW = [
  'Frota de veículos',
  'Fotos espalhadas',
  'WhatsApp',
  'Planilhas',
  'Discussões',
  'Danos não identificados',
  'Perda absorvida pela empresa',
]

const DEPOIS_FLOW = [
  'Frota de veículos',
  'Histórico centralizado',
  'Comparação entre inspeções',
  'Novo dano identificado',
  'Evidência organizada',
  'Documentação',
  'Maior controle sobre perdas',
]

const CUSTO_INVISIVEL = [
  { n: '01', title: 'Dano não identificado', desc: 'Passa despercebido entre uma inspeção e outra.' },
  { n: '02', title: 'Evidência perdida', desc: 'Foto no celular ou mensagem solta não prova nada.' },
  { n: '03', title: 'Cobrança contestada', desc: 'Sem registro, a discussão é decidida na tentativa.' },
  { n: '04', title: 'Prejuízo absorvido', desc: 'A empresa arca com o custo que poderia ter sido cobrado.' },
]

function FlowStep({ label, tone, highlight = false }: { label: string; tone: 'before' | 'after'; highlight?: boolean }) {
  return (
    <li
      className={
        'flex items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold ' +
        (highlight
          ? 'border border-[var(--signal-bright)]/60 bg-[color-mix(in_srgb,var(--signal)_12%,transparent)] text-[var(--signal-bright)] text-sm sm:text-base'
          : 'border border-[var(--card-border)] bg-[var(--bg-main)]/70 text-[var(--text-main)]')
      }
    >
      <span>{label}</span>
      {tone === 'after' && (
        <span aria-hidden className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">
          ✓
        </span>
      )}
    </li>
  )
}

function FlowArrow() {
  return (
    <li aria-hidden className="flex justify-center text-[var(--card-border)] leading-none">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </li>
  )
}

function parseNumber(value: string): number {
  // aceita "800.50" e tambem "800,50" (PT-BR): normaliza virgula para ponto
  const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.')
  const n = Number(cleaned)
  return Number.isFinite(n) && n > 0 ? n : 0
}

export default function RoiHistorySection() {
  const [vehicles, setVehicles] = useState('500')
  const [avgDamage, setAvgDamage] = useState('800')
  const [losses, setLosses] = useState('10')

  const { monthly, annual } = useMemo(() => {
    const danos = parseNumber(losses)
    const valor = parseNumber(avgDamage)
    const mes = danos * valor
    return { monthly: mes, annual: mes * 12 }
  }, [losses, avgDamage])

  const monthlyCount = useCountUp(monthly)
  const annualCount = useCountUp(annual)

  return (
    <section
      id="custo-historico"
      className="w-full max-w-6xl mx-auto py-20 px-6 z-10 relative border-t border-[var(--card-border)]/40"
    >
      {/* HEADER */}
      <Reveal className="text-center mb-12 flex flex-col items-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <LupaVehicleReveal size={40} className="hidden sm:inline-flex" />
          <p className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[var(--text-main)]">
            Danos Aparentes
          </p>
        </div>
        <div className="inline-flex items-center gap-2 font-mono-data text-[11px] tracking-[0.2em] text-[var(--signal-bright)] uppercase mb-4">
          <span aria-hidden className="w-4 h-px bg-[var(--sheet-line)]" />
          Custo operacional · Por que importa
          <span aria-hidden className="w-4 h-px bg-[var(--sheet-line)]" />
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-[0.95] text-[var(--text-main)] [text-wrap:balance] max-w-3xl">
          Quanto custa não ter histórico?
        </h2>
        <p className="mt-4 max-w-2xl text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
          Quando um dano não é identificado, documentado e comprovado, ele pode virar prejuízo.
        </p>
        <p className="mt-2 max-w-2xl text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
          O Danos Aparentes transforma inspeções isoladas em um histórico contínuo de cada veículo.
        </p>
      </Reveal>

      {/* ANTES / DEPOIS */}
      <Reveal>
        <div className="relative rounded-2xl border border-[var(--card-border)] bg-[var(--panel-bg)]/50 overflow-hidden px-4 sm:px-8 py-8 sm:py-10">
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50 pointer-events-none"
          />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {/* ANTES */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--bg-main)]/70 px-5 py-6">
              <h3 className="text-center font-display text-lg sm:text-xl font-bold uppercase tracking-tight text-[var(--text-muted)] mb-5">
                Antes · Sem histórico estruturado
              </h3>
              <ol className="flex flex-col gap-1.5 list-none m-0 p-0">
                {ANTES_FLOW.map((step, i) => (
                  <div key={step}>
                    <FlowStep label={step} tone="before" highlight={i === ANTES_FLOW.length - 1} />
                    {i < ANTES_FLOW.length - 1 && <FlowArrow />}
                  </div>
                ))}
              </ol>
            </div>

            {/* DEPOIS */}
            <div className="rounded-xl border border-[var(--signal-bright)]/35 bg-[color-mix(in_srgb,var(--signal)_8%,transparent)] px-5 py-6">
              <h3 className="text-center font-display text-lg sm:text-xl font-bold uppercase tracking-tight text-[var(--signal-bright)] mb-5">
                Depois · Com Danos Aparentes
              </h3>
              <ol className="flex flex-col gap-1.5 list-none m-0 p-0">
                {DEPOIS_FLOW.map((step, i) => (
                  <div key={step}>
                    <FlowStep label={step} tone="after" />
                    {i < DEPOIS_FLOW.length - 1 && <FlowArrow />}
                  </div>
                ))}
              </ol>
            </div>
          </div>

          <p className="relative mt-8 text-center font-mono-data text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[var(--text-muted)]">
            Plataforma Brasileira de Inteligência Histórica Veicular
          </p>
        </div>
      </Reveal>

      {/* O CUSTO INVISÍVEL */}
      <Reveal className="mt-16">
        <h3 className="text-center font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[var(--text-main)] mb-8">
          O custo invisível
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CUSTO_INVISIVEL.map((item) => (
            <div key={item.n} className="rounded-xl border border-[var(--card-border)] bg-[var(--panel-bg)]/60 px-5 py-6">
              <span className="font-mono-data text-2xl font-black text-[var(--signal-bright)] tracking-tight">{item.n}</span>
              <p className="mt-3 text-sm font-bold text-[var(--text-main)] leading-snug">{item.title}</p>
              <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-lg sm:text-xl font-semibold text-[var(--text-main)] [text-wrap:balance] max-w-2xl mx-auto leading-snug">
          O problema não é apenas o dano. É não conseguir provar quando ele aconteceu.
        </p>
      </Reveal>

      {/* SIMULADOR DE ROI */}
      <Reveal className="mt-16 text-center flex flex-col items-center">
        <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[var(--signal-bright)] mb-3 max-w-2xl [text-wrap:balance]">
          Pequenos danos se repetem. O custo também.
        </h3>
        <p className="max-w-xl text-sm sm:text-base text-[var(--text-muted)] leading-relaxed mb-8">
          Descubra quanto essas perdas podem representar na sua operação.
        </p>
      </Reveal>
      <Reveal className="mt-16">
        <div className="relative rounded-2xl border border-[var(--card-border)] bg-[var(--panel-bg)]/60 overflow-hidden px-5 sm:px-8 py-8 sm:py-10">
          <h3 className="text-center font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[var(--text-main)] mb-2">
            Simule o impacto na sua operação
          </h3>
          <p className="text-center text-sm text-[var(--text-muted)] mb-8 max-w-xl mx-auto">
            Ajuste os valores à sua realidade. É uma estimativa ilustrativa — não é promessa de economia.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Quantidade de veículos</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={vehicles}
                onChange={(e) => setVehicles(e.target.value)}
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--bg-main)] px-4 py-3.5 text-base font-semibold text-[var(--text-main)] outline-none focus-visible:ring-2 ring-[var(--primary)]"
                aria-label="Quantidade de veículos"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Valor médio de um dano não recuperado</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={avgDamage}
                onChange={(e) => setAvgDamage(e.target.value)}
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--bg-main)] px-4 py-3.5 text-base font-semibold text-[var(--text-main)] outline-none focus-visible:ring-2 ring-[var(--primary)]"
                aria-label="Valor médio de um dano não recuperado em reais"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Danos não identificados por mês</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={losses}
                onChange={(e) => setLosses(e.target.value)}
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--bg-main)] px-4 py-3.5 text-base font-semibold text-[var(--text-main)] outline-none focus-visible:ring-2 ring-[var(--primary)]"
                aria-label="Danos não identificados por mês"
              />
            </label>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--bg-main)]/70 px-6 py-6 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Potencial de perdas não identificadas</p>
              <p className="mt-2 font-display text-3xl sm:text-4xl font-black text-[var(--text-main)] tracking-tight">
                <span>{brl.format(monthlyCount.value)}</span>
                <span className="text-base sm:text-lg font-bold text-[var(--text-muted)]">/mês</span>
              </p>
            </div>
            <div className="rounded-xl border border-[var(--signal-bright)]/35 bg-[color-mix(in_srgb,var(--signal)_8%,transparent)] px-6 py-6 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--signal-bright)]">Projeção anual</p>
              <p className="mt-2 font-display text-3xl sm:text-4xl font-black text-[var(--signal-bright)] tracking-tight">
                <span>{brl.format(annualCount.value)}</span>
                <span className="text-base sm:text-lg font-bold text-[var(--text-muted)]">/ano</span>
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] text-[var(--text-muted)] leading-relaxed max-w-xl mx-auto">
            Estimativa ilustrativa baseada nos valores informados (danos não identificados × valor médio do dano, × 12 para o ano).
            O número de veículos aparece como contexto da operação. Os resultados reais variam conforme a empresa.
          </p>
          <p className="mt-3 text-center font-mono-data text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-[var(--signal-bright)]/90">
            Veja como pequenos eventos podem gerar grandes perdas ao longo de uma operação.
          </p>
        </div>
      </Reveal>

      {/* ARGUMENTO DE VENDA */}
      <Reveal className="mt-16 text-center flex flex-col items-center">
        <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[var(--text-main)] mb-4 max-w-2xl [text-wrap:balance]">
          É aqui que o histórico começa a fazer diferença.
        </h3>
        <p className="max-w-2xl text-sm sm:text-base text-[var(--text-muted)] leading-relaxed mb-2">
          O Danos Aparentes organiza cada inspeção, evidência e alteração do veículo em uma linha do tempo.
          Assim, sua equipe consegue identificar o que já existia, o que apareceu depois e quais evidências sustentam cada registro.
        </p>
        <p className="max-w-2xl text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-7">
          Cada dano não documentado é uma possível perda. Cada evidência organizada aumenta sua capacidade de comprovar.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="#como-funciona"
            className="group/cta px-8 py-4 min-h-12 text-white font-black rounded-xl shadow-2xl shadow-[var(--primary)]/25 inline-flex items-center gap-2.5 transition-colors duration-150 hover:opacity-95 active:opacity-90 focus-visible:ring-2 ring-[var(--primary)] ring-offset-4 ring-offset-[var(--bg-main)] outline-none"
            style={{ backgroundImage: 'var(--primary-btn-gradient)' }}
          >
            Quero proteger minha operação
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-150 group-hover/cta:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
          <a
            href="#como-funciona"
            className="px-6 py-4 min-h-12 rounded-xl border border-[var(--card-border)] text-sm font-bold text-[var(--text-main)] hover:bg-[var(--btn-secondary-bg)] transition-colors focus-visible:ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--bg-main)] outline-none inline-flex items-center"
          >
            Conhecer a plataforma
          </a>
        </div>
      </Reveal>

      {/* DANO -> EVIDÊNCIA -> ... -> DECISÃO */}
      <Reveal className="mt-16">
        <p className="text-center font-mono-data text-[11px] tracking-[0.2em] text-[var(--signal-bright)] uppercase mb-6">
          Da ocorrência à decisão
        </p>
        <ol className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-1 list-none m-0 p-0">
          {['Dano', 'Evidência', 'Histórico', 'Comparação', 'Decisão'].map((step, i, arr) => (
            <li key={step} className="flex items-center gap-2 sm:gap-1">
              <span className="rounded-lg border border-[var(--card-border)] bg-[var(--panel-bg)]/70 px-4 py-2.5 text-sm font-bold text-[var(--text-main)]">
                {step}
              </span>
              {i < arr.length - 1 && (
                <span aria-hidden className="text-[var(--signal-bright)] px-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ol>
        <p className="mt-6 text-center text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl mx-auto">
          O histórico transforma acontecimentos isolados em informação. Cada inspeção alimenta a memória contínua do veículo.
        </p>
      </Reveal>

      {/* CTA FINAL DA SEÇÃO */}
      <Reveal className="mt-16 text-center flex flex-col items-center">
        <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[var(--text-main)] mb-4 max-w-2xl [text-wrap:balance]">
          Sua frota já tem um histórico. A questão é: você consegue enxergá-lo?
        </h3>
        <p className="max-w-xl text-sm sm:text-base text-[var(--text-muted)] leading-relaxed mb-7">
          Transforme inspeções isoladas em uma memória contínua de cada veículo.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="/app"
            className="group/cta px-8 py-4 min-h-12 text-white font-black rounded-xl shadow-2xl shadow-[var(--primary)]/25 inline-flex items-center gap-2.5 transition-colors duration-150 hover:opacity-95 active:opacity-90 focus-visible:ring-2 ring-[var(--primary)] ring-offset-4 ring-offset-[var(--bg-main)] outline-none"
            style={{ backgroundImage: 'var(--primary-btn-gradient)' }}
          >
            Começar agora
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-150 group-hover/cta:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
          <a
            href="#como-funciona"
            className="px-6 py-4 min-h-12 rounded-xl border border-[var(--card-border)] text-sm font-bold text-[var(--text-main)] hover:bg-[var(--btn-secondary-bg)] transition-colors focus-visible:ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--bg-main)] outline-none inline-flex items-center"
          >
            Ver como funciona
          </a>
        </div>
      </Reveal>
    </section>
  )
}
