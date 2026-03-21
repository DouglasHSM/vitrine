import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, FileSearch, ShieldCheck } from 'lucide-react';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function DatapitalLandingPage() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Qual foi o lucro líquido do CD de São Paulo no mês passado?";

  useEffect(() => {
    let currentText = "";
    let index = 0;
    let isDeleting = false;
    let timer;

    const typeLoop = () => {
      if (!isDeleting && index < fullText.length) {
        currentText = fullText.substring(0, index + 1);
        index++;
        setTypedText(currentText);
        timer = setTimeout(typeLoop, 60);
      } else if (isDeleting && index > 0) {
        currentText = fullText.substring(0, index - 1);
        index--;
        setTypedText(currentText);
        timer = setTimeout(typeLoop, 30);
      } else {
        isDeleting = !isDeleting;
        timer = setTimeout(typeLoop, isDeleting ? 4000 : 1000);
      }
    };

    timer = setTimeout(typeLoop, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-zinc-200">

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="font-black text-2xl tracking-tighter text-zinc-900">
            DATAPITAL.
          </span>
          <nav className="hidden md:flex gap-10 text-sm font-medium text-zinc-500 tracking-tight">
            <a href="#funcionalidades" className="hover:text-zinc-900 transition-colors">Funcionalidades</a>
            <a href="#seguranca" className="hover:text-zinc-900 transition-colors">Segurança</a>
            <a href="#parcerias" className="hover:text-zinc-900 transition-colors">Parcerias</a>
          </nav>
          <button className="bg-zinc-900 text-white px-7 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-all shadow-sm tracking-tight">
            Agendar Diagnóstico
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="pt-48 pb-32 px-6 flex flex-col items-center justify-center min-h-[90vh] text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-5xl w-full flex flex-col items-center"
        >
          <motion.h1
            variants={fadeUpVariants}
            className="text-6xl md:text-[5.5rem] leading-[1.05] font-extrabold tracking-tighter text-zinc-900 mb-8"
          >
            O fim do caos nos dados.
          </motion.h1>

          <motion.p
            variants={fadeUpVariants}
            className="text-xl md:text-2xl text-zinc-500 max-w-2xl mb-20 font-light leading-relaxed tracking-tight"
          >
            Pare de esperar dias por um relatório. Transforme seu banco de dados em um assistente executivo 24/7. Respostas e gráficos em segundos, direto do seu ERP.
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] border border-zinc-100 p-8 flex items-center gap-5"
          >
            <Search className="w-8 h-8 text-zinc-300 flex-shrink-0" strokeWidth={2.5} />
            <span className="text-xl md:text-3xl text-zinc-800 font-medium tracking-tight text-left overflow-hidden whitespace-nowrap">
              {typedText}
              <span className="animate-pulse font-light text-zinc-300 ml-1">|</span>
            </span>
          </motion.div>
        </motion.div>
      </main>

      {/* SEGUNDA DOBRA: DOR VS REMÉDIO (BENTO GRID) */}
      <section id="funcionalidades" className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
          className="mb-24 text-left md:text-center flex flex-col items-start md:items-center"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-zinc-900 mb-6">
            A velocidade da decisão.
          </h2>
          <p className="text-xl text-zinc-500 max-w-3xl leading-relaxed tracking-tight font-light">
            O tempo de espera entre o diretor pedir um dado e a TI gerar o painel custa milhares de reais em ineficiência. O Datapital elimina o telefone sem fio.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Card 1 */}
          <motion.div variants={fadeUpVariants} className="bg-zinc-50 border border-zinc-100 rounded-[2rem] p-10 hover:bg-zinc-100/50 transition-colors">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center mb-8">
              <Zap className="w-6 h-6 text-zinc-900" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900 mb-4">Text-to-SQL Instantâneo</h3>
            <p className="text-zinc-500 leading-relaxed font-light">
              Pergunte em português, receba o gráfico. Uma camada de inteligência que traduz a intenção de negócio em consultas complexas instantaneamente.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={fadeUpVariants} className="bg-zinc-50 border border-zinc-100 rounded-[2rem] p-10 hover:bg-zinc-100/50 transition-colors">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center mb-8">
              <FileSearch className="w-6 h-6 text-zinc-900" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900 mb-4">RAG Integrado</h3>
            <p className="text-zinc-500 leading-relaxed font-light">
              A IA lê seus PDFs e manuais de regras de negócio. O contexto corporativo completo injetado em cada resposta e análise estruturada.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={fadeUpVariants} id="seguranca" className="bg-zinc-50 border border-zinc-100 rounded-[2rem] p-10 hover:bg-zinc-100/50 transition-colors">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center mb-8">
              <ShieldCheck className="w-6 h-6 text-zinc-900" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900 mb-4">Escudo LGPD</h3>
            <p className="text-zinc-500 leading-relaxed font-light">
              Acesso Read-Only e sanitização automática de dados sensíveis. Arquitetura desenhada nativamente para governança e compliance rigorosos.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* TERCEIRA DOBRA: PARCERIAS (CONTRASTE BRUTAL) */}
      <section id="parcerias" className="py-24 px-4 md:px-8 max-w-[90rem] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
          className="bg-black text-white rounded-[3rem] py-32 px-6 flex flex-col items-center text-center shadow-2xl"
        >
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
              Você é Consultor de ERP ou Software House?
            </h2>
            <p className="text-xl md:text-2xl text-zinc-400 mb-14 leading-relaxed font-light tracking-tight">
              Leve inovação imediata para a sua carteira de clientes. Seja um parceiro integrador da nossa IA, adicione valor aos seus contratos Totvs, SAP ou Linx e gere uma nova linha de receita recorrente.
            </p>
            <button className="bg-white text-black px-10 py-4 rounded-full text-lg font-semibold hover:bg-zinc-200 transition-colors tracking-tight">
              Seja um Parceiro Integrador
            </button>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-bold tracking-tighter text-zinc-900 text-lg">DATAPITAL.</span>
          <div className="flex gap-8 text-sm text-zinc-500 font-medium">
            <a href="#" className="hover:text-zinc-900 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacidade</a>
          </div>
          <span className="text-sm text-zinc-400 font-light">
            © {new Date().getFullYear()} Datapital. Todos os direitos reservados.
          </span>
        </div>
      </footer>

    </div>
  );
}