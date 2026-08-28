import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { 
  ArrowRight, Upload, ShieldCheck, Activity, Search, 
  Lock, BarChart2, FileSearch, Shield, RefreshCw, Database 
} from 'lucide-react';

const Counter = ({ from = 0, to, duration = 1.5, isFloat = false, delay = 0 }) => {
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });
  
  useEffect(() => {
    if (inView) {
      let startTime;
      let animationFrameId;
      
      const updateCounter = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        
        // Handle delay
        if (elapsed < delay * 1000) {
          animationFrameId = requestAnimationFrame(updateCounter);
          return;
        }
        
        const activeElapsed = elapsed - (delay * 1000);
        const progress = Math.min(activeElapsed / (duration * 1000), 1);
        const current = progress * (to - from) + from;
        
        if (nodeRef.current) {
          nodeRef.current.textContent = isFloat || !Number.isInteger(to)
            ? current.toFixed(2)
            : Math.floor(current).toString();
        }
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(updateCounter);
        }
      };
      
      animationFrameId = requestAnimationFrame(updateCounter);
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [inView, from, to, duration, isFloat, delay]);

  return <span ref={nodeRef}>{isFloat || !Number.isInteger(from) ? from.toFixed(2) : from}</span>;
};

export default function LandingContent() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] font-sans text-[var(--color-navy)] selection:bg-[var(--color-accent-light)] selection:text-[var(--color-navy)] overflow-hidden">
      
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 w-full z-50 h-[64px] bg-white/85 backdrop-blur-[12px] border-b border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex items-center justify-between px-5 md:px-[48px]">
        {/* LEFT BLOCK */}
        <div className="flex items-center gap-[8px]">
          <div className="w-[28px] h-[28px] rounded-[6px] bg-gradient-to-br from-[#0d9488] to-[#0f766e] flex items-center justify-center">
            <span className="text-white text-[14px] font-extrabold">L</span>
          </div>
          <span className="text-[18px] font-extrabold text-[#0f172a] tracking-[-0.02em]">
            Ledger
          </span>
        </div>

        {/* CENTER BLOCK */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-[32px]">
          {['Home', 'AI Agents', 'About', 'Pricing'].map((item) => (
            <a
              key={item}
              className="relative text-[14px] font-medium text-[#64748b] hover:text-[#0d9488] transition-colors duration-200 cursor-pointer pb-[2px] group no-underline"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0d9488] scale-x-0 origin-left transition-transform duration-200 group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        {/* RIGHT BLOCK */}
        <div className="flex items-center gap-[12px]">
          <button className="hidden sm:block bg-transparent text-[#64748b] text-[14px] font-medium px-[12px] py-[8px] rounded-[6px] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition-colors duration-200 cursor-pointer border-none">
            Sign In
          </button>
          <button className="bg-[#0d9488] text-white border-none rounded-[8px] px-[20px] py-[9px] text-[14px] font-semibold tracking-[-0.01em] cursor-pointer transition-all duration-200 hover:bg-[#0f766e] hover:-translate-y-[1px] hover:shadow-[0_4px_14px_rgba(13,148,136,0.4)] active:translate-y-0">
            Get Started
          </button>
        </div>
      </nav>

      {/* 2. HERO */}
      <section className="relative min-h-screen bg-gradient-to-b from-[#f0fdfa] to-[#ffffff] overflow-hidden">
        {/* Subtle dot grid */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #0d9488 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        <div className="relative z-10 pt-[120px] pb-[80px] px-[24px] max-w-[1200px] mx-auto flex flex-col items-center text-center">
          
          {/* BADGE */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0, ease: "easeOut" }}
            className="inline-flex items-center gap-[8px] bg-white border border-[#99f6e4] rounded-[100px] py-[6px] pr-[16px] pl-[10px] mb-[32px]"
          >
            <span className="w-[8px] h-[8px] rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[12px] font-semibold text-[#0d9488] tracking-[0.05em] whitespace-nowrap">
              Statistically Rigorous · FDR Controlled · Fully Auditable
            </span>
          </motion.div>

          {/* HEADLINE */}
          <h1 className="mb-[24px]">
            <motion.span 
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="block text-[clamp(40px,5.5vw,72px)] font-extrabold text-[#0f172a] tracking-[-0.04em] leading-[1.08]"
            >
              Turn Raw CSV Data Into
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="block text-[clamp(40px,5.5vw,72px)] font-extrabold text-[#0d9488] italic tracking-[-0.04em] leading-[1.08]"
            >
              Statistically Proven
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="block text-[clamp(40px,5.5vw,72px)] font-extrabold text-[#0f172a] tracking-[-0.04em] leading-[1.08]"
            >
              Insights.
            </motion.span>
          </h1>

          {/* SUBTEXT */}
          <motion.p 
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="max-w-[560px] mx-auto mb-[40px] text-[18px] font-normal text-[#64748b] leading-[1.75] tracking-[-0.01em]"
          >
            Ledger is the only automated analyst that pre-registers hypotheses, controls false discovery rate via Benjamini–Hochberg, and refuses to report what statistics cannot support.
          </motion.p>

          {/* CTA BUTTONS */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            className="flex flex-row items-center justify-center gap-[12px] mb-[20px] flex-wrap sm:flex-nowrap"
          >
            <button className="inline-flex items-center gap-[8px] bg-[#0d9488] text-white border-none rounded-[10px] px-[28px] py-[14px] text-[15px] font-semibold tracking-[-0.01em] cursor-pointer whitespace-nowrap w-auto transition-all duration-200 hover:bg-[#0f766e] hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(13,148,136,0.35)]">
              <Upload className="w-[16px] h-[16px] mr-[6px]" />
              Upload Your CSV
            </button>
            <button className="group inline-flex items-center gap-[8px] bg-white text-[#0f172a] border-[1.5px] border-[#e2e8f0] rounded-[10px] px-[28px] py-[14px] text-[15px] font-semibold tracking-[-0.01em] cursor-pointer whitespace-nowrap w-auto transition-all duration-200 hover:border-[#0d9488] hover:text-[#0d9488] hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(13,148,136,0.1)]">
              See How It Works →
              <ArrowRight className="w-[16px] h-[16px] transition-transform duration-200 group-hover:translate-x-[3px]" />
            </button>
          </motion.div>

          {/* TRUST ROW */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            className="flex items-center justify-center gap-[20px] mt-[4px] flex-wrap"
          >
            <div className="text-[13px] font-medium text-[#64748b] flex items-center gap-[6px]">
              ✓ No API key for your data
            </div>
            <span className="text-[#cbd5e1]">·</span>
            <div className="text-[13px] font-medium text-[#64748b] flex items-center gap-[6px]">
              ✓ FDR q=0.05 guaranteed
            </div>
            <span className="text-[#cbd5e1]">·</span>
            <div className="text-[13px] font-medium text-[#64748b] flex items-center gap-[6px]">
              ✓ Every claim auditable
            </div>
          </motion.div>

          {/* PIPELINE PREVIEW CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
            className="mt-[60px] w-[min(880px,92vw)] mx-auto bg-white rounded-[20px] border border-[#e2e8f0] shadow-[0_24px_64px_rgba(15,23,42,0.08),0_4px_16px_rgba(13,148,136,0.05)] overflow-hidden p-0 text-left"
          >
            {/* Top Bar */}
            <div className="px-[20px] py-[14px] border-b border-[#f1f5f9] flex items-center justify-between bg-[#fafafa]">
              <div className="flex gap-[6px]">
                <div className="w-[10px] h-[10px] rounded-full bg-[#ef4444]" />
                <div className="w-[10px] h-[10px] rounded-full bg-[#f59e0b]" />
                <div className="w-[10px] h-[10px] rounded-full bg-[#22c55e]" />
              </div>
              <div className="text-[12px] text-[#94a3b8] font-medium">
                ledger — analysis running
              </div>
              <div className="flex items-center gap-[6px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-[11px] font-bold text-[#0d9488] tracking-[0.08em]">LIVE</span>
              </div>
            </div>

            {/* Pipeline Track */}
            <div className="px-[28px] pt-[24px] pb-[20px] flex items-center justify-between overflow-x-auto gap-0 hide-scrollbar">
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes dash { to { stroke-dashoffset: -16; } }
                .animate-dash { animation: dash 1s linear infinite; }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
              `}} />
              
              {[
                { id: 'A0', label: 'Janitor', color: '#6366f1', badgeBg: '#eef2ff', badgeText: '#4338ca', status: '✓ done' },
                { id: 'A1', label: 'Profiler', color: '#0d9488', badgeBg: '#f0fdfa', badgeText: '#0d9488', status: '✓ done' },
                { id: 'A2', label: 'Proposer', color: '#f59e0b', badgeBg: '#fffbeb', badgeText: '#92400e', status: '✓ done' },
                { id: 'A3', label: 'Registrar', color: '#ef4444', badgeBg: '#fef2f2', badgeText: '#991b1b', status: '🔒 frozen' },
                { id: 'A4', label: 'Executor', color: '#10b981', badgeBg: '#f0fdf4', badgeText: '#166534', status: '⟳ running', pulse: true },
              ].map((node, i, arr) => (
                <React.Fragment key={node.id}>
                  <div 
                    className="flex flex-col items-start px-[14px] py-[10px] bg-white rounded-[12px] border border-[#e2e8f0] border-l-[3px] min-w-[100px] shrink-0"
                    style={{ borderLeftColor: node.color }}
                  >
                    <span className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#0f172a] mb-[6px]">
                      {node.id} {node.label}
                    </span>
                    <span 
                      className="inline-flex items-center gap-[4px] text-[10px] font-semibold px-[8px] py-[2px] rounded-full"
                      style={{ backgroundColor: node.badgeBg, color: node.badgeText }}
                    >
                      {node.pulse ? (
                        <span className="animate-pulse flex items-center gap-1">⟳ running</span>
                      ) : (
                        <span>{node.status}</span>
                      )}
                    </span>
                  </div>
                  
                  {i < arr.length - 1 && (
                    <svg width="60" height="12" style={{ flexShrink: 0 }}>
                      <line x1="0" y1="6" x2="60" y2="6" stroke="#0d9488" strokeWidth="1.5" strokeDasharray="4 4" className="animate-dash" />
                    </svg>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Stats Row */}
            <div className="px-[20px] py-[12px] border-t border-[#f1f5f9] flex items-center justify-center gap-[12px] bg-[#fafafa]">
              {["12 hypotheses registered", "FDR q = 0.05", "Groundedness 1.00"].map((text, i) => (
                <div key={i} className="bg-[#f0fdfa] border border-[#99f6e4] rounded-[8px] px-[12px] py-[5px] text-[11px] font-semibold text-[#0d9488] whitespace-nowrap">
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. PROBLEM STATEMENT */}
      <section className="bg-[#ffffff] py-[120px] px-[24px] w-full">
        <div className="max-w-[780px] mx-auto flex flex-col items-center text-center">
          <span className="text-[11px] font-bold tracking-[0.14em] text-[#0d9488] uppercase mb-[20px] block">
            The Problem
          </span>
          <h2 className="text-[clamp(36px,4.5vw,56px)] font-extrabold text-[#0f172a] tracking-[-0.03em] leading-[1.1] m-0 block">
            The Multiple Comparisons Problem.
          </h2>
          <span className="text-[clamp(36px,4.5vw,56px)] font-extrabold text-[#0d9488] italic tracking-[-0.03em] leading-[1.1] mt-[4px] block">
            Solved.
          </span>
          
          <p className="mt-[28px] max-w-[620px] text-[17px] text-[#64748b] leading-[1.8] font-normal tracking-[-0.01em] text-center">
            LLMs are eager to please. When handed a dataset and asked for insights,
            they will test thousands of combinations and only report the statistically
            significant ones — guaranteeing false discoveries. Ledger eliminates
            p-hacking by explicitly separating hypothesis generation from testing,
            enforced structurally by the pipeline architecture.
          </p>

          <div className="mt-[56px] mb-[56px] w-[64px] h-[2px] bg-gradient-to-r from-[#0d9488] to-[#99f6e4] rounded-[2px] self-center" />

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-0 w-full max-w-[640px] mx-auto border border-[#e2e8f0] rounded-[16px] overflow-hidden bg-white"
          >
            {[
              { target: 14, label: "False findings by LLM agents on pure noise", prefix: "~", color: "#0d9488" },
              { target: 0, label: "False findings by Ledger (NULLSET target)", prefix: "", color: "#ef4444" },
              { target: 1.00, label: "Groundedness — every claim auditable", prefix: "", color: "#10b981", isFloat: true }
            ].map((stat, i) => (
              <div key={i} className="px-[24px] py-[32px] flex flex-col items-center text-center md:border-r border-b md:border-b-0 border-[#e2e8f0] last:border-0 transition-colors duration-200 hover:bg-[#f0fdfa]">
                <div 
                  className="text-[52px] font-extrabold tracking-[-0.04em] leading-[1] mb-[10px] tabular-nums"
                  style={{ color: stat.color }}
                >
                  {stat.prefix}<Counter to={stat.target} duration={1.8} isFloat={stat.isFloat} delay={i * 0.2} />
                </div>
                <div className="text-[12px] font-medium text-[#64748b] leading-[1.5] max-w-[120px] text-center">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. FEATURE CARDS */}
      <section className="bg-[#f8fafc] py-[120px] px-[24px] w-full">
        <div className="max-w-[1160px] mx-auto">
          <div className="text-center mb-[64px]">
            <span className="text-[11px] font-bold tracking-[0.14em] text-[#0d9488] uppercase mb-[16px] block">
              How It Works
            </span>
            <h2 className="text-[clamp(32px,4vw,48px)] font-extrabold text-[#0f172a] tracking-[-0.03em] leading-[1.15] m-0">
              Six Agents. One Auditable Truth.
            </h2>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
              hidden: {}
            }}
            className="grid grid-cols-1 min-[900px]:grid-cols-2 lg:grid-cols-3 gap-[24px] w-full"
          >
            {[
              { icon: Lock, title: "Hypothesis Pre-registration", desc: "Hypotheses are frozen before any test executes. Post-hoc selection is structurally impossible — not just discouraged.", badge: "A3 REGISTRAR" },
              { icon: BarChart2, title: "Benjamini–Hochberg FDR Control", desc: "Every test is corrected across the full session family. The system refuses to report a finding it cannot statistically support.", badge: "A5 STATISTICIAN" },
              { icon: FileSearch, title: "Claim-Level Provenance", desc: "Every sentence in the report links to the exact code that ran, the values returned, and the test that licensed it. Unbacked narration is rejected.", badge: "A6 REPORTER" },
              { icon: Shield, title: "Sandboxed Code Execution", desc: "LLM-generated pandas code runs in an isolated subprocess with import blocklist, resource limits, and zero socket access.", badge: "A4 EXECUTOR" },
              { icon: RefreshCw, title: "Self-Improving Loop", desc: "A8 Meta-Agent mines LangSmith telemetry for failure patterns and generates prompt patches — improving accuracy without retraining weights.", badge: "A8 META-AGENT" },
              { icon: Database, title: "DPDPA-Compliant Local Analysis", desc: "No data leaves your machine. Run on clinical, financial, and student data that cannot legally be uploaded to cloud services.", badge: "LOCAL FIRST" }
            ].map((card, i) => (
              <motion.div 
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 32 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
                }}
                className="group relative bg-white border border-[#e2e8f0] rounded-[20px] px-[28px] py-[32px] flex flex-col items-start text-left cursor-default transition-all duration-300 overflow-hidden hover:-translate-y-[6px] hover:border-[#99f6e4] hover:shadow-[0_20px_48px_rgba(13,148,136,0.1),0_4px_12px_rgba(13,148,136,0.06)]"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0d9488] to-[#99f6e4] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="w-[48px] h-[48px] bg-[#f0fdfa] rounded-[12px] flex items-center justify-center mb-[20px] border border-[#ccfbf1] transition-all duration-300 group-hover:bg-[#0d9488]">
                  <card.icon className="w-[22px] h-[22px] text-[#0d9488] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-[16px] font-bold text-[#0f172a] tracking-[-0.02em] mb-[10px] leading-[1.3] text-left">
                  {card.title}
                </h3>
                <p className="text-[14px] text-[#64748b] leading-[1.7] font-normal flex-grow">
                  {card.desc}
                </p>
                <div className="mt-[20px] inline-flex items-center bg-[#f0fdfa] border border-[#99f6e4] rounded-[100px] px-[12px] py-[4px] text-[10px] font-bold text-[#0d9488] tracking-[0.08em] uppercase">
                  {card.badge}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. AGENT PIPELINE TIMELINE */}
      <section className="bg-white py-[120px] px-[24px] w-full">
        <div className="max-w-[780px] mx-auto">
          <div className="text-center mb-[72px]">
            <span className="text-[11px] font-bold tracking-[0.14em] text-[#0d9488] uppercase mb-[16px] block">
              The Pipeline
            </span>
            <h2 className="text-[clamp(28px,3.5vw,44px)] font-extrabold text-[#0f172a] tracking-[-0.03em] m-0">
              The 6-Stage Autonomous State Machine
            </h2>
            <p className="mt-[12px] text-[16px] text-[#64748b] leading-[1.7] max-w-[600px] mx-auto">
              A rigid, inspectable LangGraph pipeline where every transition is a correctness property — not a suggestion.
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.12 } },
              hidden: {}
            }}
            className="relative flex flex-col gap-0"
          >
            {/* Center vertical line */}
            <motion.div 
              variants={{
                hidden: { scaleY: 0 },
                visible: { scaleY: 1, transition: { duration: 1.2, ease: "easeOut" } }
              }}
              className="absolute left-[28px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#0d9488] to-[#ccfbf1] z-0 origin-top"
            />

            {[
              { id: 0, name: "A0 Janitor", type: "DETERMINISTIC", desc: "Type coercion, dedup, domain annotation (medical/financial/temporal)", in: "Raw CSV bytes", out: "cleaned_df + ColumnProfiles" },
              { id: 1, name: "A1 Profiler", type: "DETERMINISTIC", desc: "Deep statistical summary: Shapiro-Wilk, Shannon entropy, outliers", in: "cleaned_df", out: "profile_json (8k chars)" },
              { id: 2, name: "A2 Proposer", type: "LLM + RAG", desc: "Reads profile + RAG context, proposes 5-12 strictly testable hypotheses", in: "profile_json + RAG", out: "HypothesisEntry list" },
              { id: 3, name: "A3 Registrar 🔒", type: "DETERMINISTIC", desc: "SHA-256 freeze — registry is immutable after this. BH denominator locked.", in: "Hypothesis list", out: "Frozen Registry + hash", special: true },
              { id: 4, name: "A4 Executor", type: "LLM + REACT", desc: "Writes pandas code, executes in sandbox, 3-attempt repair loop per hypothesis", in: "Frozen Registry + schema", out: "raw_data per hypothesis" },
              { id: 5, name: "A5 Statistician", type: "DETERMINISTIC", desc: "Assumption checks, test selection, BH-FDR across full family, effect sizes", in: "raw_data", out: "LedgerEntry (SUPPORTED / NOT-SUPPORTED)" },
            ].map((stage, i) => (
              <motion.div 
                key={stage.id} 
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                className="flex items-start gap-[24px] relative pb-[40px] last:pb-0"
              >
                {/* LEFT - Number Circle */}
                <div 
                  className={`w-[56px] h-[56px] min-w-[56px] rounded-full flex items-center justify-center text-white text-[18px] font-extrabold relative z-10 border-[3px] border-white
                    ${stage.special 
                      ? 'bg-[#ef4444] shadow-[0_0_0_2px_#ef4444,0_4px_12px_rgba(239,68,68,0.3)]' 
                      : 'bg-[#0d9488] shadow-[0_0_0_2px_#0d9488,0_4px_12px_rgba(13,148,136,0.3)]'
                    }`}
                >
                  {stage.id}
                </div>

                {/* RIGHT - Content Card */}
                <div className="flex-1 bg-white border border-[#e2e8f0] rounded-[16px] px-[28px] py-[24px] transition-all duration-250 hover:border-[#99f6e4] hover:shadow-[0_8px_24px_rgba(13,148,136,0.08)] hover:translate-x-[4px]">
                  
                  {/* TOP ROW */}
                  <div className="flex items-center gap-[10px] mb-[10px] flex-wrap">
                    <span className="text-[17px] font-bold text-[#0f172a] tracking-[-0.02em]">
                      {stage.name}
                    </span>
                    <span 
                      className={`inline-flex items-center rounded-[100px] px-[10px] py-[3px] text-[10px] font-bold tracking-[0.07em] uppercase border ${
                        stage.type === 'DETERMINISTIC' ? 'bg-[#f0fdfa] text-[#0d9488] border-[#99f6e4]' :
                        stage.type === 'LLM' ? 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]' :
                        stage.type === 'LLM + RAG' ? 'bg-[#ede9fe] text-[#5b21b6] border-[#ddd6fe]' :
                        'bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]'
                      }`}
                    >
                      {stage.type}
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-[14px] text-[#64748b] mb-[14px] leading-[1.6]">
                    {stage.desc}
                  </p>

                  {/* INPUT -> OUTPUT ROW */}
                  <div className="flex items-center gap-[10px] px-[14px] py-[10px] bg-[#f8fafc] rounded-[10px] border border-[#e2e8f0] text-[12px] font-mono flex-wrap">
                    <span className="bg-white border border-[#e2e8f0] rounded-[6px] px-[10px] py-[3px] text-[#475569] font-medium whitespace-nowrap">
                      {stage.in}
                    </span>
                    <span className="text-[#0d9488] font-bold text-[14px] shrink-0">→</span>
                    <span className="bg-[#f0fdfa] border border-[#99f6e4] rounded-[6px] px-[10px] py-[3px] text-[#0d9488] font-semibold whitespace-nowrap">
                      {stage.out}
                    </span>
                  </div>

                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. CTA FOOTER BANNER */}
      <section className="bg-gradient-to-br from-[#0d9488] via-[#0f766e] to-[#134e4a] py-[80px] w-full">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-[11px] uppercase tracking-[0.12em] text-white/70 font-semibold mb-4">Ready to Analyse?</div>
          <h2 className="text-[40px] font-extrabold text-white leading-tight tracking-[-0.03em] mb-4">
            Upload a CSV. Get an audited report in minutes.
          </h2>
          <p className="text-[16px] text-white/75 leading-relaxed max-w-2xl mx-auto mb-10">
            No API key for your data. No dark pattern. Every finding traceable.
          </p>
          <button className="bg-white text-[#0d9488] rounded-xl px-[32px] py-[16px] text-[15px] font-bold hover:-translate-y-[2px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] transition-all duration-300 mb-8">
            Upload Your First CSV →
          </button>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] font-medium text-white/85">
            <span>✓ Free forever</span>
            <span>✓ No signup required</span>
            <span>✓ Data never leaves your device</span>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-[#0f172a] pt-[48px] pb-[32px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-sm bg-white" />
                <span className="font-extrabold text-[20px] tracking-tight text-white">Ledger</span>
              </div>
              <p className="text-white/50 text-[13px] max-w-[200px]">
                The analyst that refuses to hallucinate.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {['About', 'GitHub', 'Research Paper', 'Evaluation Protocol'].map(link => (
                <a key={link} href="#" className="text-white/60 text-[13px] hover:text-white transition-colors">
                  {link}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-1 text-white/50 text-[12px] leading-relaxed">
              <p>Built at NSUT</p>
              <p>CSE Dept. · BTP 2023–27</p>
              <p className="mt-2 text-white/40">Dhruv Kumar · Rahul · Garv Bahl</p>
            </div>

          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/40 text-[12px]">
              © 2026 Ledger. NSUT Department of Computer Science.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
