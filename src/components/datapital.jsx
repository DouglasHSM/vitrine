import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Zap, FileSearch, ShieldCheck, ArrowRight, Menu, X } from "lucide-react";

// ─── Tipografia ───────────────────────────────────────────────────────────────
const SERIF = { fontFamily: "'Times New Roman', Times, Georgia, serif" };
const SANS  = { fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" };

// ─── Framer Motion variants ───────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.82, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.13 } },
};

// ─── Scroll-triggered wrapper ─────────────────────────────────────────────────
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

// ─── Typing bar ───────────────────────────────────────────────────────────────
const QUERIES = [
  "Qual foi o lucro líquido do CD de São Paulo no mês passado?",
  "Compare as margens de contribuição por filial no Q3.",
  "Quais clientes estão inadimplentes há mais de 60 dias?",
  "Mostre a evolução do faturamento dos últimos 12 meses.",
  "Qual produto teve maior queda de giro em outubro?",
];

function TypingBar() {
  const [idx, setIdx]             = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase]         = useState("typing");

  useEffect(() => {
    const text = QUERIES[idx];
    let t;
    if (phase === "typing") {
      if (displayed.length < text.length) {
        t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), 48);
      } else {
        t = setTimeout(() => setPhase("pause"), 2400);
      }
    } else if (phase === "pause") {
      t = setTimeout(() => setPhase("erasing"), 300);
    } else {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 20);
      } else {
        setIdx((i) => (i + 1) % QUERIES.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(t);
  }, [displayed, phase, idx]);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* diffuse ambient halo */}
      <div
        className="absolute -inset-2 rounded-3xl opacity-40 blur-xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, #e4e4e7 0%, transparent 80%)" }}
      />
      <div className="relative bg-white rounded-2xl border border-zinc-100 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.1)] px-6 py-5 flex items-center gap-4">
        {/* live pulse dot */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-50" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-zinc-800" />
        </span>
        <span
          className="flex-1 min-h-[1.5rem] text-sm sm:text-base text-zinc-700 tracking-tight overflow-hidden whitespace-nowrap"
          style={SANS}
        >
          {displayed}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.7, repeatType: "reverse" }}
            className="inline-block w-0.5 h-[1.1em] bg-zinc-600 ml-0.5 align-middle"
          />
        </span>
        <div className="hidden sm:flex h-8 w-8 rounded-full bg-zinc-900 items-center justify-center shrink-0">
          <ArrowRight size={13} className="text-white" />
        </div>
      </div>
      <p
        className="text-center text-[10px] font-semibold tracking-[0.15em] uppercase text-zinc-300 mt-3"
        style={SANS}
      >
        Conectado ao seu ERP · Leitura somente
      </p>
    </div>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, body }) {
  return (
    <div className="group bg-zinc-50 border border-zinc-100 rounded-[2rem] p-10 hover:bg-white hover:shadow-lg hover:border-zinc-200 transition-all duration-500 h-full">
      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center mb-8 group-hover:bg-zinc-900 group-hover:border-zinc-900 transition-all duration-300">
        <Icon className="w-6 h-6 text-zinc-900 group-hover:text-white transition-colors duration-300" strokeWidth={2} />
      </div>
      <h3 className="text-2xl font-bold tracking-tight text-zinc-900 mb-4" style={SERIF}>{title}</h3>
      <p className="text-zinc-500 leading-relaxed font-light" style={SANS}>{body}</p>
    </div>
  );
}

