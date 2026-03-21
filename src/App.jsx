import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Zap, FileSearch, ShieldCheck, ArrowRight, Menu, X,
  Sparkles, TrendingUp, TrendingDown, Minus,
  Database, Settings, MessageSquare, CheckCircle2,
} from "lucide-react";

// ─── Tipografia com proporção áurea ───────────────────────────────────────────
const GOLDEN = 1.618;
const BASE_FONT = 16;
const fontScale = {
  xs:   `${BASE_FONT / GOLDEN}px`,
  sm:   `${BASE_FONT}px`,
  base: `${BASE_FONT * GOLDEN}px`,
  lg:   `${BASE_FONT * GOLDEN ** 2}px`,
  xl:   `${BASE_FONT * GOLDEN ** 3}px`,
  '2xl':`${BASE_FONT * GOLDEN ** 4}px`,
};
const space = {
  1: '8px',
  2: `${8 * GOLDEN}px`,
  3: `${8 * GOLDEN ** 2}px`,
  4: `${8 * GOLDEN ** 3}px`,
  5: `${8 * GOLDEN ** 4}px`,
  6: `${8 * GOLDEN ** 5}px`,
};
const SERIF = { fontFamily: "'Times New Roman', Times, Georgia, serif" };
const SANS  = { fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" };
const PRISMA_COLOR = "#056CF2";

// ─── Motion variants ──────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.82, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.13 } },
};

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden:  { opacity: 0, y: 34 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.82, ease: [0.16, 1, 0.3, 1], delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── PRIORIDADE 6: Queries cirúrgicas que impressionam o executivo ────────────
const AI_RESPONSES = [
  {
    query: "Qual a taxa de conversão do funil de vendas nos últimos 6 meses, por canal?",
    summary: "Funil de Vendas · Jan–Jun 2024",
    insight: "Canal Referral lidera com **52,1%** de conversão. Outbound caiu 11 p.p. no semestre — requer revisão de abordagem.",
    trend: "up",
    kpis: [
      { label: "Referral",  value: "52,1%" },
      { label: "Inbound",   value: "38,4%" },
      { label: "Outbound",  value: "14,2%" },
    ],
    chartType: "bar-horizontal",
    chartData: [
      { label: "Cold",     value: 8.3  },
      { label: "Ads",      value: 12.1 },
      { label: "Outbound", value: 14.2 },
      { label: "Inbound",  value: 38.4 },
      { label: "Referral", value: 52.1 },
    ],
    highlight: 4,
  },
  {
    query: "Top 5 clientes por LTV — qual a margem líquida de cada um?",
    summary: "LTV vs. Margem · Carteira Ativa",
    insight: "**Grupo Valore** tem o maior LTV mas margem 9 p.p. abaixo da média — alerta de precificação que nenhum dashboard mostrou.",
    trend: "up",
    kpis: [
      { label: "LTV Médio",   value: "R$ 284K" },
      { label: "Margem Média",value: "31,2%"   },
      { label: "Top 5 Total", value: "R$ 1,94M"},
    ],
    chartType: "bar",
    chartData: [
      { label: "MedTech",    value: 24.1 },
      { label: "LogPrime",   value: 27.8 },
      { label: "RealCap",    value: 29.3 },
      { label: "Ind.X",      value: 34.6 },
      { label: "G. Valore",  value: 22.3 },
    ],
    highlight: 3,
  },
  {
    query: "Inadimplência +90 dias cruzada por segmento e vendedor responsável.",
    summary: "Inadimplência Crítica · +90 dias",
    insight: "**R$ 2,1 M** em risco real. Segmento Varejo concentra 67% — 3 vendedores com exposição acima do limite permitido.",
    trend: "down",
    kpis: [
      { label: "Exposição Total",    value: "R$ 2,1M" },
      { label: "Vendedores Críticos",value: "3"       },
      { label: "Concentração Varejo",value: "67%"     },
    ],
    chartType: "bar",
    chartData: [
      { label: "Indústria", value: 0.29 },
      { label: "Serviços",  value: 0.41 },
      { label: "B2B Tech",  value: 0.38 },
      { label: "Varejo",    value: 1.41 },
    ],
    highlight: 3,
  },
  {
    query: "Evolução da receita recorrente vs pontual no último trimestre por BU.",
    summary: "ARR vs. Receita Pontual · Q3 2024",
    insight: "BU Sul cresceu ARR em **+28%**. BU Norte ainda depende 74% de receita pontual — risco de churn estrutural.",
    trend: "up",
    kpis: [
      { label: "ARR Total",    value: "R$ 38,4M" },
      { label: "% Recorrente", value: "61,3%"    },
      { label: "Crescimento",  value: "+28% Sul"  },
    ],
    chartType: "area",
    chartData: [
      { label: "Jan", value: 28.1 },
      { label: "Fev", value: 29.4 },
      { label: "Mar", value: 31.2 },
      { label: "Abr", value: 32.8 },
      { label: "Mai", value: 35.1 },
      { label: "Jun", value: 36.4 },
      { label: "Jul", value: 35.9 },
      { label: "Ago", value: 37.2 },
      { label: "Set", value: 38.4 },
    ],
    highlight: 8,
  },
  {
    query: "Qual filial teve maior variação de custo operacional vs mês anterior?",
    summary: "Custo Operacional · Variação Mensal",
    insight: "Filial **Recife** registrou alta de 34% no custo operacional — desvio 3x acima da média histórica das outras filiais.",
    trend: "down",
    kpis: [
      { label: "Maior Variação", value: "+34% REC"   },
      { label: "Média Geral",    value: "+8,2%"       },
      { label: "Filiais Alerta", value: "2"           },
    ],
    chartType: "bar-negative",
    chartData: [
      { label: "POA", value: 3.1  },
      { label: "BH",  value: 5.8  },
      { label: "CPS", value: 7.2  },
      { label: "SP",  value: 11.4 },
      { label: "REC", value: 34.0 },
    ],
    highlight: 4,
  },
];

// ─── SVG Charts ───────────────────────────────────────────────────────────────
function BarChartSVG({ data, highlight, negative = false }) {
  const W = 480, H = 140;
  const padL = 32, padR = 8, padT = 8, padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxVal = Math.max(...data.map(d => d.value));
  const barW = Math.min(36, (chartW / data.length) * 0.55);
  const gap  = chartW / data.length;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => ({ y: padT + chartH - t * chartH, val: (maxVal * t).toFixed(1) }));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ display: "block" }}>
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={padL} y1={t.y} x2={W - padR} y2={t.y} stroke="#f4f4f5" strokeWidth="1" />
          <text x={padL - 4} y={t.y + 3.5} textAnchor="end" fontSize="9" fill="#a1a1aa" fontFamily="Inter,sans-serif">{t.val}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const barH = (d.value / maxVal) * chartH;
        const x    = padL + gap * i + gap / 2 - barW / 2;
        const y    = padT + chartH - barH;
        const isHL = i === highlight;
        const fill = negative ? (isHL ? PRISMA_COLOR : "#fca5a5") : (isHL ? PRISMA_COLOR : "#d4d4d8");
        const r    = 4;
        return (
          <g key={i}>
            <path d={`M${x+r},${y} h${barW-2*r} a${r},${r} 0 0 1 ${r},${r} v${barH-r} h${-barW} v${-(barH-r)} a${r},${r} 0 0 1 ${r},${-r}z`} fill={fill} />
            <text x={x+barW/2} y={H-padB+12} textAnchor="middle" fontSize="9"
              fill={isHL ? PRISMA_COLOR : "#a1a1aa"} fontWeight={isHL ? "600" : "400"} fontFamily="Inter,sans-serif">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function BarHorizontalSVG({ data, highlight }) {
  const W = 480, H = 160;
  const padL = 48, padR = 40, padT = 4, padB = 4;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxVal = Math.max(...data.map(d => d.value));
  const barH   = Math.min(16, (chartH / data.length) * 0.6);
  const rowH   = chartH / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ display: "block" }}>
      {data.map((d, i) => {
        const barW = (d.value / maxVal) * chartW;
        const y    = padT + rowH * i + rowH / 2 - barH / 2;
        const isHL = i === highlight;
        const r    = 4;
        return (
          <g key={i}>
            <text x={padL - 6} y={y + barH / 2 + 3.5} textAnchor="end" fontSize="10"
              fill={isHL ? PRISMA_COLOR : "#71717a"} fontWeight={isHL ? "600" : "400"} fontFamily="Inter,sans-serif">
              {d.label}
            </text>
            <rect x={padL} y={y} width={chartW} height={barH} rx={r} fill="#f4f4f5" />
            <rect x={padL} y={y} width={barW}   height={barH} rx={r} fill={isHL ? PRISMA_COLOR : "#d4d4d8"} />
            <text x={padL + barW + 5} y={y + barH / 2 + 3.5} fontSize="9"
              fill={isHL ? PRISMA_COLOR : "#a1a1aa"} fontWeight={isHL ? "700" : "400"} fontFamily="Inter,sans-serif">
              {d.value}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function AreaChartSVG({ data, highlight }) {
  const W = 480, H = 140;
  const padL = 32, padR = 8, padT = 10, padB = 24;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const minVal = Math.min(...data.map(d => d.value));
  const maxVal = Math.max(...data.map(d => d.value));
  const range  = maxVal - minVal || 1;
  const px = i   => padL + (i / (data.length - 1)) * chartW;
  const py = val => padT + chartH - ((val - minVal) / range) * chartH;
  const points   = data.map((d, i) => `${px(i)},${py(d.value)}`).join(" ");
  const areaPath = `M${px(0)},${py(data[0].value)} ` +
    data.slice(1).map((d, i) => `L${px(i+1)},${py(d.value)}`).join(" ") +
    ` L${px(data.length-1)},${padT+chartH} L${px(0)},${padT+chartH} Z`;
  const ticks = [0, 0.5, 1].map(t => ({ y: padT + chartH - t * chartH, val: (minVal + range * t).toFixed(0) }));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="svgAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={PRISMA_COLOR} stopOpacity="0.18" />
          <stop offset="100%" stopColor={PRISMA_COLOR} stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={padL} y1={t.y} x2={W-padR} y2={t.y} stroke="#f4f4f5" strokeWidth="1" />
          <text x={padL-4} y={t.y+3.5} textAnchor="end" fontSize="9" fill="#a1a1aa" fontFamily="Inter,sans-serif">{t.val}</text>
        </g>
      ))}
      <path d={areaPath} fill="url(#svgAreaGrad)" />
      <polyline points={points} fill="none" stroke={PRISMA_COLOR} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => {
        const isHL = i === highlight;
        return <circle key={i} cx={px(i)} cy={py(d.value)} r={isHL ? 5 : 3} fill={isHL ? PRISMA_COLOR : "#d4d4d8"} stroke={isHL ? "#fff" : "none"} strokeWidth={isHL ? 2 : 0} />;
      })}
      {data.map((d, i) => {
        if (data.length > 8 && i % 2 !== 0) return null;
        return (
          <text key={i} x={px(i)} y={H-padB+13} textAnchor="middle" fontSize="9"
            fill={i === highlight ? PRISMA_COLOR : "#a1a1aa"} fontWeight={i === highlight ? "600" : "400"} fontFamily="Inter,sans-serif">
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

function ChartRenderer({ response }) {
  const { chartType, chartData, highlight } = response;
  return (
    <div style={{ width: "100%", height: 160 }}>
      {chartType === "area"           && <AreaChartSVG     data={chartData} highlight={highlight} />}
      {chartType === "bar-horizontal" && <BarHorizontalSVG data={chartData} highlight={highlight} />}
      {chartType === "bar"            && <BarChartSVG      data={chartData} highlight={highlight} />}
      {chartType === "bar-negative"   && <BarChartSVG      data={chartData} highlight={highlight} negative />}
    </div>
  );
}

function AIResponseCard({ response }) {
  const { summary, insight, trend, kpis } = response;
  const renderInsight = text => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((p, i) => i % 2 === 1
      ? <span key={i} style={{ ...SERIF, color: PRISMA_COLOR, fontWeight: 700 }}>{p}</span>
      : <span key={i}>{p}</span>
    );
  };
  const TrendIcon  = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "#16a34a"  : trend === "down" ? "#dc2626"    : "#71717a";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
      className="w-full mt-3 bg-white border border-zinc-100 rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] overflow-hidden"
      style={{ ...SANS }}
    >
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-zinc-50">
        <div className="flex items-center justify-center w-6 h-6 rounded-full shrink-0" style={{ backgroundColor: PRISMA_COLOR }}>
          <Sparkles size={11} className="text-white" />
        </div>
        <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-zinc-400" style={{ fontSize: fontScale.xs }}>
          Prisma IA · {summary}
        </span>
        <div className="ml-auto"><TrendIcon size={13} style={{ color: trendColor }} /></div>
      </div>
      <div className="px-5 pt-4 pb-5">
        <p className="text-sm text-zinc-500 font-light leading-relaxed mb-4" style={{ fontSize: fontScale.sm }}>
          {renderInsight(insight)}
        </p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {kpis.map(kpi => (
            <div key={kpi.label} className="bg-zinc-50 border border-zinc-100 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase mb-0.5" style={{ fontSize: fontScale.xs }}>{kpi.label}</p>
              <p className="text-sm font-bold text-zinc-900 tracking-tight leading-none" style={{ ...SERIF, fontSize: fontScale.sm }}>{kpi.value}</p>
            </div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-zinc-50 border border-zinc-100 rounded-xl px-3 pt-4 pb-2">
          <ChartRenderer response={response} />
        </motion.div>
      </div>
    </motion.div>
  );
}

const QUERIES = AI_RESPONSES.map(r => r.query);

function TypingDemoSection() {
  const [idx, setIdx]             = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase]         = useState("typing");

  useEffect(() => {
    const text = QUERIES[idx];
    let t;
    if (phase === "typing") {
      if (displayed.length < text.length) {
        t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), 42);
      } else {
        t = setTimeout(() => setPhase("pause"), 2800);
      }
    } else if (phase === "pause") {
      t = setTimeout(() => setPhase("erasing"), 600);
    } else {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 16);
      } else {
        setIdx(i => (i + 1) % QUERIES.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(t);
  }, [displayed, phase, idx]);

  const showResponse = phase === "pause" || (phase === "erasing" && displayed.length > 20);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="absolute -inset-2 rounded-3xl opacity-40 blur-xl pointer-events-none"
           style={{ background: "radial-gradient(ellipse at 50% 50%, #e4e4e7 0%, transparent 80%)" }} />
      {/* Altura fixa reservada para o card — evita que o conteúdo abaixo se mova */}
      <div className="relative" style={{ minHeight: 520 }}>
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.1)] px-6 py-5 flex items-center gap-4">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-50" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-zinc-800" />
          </span>
          <span className="flex-1 min-h-[1.5rem] text-sm sm:text-base text-zinc-700 tracking-tight overflow-hidden whitespace-nowrap" style={SANS}>
            {displayed}
            <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7, repeatType: "reverse" }}
              className="inline-block w-0.5 h-[1.1em] ml-0.5 align-middle" style={{ backgroundColor: PRISMA_COLOR }} />
          </span>
          <div className="hidden sm:flex h-8 w-8 rounded-full items-center justify-center shrink-0" style={{ backgroundColor: "#18181b" }}>
            <ArrowRight size={13} className="text-white" />
          </div>
        </div>
        <AnimatePresence mode="wait">
          {showResponse && <AIResponseCard key={idx} response={AI_RESPONSES[idx]} />}
        </AnimatePresence>
      </div>
      <p className="text-center text-[10px] font-semibold tracking-[0.15em] uppercase text-zinc-300 mt-3" style={SANS}>
        Conectividade Universal de Dados
      </p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, body }) {
  return (
    <div
      className="bg-zinc-50 border border-zinc-100 rounded-[2rem] transition-all duration-500 h-full"
      style={{ padding: space[4] }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "white";
        e.currentTarget.style.borderColor = PRISMA_COLOR + "33";
        e.currentTarget.style.boxShadow = `0 20px 48px -12px ${PRISMA_COLOR}22`;
        const icon = e.currentTarget.querySelector(".fi-wrap");
        if (icon) { icon.style.backgroundColor = PRISMA_COLOR; icon.style.borderColor = PRISMA_COLOR; }
        const svg = e.currentTarget.querySelector(".fi-svg");
        if (svg) svg.style.color = "white";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "";
        e.currentTarget.style.borderColor = "";
        e.currentTarget.style.boxShadow = "";
        const icon = e.currentTarget.querySelector(".fi-wrap");
        if (icon) { icon.style.backgroundColor = "white"; icon.style.borderColor = "#f4f4f5"; }
        const svg = e.currentTarget.querySelector(".fi-svg");
        if (svg) svg.style.color = "#18181b";
      }}
    >
      <div className="fi-wrap w-14 h-14 rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center transition-all duration-300"
           style={{ marginBottom: space[3], backgroundColor: "white" }}>
        <Icon className="fi-svg w-6 h-6 transition-colors duration-300" style={{ color: "#18181b" }} strokeWidth={2} />
      </div>
      <h3 className="font-bold tracking-tight text-zinc-900" style={{ ...SERIF, fontSize: fontScale.base, marginBottom: space[2] }}>
        {title}
      </h3>
      <p className="text-zinc-500 leading-relaxed font-light" style={{ ...SANS, fontSize: fontScale.sm }}>{body}</p>
    </div>
  );
}