// ─── KPI card ─────────────────────────────────────────────────────────────────
function KpiCard({ value, label }) {
  return (
    <div className="bg-zinc-50 border border-zinc-100 rounded-[2rem] p-10 flex flex-col items-start gap-3 hover:bg-white hover:shadow-md hover:border-zinc-200 transition-all duration-400">
      <span className="text-4xl font-extrabold tracking-tighter text-zinc-900 leading-none" style={SERIF}>
        {value}
      </span>
      <span className="text-sm font-light text-zinc-500 tracking-tight" style={SANS}>{label}</span>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DatapitalLandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-200" style={SANS}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-zinc-100 shadow-[0_1px_12px_rgba(0,0,0,0.04)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="text-2xl font-black tracking-tighter text-zinc-900 select-none" style={SERIF}>
            DATAPITAL.
          </span>

          <nav className="hidden md:flex gap-10 text-sm font-medium text-zinc-500 tracking-tight">
            {[["Funcionalidades", "#funcionalidades"], ["Segurança", "#seguranca"], ["Parcerias", "#parcerias"]].map(
              ([label, href]) => (
                <a key={label} href={href} className="hover:text-zinc-900 transition-colors duration-200">
                  {label}
                </a>
              )
            )}
          </nav>

          <div className="hidden md:block">
            <button className="bg-zinc-900 text-white px-7 py-2.5 rounded-full text-sm font-semibold hover:bg-black active:scale-95 transition-all shadow-sm tracking-tight">
              Agendar Diagnóstico
            </button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-zinc-600 hover:text-zinc-900 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-b border-zinc-100 px-6 pb-6 pt-2"
            >
              {[["Funcionalidades", "#funcionalidades"], ["Segurança", "#seguranca"], ["Parcerias", "#parcerias"]].map(
                ([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 border-b border-zinc-50 last:border-0"
                  >
                    {label}
                  </a>
                )
              )}
              <button className="mt-5 w-full bg-zinc-900 text-white text-sm font-semibold px-5 py-3.5 rounded-full">
                Agendar Diagnóstico
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <main className="relative pt-44 pb-28 px-6 flex flex-col items-center justify-center min-h-screen text-center overflow-hidden">
        {/* Ambient radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(228,228,231,0.38) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 max-w-4xl w-full flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 mb-10">
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500">
                Plataforma B2B Enterprise
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-6xl md:text-[5.5rem] font-bold tracking-tighter mb-8 leading-[1.04]"
            style={SERIF}
          >
            <span className="text-zinc-900 block">O fim do caos</span>
            <span className="text-zinc-400 block">nos dados.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-zinc-500 max-w-2xl mb-12 font-light leading-relaxed tracking-tight"
          >
            Pare de esperar dias por um relatório. Transforme seu banco de dados em um
            assistente executivo 24/7. Respostas e gráficos em segundos, direto do seu ERP.
          </motion.p>

          {/* CTA row */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 mb-20">
            <button className="bg-zinc-900 text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-black active:scale-95 transition-all shadow-[0_8px_24px_-8px_rgba(0,0,0,0.28)] tracking-tight w-full sm:w-auto">
              Agendar Diagnóstico Gratuito
            </button>
            <button className="text-zinc-500 hover:text-zinc-900 font-medium text-sm transition-colors flex items-center gap-1.5">
              Ver demonstração <ArrowRight size={14} />
            </button>
          </motion.div>

          {/* Typing bar */}
          <motion.div variants={fadeUp} className="w-full">
            <TypingBar />
          </motion.div>

          {/* ERP strip */}
          <motion.div variants={fadeUp} className="mt-16 flex flex-col items-center gap-3">
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-xs font-bold tracking-[0.18em] uppercase text-zinc-300">
              {["Totvs", "SAP", "Linx", "Oracle", "Senior"].map((e) => (
                <span key={e}>{e}</span>
              ))}
            </div>
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-zinc-300">
              Integrações homologadas
            </span>
          </motion.div>
        </motion.div>
      </main>

      {/* ── SEGUNDA DOBRA ───────────────────────────────────────────────────── */}
      <section id="funcionalidades" className="py-32 px-6 max-w-7xl mx-auto border-t border-zinc-100">

        {/* Section header */}
        <FadeUp className="mb-20 flex flex-col items-start md:items-center text-left md:text-center">
          <h2
            className="text-4xl md:text-5xl font-extrabold tracking-tighter text-zinc-900 mb-6"
            style={SERIF}
          >
            A velocidade da decisão.
          </h2>
          <p className="text-xl text-zinc-500 max-w-3xl leading-relaxed tracking-tight font-light">
            O tempo de espera entre o diretor pedir um dado e a TI gerar o painel custa
            milhares de reais em ineficiência. O Datapital elimina o telefone sem fio.
          </p>
        </FadeUp>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            {
              icon: Zap,
              title: "Text-to-SQL Instantâneo",
              body: "Pergunte em português, receba o gráfico. Uma camada de inteligência que traduz a intenção de negócio em consultas complexas instantaneamente.",
            },
            {
              icon: FileSearch,
              title: "RAG Integrado",
              body: "A IA lê seus PDFs e manuais de regras de negócio. O contexto corporativo completo injetado em cada resposta e análise estruturada.",
            },
            {
              icon: ShieldCheck,
              title: "Escudo LGPD",
              body: "Acesso Read-Only e sanitização automática de dados sensíveis. Arquitetura desenhada nativamente para governança e compliance rigorosos.",
            },
          ].map((card, i) => (
            <FadeUp key={card.title} delay={i * 0.1}>
              <FeatureCard {...card} />
            </FadeUp>
          ))}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" id="seguranca">
          {[
            { value: "< 3s",      label: "Tempo médio de resposta" },
            { value: "99.9%",     label: "Uptime garantido" },
            { value: "Read-Only", label: "Política de acesso padrão" },
            { value: "SOC 2",     label: "Conformidade em processo" },
          ].map((kpi, i) => (
            <FadeUp key={kpi.value} delay={i * 0.08}>
              <KpiCard {...kpi} />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── PARCEIROS ───────────────────────────────────────────────────────── */}
      <section id="parcerias" className="py-24 px-4 md:px-8 max-w-[90rem] mx-auto">
        <FadeUp>
          <div className="bg-black text-white rounded-[3rem] py-28 md:py-36 px-8 flex flex-col items-center text-center shadow-2xl">
            <div className="max-w-3xl">
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-zinc-600 mb-8" style={SANS}>
                Programa de Parceiros
              </p>
              <h2
                className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-8 leading-[1.08]"
                style={SERIF}
              >
                Você é Consultor de ERP ou Software House?
              </h2>
              <p className="text-lg md:text-xl text-zinc-400 mb-14 leading-relaxed font-light tracking-tight max-w-2xl mx-auto">
                Leve inovação imediata para a sua carteira de clientes. Seja um parceiro
                integrador da nossa IA, adicione valor aos seus contratos Totvs, SAP ou Linx
                e gere uma nova linha de receita recorrente.
              </p>
              <button className="bg-white text-black px-10 py-4 rounded-full text-sm font-semibold hover:bg-zinc-100 active:scale-95 transition-all tracking-tight">
                Seja um Parceiro Integrador
              </button>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ── PRÉ-FOOTER CTA ──────────────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <h2
              className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-zinc-900 mb-6"
              style={SERIF}
            >
              Pronto para eliminar o tempo perdido?
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-lg text-zinc-500 mb-10 font-light leading-relaxed">
              Um diagnóstico gratuito de 30 minutos para mapear as ineficiências de dados na
              sua operação. Sem compromisso.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <button className="bg-zinc-900 text-white font-semibold px-9 py-4 rounded-full hover:bg-black active:scale-95 transition-all shadow-[0_8px_24px_-8px_rgba(0,0,0,0.28)] text-sm tracking-tight">
              Agendar Diagnóstico Gratuito
            </button>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-100 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <span className="text-lg font-black tracking-tighter text-zinc-900" style={SERIF}>
            DATAPITAL.
          </span>
          <p className="text-xs text-zinc-400 font-light order-last md:order-none">
            &copy; {new Date().getFullYear()} Datapital Tecnologia Ltda. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-8">
            {["Termos de Uso", "Privacidade"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs font-medium text-zinc-400 hover:text-zinc-800 transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