function PrismaLogo() {
  return (
    <span className="font-black tracking-tighter text-zinc-900 select-none" style={{ ...SERIF, fontSize: fontScale.base }}>
      Δ PRISMA.
    </span>
  );
}

export default function PrismaLandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [["Como Funciona","#como-funciona"],["Funcionalidades","#funcionalidades"],["Segurança","#seguranca"],["Parcerias","#parcerias"]];

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-200" style={SANS}>

      {/* HEADER */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-white/80 backdrop-blur-xl border-b border-zinc-100 shadow-[0_1px_12px_rgba(0,0,0,0.04)]" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between" style={{ paddingLeft: space[4], paddingRight: space[4] }}>
          <PrismaLogo />
          <nav className="hidden md:flex gap-10 text-sm font-medium text-zinc-500 tracking-tight" style={{ gap: space[4] }}>
            {navLinks.map(([label, href]) => (
              <a key={label} href={href} className="hover:text-zinc-900 transition-colors duration-200" style={{ fontSize: fontScale.sm }}>{label}</a>
            ))}
          </nav>
          <button className="md:hidden p-2 rounded-lg text-zinc-600 hover:text-zinc-900 transition-colors"
                  onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-b border-zinc-100 px-6 pb-6 pt-2">
              {navLinks.map(([label, href]) => (
                <a key={label} href={href} onClick={() => setMenuOpen(false)}
                   className="block py-3.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 border-b border-zinc-50 last:border-0"
                   style={{ fontSize: fontScale.sm, padding: space[2] }}>
                  {label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO — PRIORIDADE 1: headline que nomeia a dor ──────────────────── */}
      <main className="relative flex flex-col items-center justify-center min-h-screen text-center overflow-hidden px-6"
            style={{ paddingTop: space[6], paddingBottom: space[5] }}>
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(228,228,231,0.38) 0%, transparent 70%)" }} />

        <motion.div initial="hidden" animate="visible" variants={stagger}
                    className="relative z-10 max-w-4xl w-full flex flex-col items-center">

          <motion.h1 variants={fadeUp} className="font-bold tracking-tighter leading-[1.04]"
            style={{ ...SERIF, fontSize: fontScale['2xl'], marginBottom: space[3] }}>
            <span className="text-zinc-900 block">Seu time ainda leva dias</span>
            <span className="block" style={{ color: PRISMA_COLOR }}>para responder uma pergunta</span>
            <span className="text-zinc-400 block">que deveria durar segundos.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-zinc-500 max-w-2xl font-light leading-relaxed tracking-tight"
            style={{ fontSize: fontScale.base, marginBottom: space[5] }}>
            Pare de esperar dias por um relatório. Transforme seu banco de dados em um
            assistente executivo 24/7. Respostas e gráficos precisos em segundos, direto da fonte oficial da sua empresa.
          </motion.p>

          {/* CTAs — PRIORIDADE 5: primário + secundário */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4"
                      style={{ gap: space[2], marginBottom: space[6] }}>
            <button className="text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all tracking-tight w-full sm:w-auto"
              style={{ backgroundColor: PRISMA_COLOR, padding: `${space[2]} ${space[4]}`, boxShadow: `0 8px 24px -8px ${PRISMA_COLOR}55` }}>
              Agendar Diagnóstico
            </button>
            <button className="text-zinc-500 hover:text-zinc-900 font-medium text-sm transition-colors flex items-center gap-1.5"
                    style={{ fontSize: fontScale.sm }}>
              Ver como funciona <ArrowRight size={14} />
            </button>
          </motion.div>

          <motion.div variants={fadeUp} className="w-full"><TypingDemoSection /></motion.div>

          <motion.div variants={fadeUp} className="mt-16 flex flex-col items-center gap-4"
                      style={{ marginTop: space[5], gap: space[2] }}>
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-zinc-400" style={{ fontSize: fontScale.xs }}>
              Conectividade Universal de Dados
            </span>
            <div className="flex flex-wrap justify-center gap-3" style={{ gap: space[1] }}>
              {["PostgreSQL", "SQL Server", "Oracle DB", "MySQL", "BigQuery"].map(db => (
                <span key={db} className="text-xs font-medium px-3 py-1.5 rounded-full border"
                      style={{ fontSize: fontScale.xs, color: "#71717a", borderColor: "#e4e4e7", backgroundColor: "#fafafa" }}>
                  {db}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* ── CASOS DE USO POR DEPARTAMENTO ───────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-zinc-100 bg-zinc-50/50"
               style={{ paddingTop: space[5], paddingBottom: space[5] }}>
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-12" style={{ marginBottom: space[4] }}>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-3"
               style={{ fontSize: fontScale.xs, color: PRISMA_COLOR, marginBottom: space[1] }}>
              Casos de Uso por Departamento
            </p>
            <h2 className="font-extrabold tracking-tighter text-zinc-900" style={{ ...SERIF, fontSize: fontScale.xl }}>
              Você se reconhece aqui?
            </h2>
            <p className="text-zinc-500 font-light mt-3 max-w-xl mx-auto" style={{ fontSize: fontScale.sm, marginTop: space[1] }}>
              Cada cargo tem uma dor diferente. O Prisma resolve todas.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ gap: space[3] }}>
            {[
              {
                role: "CEO",
                dor: "Você toma decisões estratégicas com dados de ontem.",
                situacao: "Toda reunião de board começa com alguém dizendo \"vou confirmar com o time\". Você lidera sem visibilidade em tempo real.",
                ganho: "Pergunta direto ao sistema antes da reunião. Chega com os números, não com dúvidas.",
                exemplo: "Qual foi a margem consolidada do Q3 comparado ao Q3 do ano anterior por unidade de negócio?",
                dark: true,
              },
              {
                role: "CFO",
                dor: "Seu time de FP&A gasta mais tempo montando relatório do que analisando.",
                situacao: "São dias para cruzar inadimplência, margem e custo operacional. Quando o relatório fica pronto, o cenário já mudou.",
                ganho: "Análises financeiras cruzadas em segundos. Seu time volta a analisar — não a montar planilha.",
                exemplo: "Qual a inadimplência acima de 90 dias cruzada por segmento, comparando com a meta do trimestre?",
                dark: false,
              },
              {
                role: "Diretor de Operações",
                dor: "Você descobre os gargalos tarde demais — quando já viraram crise.",
                situacao: "O estoque parado aparece no relatório mensal. A variação de custo da filial vira surpresa. Você reage, nunca antecipa.",
                ganho: "Monitora desvios em tempo real. Antecipa problemas antes que virem prejuízo.",
                exemplo: "Qual filial teve maior variação de custo operacional esta semana vs a média dos últimos 60 dias?",
                dark: false,
              },
              {
                role: "Diretor Comercial",
                dor: "Você não sabe qual vendedor está queimando margem para bater meta.",
                situacao: "O número de vendas parece bom. Mas a margem líquida por vendedor, por produto e por cliente — ninguém sabe de cabeça.",
                ganho: "Visibilidade total do funil, margem e LTV por vendedor, canal e segmento. Em uma pergunta.",
                exemplo: "Quais os 5 vendedores com maior ticket médio e qual a margem líquida média de cada um no semestre?",
                dark: true,
              },
            ].map((card, i) => (
              <FadeUp key={card.role} delay={i * 0.08}>
                {card.dark ? (
                  /* Card escuro */
                  <div className="bg-zinc-900 rounded-2xl h-full flex flex-col transition-all duration-300 hover:bg-black"
                       style={{ padding: space[3] }}
                       onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 20px 48px -12px ${PRISMA_COLOR}44`; e.currentTarget.style.borderColor = PRISMA_COLOR + "66"; e.currentTarget.style.border = `1px solid ${PRISMA_COLOR}55`; }}
                       onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.border = ""; }}>
                    <div className="inline-flex mb-4 self-start" style={{ marginBottom: space[2] }}>
                      <span className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full"
                            style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontSize: fontScale.xs }}>
                        {card.role}
                      </span>
                    </div>
                    <h3 className="font-bold tracking-tight text-white mb-2 leading-snug"
                        style={{ ...SERIF, fontSize: fontScale.base, marginBottom: space[1] }}>
                      {card.dor}
                    </h3>
                    <p className="font-light leading-relaxed mb-4" style={{ fontSize: fontScale.sm, color: "rgba(255,255,255,0.45)", marginBottom: space[2] }}>
                      {card.situacao}
                    </p>
                    <p className="font-medium mb-4" style={{ fontSize: fontScale.sm, color: "rgba(255,255,255,0.75)", marginBottom: space[2] }}>
                      → {card.ganho}
                    </p>
                    <div className="mt-auto rounded-xl px-4 py-3" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <p className="text-[10px] font-semibold tracking-wider uppercase mb-1" style={{ color: "rgba(255,255,255,0.35)", fontSize: fontScale.xs }}>
                        Exemplo real
                      </p>
                      <p className="font-light italic leading-snug" style={{ fontSize: fontScale.sm, color: "rgba(255,255,255,0.6)" }}>
                        "{card.exemplo}"
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Card claro */
                  <div className="bg-white border border-zinc-100 rounded-2xl h-full flex flex-col transition-all duration-300"
                       style={{ padding: space[3] }}
                       onMouseEnter={e => { e.currentTarget.style.borderColor = PRISMA_COLOR + "55"; e.currentTarget.style.boxShadow = `0 16px 40px -12px ${PRISMA_COLOR}22`; }}
                       onMouseLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }}>
                    <div className="inline-flex mb-4 self-start" style={{ marginBottom: space[2] }}>
                      <span className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full"
                            style={{ backgroundColor: "#f4f4f5", color: "#52525b", fontSize: fontScale.xs }}>
                        {card.role}
                      </span>
                    </div>
                    <h3 className="font-bold tracking-tight text-zinc-900 mb-2 leading-snug"
                        style={{ ...SERIF, fontSize: fontScale.base, marginBottom: space[1] }}>
                      {card.dor}
                    </h3>
                    <p className="text-zinc-500 font-light leading-relaxed mb-4" style={{ fontSize: fontScale.sm, marginBottom: space[2] }}>
                      {card.situacao}
                    </p>
                    <p className="font-medium text-zinc-700 mb-4" style={{ fontSize: fontScale.sm, marginBottom: space[2] }}>
                      → {card.ganho}
                    </p>
                    <div className="mt-auto rounded-xl px-4 py-3 bg-zinc-50 border border-zinc-100">
                      <p className="text-[10px] font-semibold tracking-wider uppercase mb-1 text-zinc-400" style={{ fontSize: fontScale.xs }}>
                        Exemplo real
                      </p>
                      <p className="text-zinc-600 font-light italic leading-snug" style={{ fontSize: fontScale.sm }}>
                        "{card.exemplo}"
                      </p>
                    </div>
                  </div>
                )}
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANTI-PRATELEIRA — PRIORIDADE 4 ──────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-zinc-100" style={{ paddingTop: space[5], paddingBottom: space[5] }}>
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-14" style={{ marginBottom: space[5] }}>
            <h2 className="font-extrabold tracking-tighter text-zinc-900" style={{ ...SERIF, fontSize: fontScale.xl }}>
              Não é mais um SaaS de prateleira.
            </h2>
            <p className="text-zinc-500 font-light mt-4 max-w-2xl mx-auto" style={{ fontSize: fontScale.base, marginTop: space[2] }}>
              A maioria das ferramentas exige que você se adapte a elas. O Prisma aprende a sua empresa.
            </p>
          </FadeUp>
          <FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ gap: space[4] }}>
              <div className="bg-zinc-50 border border-zinc-100 rounded-3xl" style={{ padding: space[4] }}>
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-400 mb-5" style={{ fontSize: fontScale.xs, marginBottom: space[2] }}>
                  SaaS Genérico de Prateleira
                </p>
                {[
                  "Dashboard que ninguém configura depois do onboarding",
                  "Você se adapta ao software — não o contrário",
                  "Suporte por ticket com SLA de 72h",
                  "Regras de negócio que simplesmente não existem no sistema",
                  "Renovação anual — e você ainda depende da TI para qualquer ajuste",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 mb-3">
                    <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
                    <span className="text-zinc-500 font-light leading-snug" style={{ fontSize: fontScale.sm }}>{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white border-2 rounded-3xl" style={{ padding: space[4], borderColor: PRISMA_COLOR + "44" }}>
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-5" style={{ fontSize: fontScale.xs, color: PRISMA_COLOR, marginBottom: space[2] }}>
                  Δ Prisma — Infraestrutura Exclusiva
                </p>
                {[
                  "Configurado para a realidade e regras de negócio da sua empresa",
                  "O software aprende a sua operação — não o inverso",
                  "Onboarding dedicado com especialista em dados",
                  "IA treinada nos seus PDFs, manuais e processos internos",
                  "Você pergunta em português — o sistema responde em segundos",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 mb-3">
                    <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: PRISMA_COLOR }} />
                    <span className="text-zinc-700 font-medium leading-snug" style={{ fontSize: fontScale.sm }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── COMO FUNCIONA — PRIORIDADE 3 ────────────────────────────────────── */}
      <section id="como-funciona" className="py-24 px-6 border-t border-zinc-100 bg-zinc-50/40"
               style={{ paddingTop: space[5], paddingBottom: space[5] }}>
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-16" style={{ marginBottom: space[5] }}>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-4"
               style={{ fontSize: fontScale.xs, color: PRISMA_COLOR, marginBottom: space[2] }}>
              Processo
            </p>
            <h2 className="font-extrabold tracking-tighter text-zinc-900" style={{ ...SERIF, fontSize: fontScale.xl }}>
              Três passos. Uma semana. Decisões em segundos.
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative" style={{ gap: space[4] }}>
            <div className="hidden md:block absolute top-8 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-zinc-200" />
            {[
              { icon: Database,       step: "01", title: "Conectamos à sua base",      body: "Acesso Read-Only direto no seu banco de dados. PostgreSQL, SQL Server, Oracle, MySQL ou BigQuery — sem mover um byte de dado para fora do seu ambiente." },
              { icon: Settings,       step: "02", title: "Configuramos o contexto",    body: "Carregamos seus manuais, PDFs e regras de negócio. O Prisma aprende a sua empresa antes de responder qualquer pergunta — do jeito que o seu analista faria." },
              { icon: MessageSquare,  step: "03", title: "Você pergunta, ele responde",body: "O executivo digita em português. O Prisma gera o SQL, executa, analisa e devolve o gráfico. Nenhum técnico, nenhuma espera, nenhum ticket." },
            ].map((s, i) => (
              <FadeUp key={i} delay={i * 0.15}>
                <div className="relative flex flex-col items-center text-center" style={{ zIndex: 1 }}>
                  <div className="w-16 h-16 rounded-2xl border-2 border-zinc-200 bg-white flex items-center justify-center shadow-sm" style={{ marginBottom: space[3] }}>
                    <s.icon size={22} style={{ color: PRISMA_COLOR }} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: PRISMA_COLOR, fontSize: fontScale.xs }}>
                    Passo {s.step}
                  </span>
                  <h3 className="font-bold tracking-tight text-zinc-900" style={{ ...SERIF, fontSize: fontScale.base, marginBottom: space[1] }}>
                    {s.title}
                  </h3>
                  <p className="text-zinc-500 font-light leading-relaxed" style={{ fontSize: fontScale.sm }}>{s.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FUNCIONALIDADES ─────────────────────────────────────────────────── */}
      <section id="funcionalidades" className="py-32 px-6 max-w-7xl mx-auto border-t border-zinc-100"
               style={{ paddingTop: space[6], paddingBottom: space[6] }}>
        <FadeUp className="mb-20 flex flex-col items-start md:items-center text-left md:text-center" style={{ marginBottom: space[5] }}>
          <h2 className="font-extrabold tracking-tighter text-zinc-900 mb-6" style={{ ...SERIF, fontSize: fontScale.xl, marginBottom: space[3] }}>
            A velocidade da decisão.
          </h2>
          <p className="text-zinc-500 max-w-3xl leading-relaxed tracking-tight font-light" style={{ fontSize: fontScale.base }}>
            O tempo de espera entre o diretor pedir um dado e a TI gerar o painel custa
            milhares de reais em ineficiência. O Prisma elimina o telefone sem fio.
          </p>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6" style={{ gap: space[3], marginBottom: space[3] }}>
          {[
            { icon: Zap,         title: "Conversa Direta com os Dados",         body: "Pergunte em português, receba o gráfico. Uma camada de inteligência que traduz perguntas de negócios em análises exatas em tempo real." },
            { icon: FileSearch,  title: "Inteligência de Contexto Corporativo", body: "A IA não olha apenas os números. Ela lê os manuais em PDF da sua empresa e cruza as suas regras de negócio com os dados antes de responder." },
            { icon: ShieldCheck, title: "Privacidade e Escudo LGPD",            body: "Acesso de leitura estrita e sanitização automática de dados sensíveis. Arquitetura desenhada nativamente para governança corporativa." },
          ].map((card, i) => (
            <FadeUp key={card.title} delay={i * 0.1}><FeatureCard {...card} /></FadeUp>
          ))}
        </div>
      </section>

      {/* ── SEGURANÇA ───────────────────────────────────────────────────────── */}
      <section id="seguranca" className="py-24 px-6 max-w-7xl mx-auto border-t border-zinc-100"
               style={{ paddingTop: space[5], paddingBottom: space[5] }}>
        <FadeUp className="flex flex-col md:flex-row items-center gap-16" style={{ gap: space[5] }}>
          <div className="flex-1 text-left">
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-4"
               style={{ ...SANS, fontSize: fontScale.xs, color: PRISMA_COLOR, marginBottom: space[2] }}>
              Governança Corporativa
            </p>
            <h2 className="font-extrabold tracking-tighter text-zinc-900 mb-6 leading-tight"
                style={{ ...SERIF, fontSize: fontScale.xl, marginBottom: space[3] }}>
              Segurança que o board aprova.
            </h2>
            <p className="text-zinc-500 font-light leading-relaxed" style={{ fontSize: fontScale.base }}>
              Acesso Read-Only direto na sua base. Nenhum dado trafega para fora do seu ambiente
              sem autorização explícita. Conformidade com LGPD nativa, não como camada adicional.
            </p>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4" style={{ gap: space[2] }}>
            {[
              { icon: ShieldCheck, label: "Read-Only Access"   },
              { icon: ShieldCheck, label: "Dados Sanitizados"  },
              { icon: ShieldCheck, label: "LGPD Nativo"        },
              { icon: ShieldCheck, label: "Audit Log Completo" },
            ].map(item => (
              <div key={item.label} className="bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 flex items-center gap-3">
                <item.icon size={16} style={{ color: PRISMA_COLOR, flexShrink: 0 }} strokeWidth={2} />
                <span className="font-semibold text-zinc-700" style={{ fontSize: fontScale.sm }}>{item.label}</span>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ── PARCEIROS ───────────────────────────────────────────────────────── */}
      <section id="parcerias" className="py-24 px-4 md:px-8 max-w-[90rem] mx-auto"
               style={{ paddingTop: space[5], paddingBottom: space[5] }}>
        <FadeUp>
          <div className="bg-black text-white rounded-[3rem] flex flex-col items-center text-center shadow-2xl" style={{ padding: space[6] }}>
            <div className="max-w-3xl">
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-zinc-500 mb-8"
                 style={{ ...SANS, fontSize: fontScale.xs, marginBottom: space[4] }}>
                Programa de Parceiros
              </p>
              <h2 className="font-extrabold tracking-tighter mb-8 leading-[1.08]"
                  style={{ ...SERIF, fontSize: fontScale.xl, marginBottom: space[4] }}>
                Você é Consultor de ERP ou Software House?
              </h2>
              <p className="text-zinc-400 mb-14 leading-relaxed font-light tracking-tight max-w-2xl mx-auto"
                 style={{ fontSize: fontScale.base, marginBottom: space[5] }}>
                Leve inovação imediata para a sua carteira de clientes. Seja um parceiro
                integrador da nossa IA, adicione valor aos seus contratos Totvs, SAP ou Linx
                e gere uma nova linha de receita recorrente.
              </p>
              <button className="text-black px-10 py-4 rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all tracking-tight"
                      style={{ backgroundColor: "white", padding: `${space[2]} ${space[4]}` }}>
                Seja um Parceiro Integrador
              </button>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ── PRÉ-FOOTER CTA ──────────────────────────────────────────────────── */}
      <section className="py-32 px-6" style={{ paddingTop: space[6], paddingBottom: space[6] }}>
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <h2 className="font-extrabold tracking-tighter text-zinc-900 mb-6"
                style={{ ...SERIF, fontSize: fontScale.xl, marginBottom: space[3] }}>
              Pronto para eliminar o tempo perdido?
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-zinc-500 mb-10 font-light leading-relaxed"
               style={{ fontSize: fontScale.base, marginBottom: space[4] }}>
              Uma sessão de diagnóstico de 30 minutos para mapearmos os gargalos de dados
              da sua operação e avaliarmos a viabilidade da integração com o seu sistema.
            </p>
          </FadeUp>
          {/* PRIORIDADE 5: CTA duplo no pre-footer */}
          <FadeUp delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4" style={{ gap: space[2] }}>
              <button className="text-white font-semibold px-9 py-4 rounded-full hover:opacity-90 active:scale-95 transition-all text-sm tracking-tight"
                style={{ backgroundColor: PRISMA_COLOR, padding: `${space[2]} ${space[4]}`, boxShadow: `0 8px 24px -8px ${PRISMA_COLOR}55` }}>
                Agendar Diagnóstico
              </button>
              <button className="text-zinc-400 hover:text-zinc-700 font-medium text-sm transition-colors flex items-center gap-1.5"
                      style={{ fontSize: fontScale.sm }}>
                Ver um caso de uso completo <ArrowRight size={13} />
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-100 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5" style={{ gap: space[2] }}>
          <PrismaLogo />
          <p className="text-xs text-zinc-400 font-light order-last md:order-none" style={{ fontSize: fontScale.xs }}>
            &copy; {new Date().getFullYear()} Prisma Analytics. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-8" style={{ gap: space[3] }}>
            {["Termos de Uso", "Privacidade"].map(link => (
              <a key={link} href="#" className="text-xs font-medium text-zinc-400 hover:text-zinc-800 transition-colors duration-200"
                 style={{ fontSize: fontScale.xs }}>{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
