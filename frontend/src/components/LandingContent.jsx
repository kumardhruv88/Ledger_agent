import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { 
  ArrowRight, Upload, ShieldCheck, Activity, Search, 
  Lock, BarChart2, FileSearch, Shield, RefreshCw, Database 
} from 'lucide-react';

const Counter = ({ from = 0, to, duration = 1.5 }) => {
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });
  
  useEffect(() => {
    if (inView) {
      let startTime;
      const updateCounter = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        const current = progress * (to - from) + from;
        
        if (nodeRef.current) {
          nodeRef.current.textContent = Number.isInteger(to) 
            ? Math.floor(current).toString()
            : current.toFixed(2);
        }
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };
      requestAnimationFrame(updateCounter);
    }
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{from}</span>;
};

export default function LandingContent() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] font-sans text-[var(--color-navy)] selection:bg-[var(--color-accent-light)] selection:text-[var(--color-navy)] overflow-hidden">
      
      {/* 1. NAVBAR */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
          scrolled ? 'bg-white/90 backdrop-blur-md border-b border-[var(--color-border)] shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-teal-500" />
            <span className="font-extrabold text-[20px] tracking-tight text-[#0f172a]">Ledger</span>
          </div>

          <div className="hidden md:flex space-x-8">
            {['Home', 'AI Agents', 'About', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="relative text-[14px] font-medium text-[#64748b] hover:text-[#0d9488] transition-colors group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#0d9488] origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="text-[14px] font-medium text-[#64748b] hover:text-[#0f172a] transition-colors hidden sm:block">
              Sign In
            </button>
            <button className="bg-[#0d9488] text-white rounded-lg px-[18px] py-[8px] text-[14px] font-semibold hover:bg-[#0f766e] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(13,148,136,0.35)] transition-all duration-200">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO */}
      <section className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
        {/* Background Gradients & Patterns */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,var(--color-bg)_0%,#ffffff_100%)]" />
        <div 
          className="absolute inset-0 z-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(#0d9488 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center flex flex-col items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#0d9488] mb-8 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[12px] font-semibold text-[#0d9488] tracking-[0.05em] uppercase">
              Statistically Rigorous · FDR Controlled · Fully Auditable
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22 }}
            className="text-[clamp(44px,6vw,80px)] font-extrabold tracking-[-0.04em] leading-[1.05] text-[#0f172a] mb-6"
          >
            Turn Raw CSV Data Into <br className="hidden md:block" />
            <span className="text-[#0d9488] italic">Statistically Proven</span> Insights.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.34 }}
            className="text-[18px] text-[#64748b] font-normal leading-[1.7] max-w-[560px] mx-auto mb-10"
          >
            Ledger is the only automated analyst that pre-registers hypotheses, controls false discovery rate via Benjamini–Hochberg, and refuses to report what statistics cannot support.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.46 }}
            className="flex flex-col sm:flex-row gap-[12px] items-center justify-center w-full"
          >
            <button className="flex items-center justify-center gap-2 bg-[#0d9488] text-white rounded-xl px-[28px] py-[14px] text-[15px] font-semibold hover:bg-[#0f766e] hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(13,148,136,0.4)] transition-all duration-200 w-full sm:w-auto">
              <Upload className="w-4 h-4" />
              Upload Your CSV
            </button>
            <button className="group flex items-center justify-center gap-2 bg-white text-[#0f172a] border-[1.5px] border-[var(--color-border)] rounded-xl px-[28px] py-[14px] text-[15px] font-semibold hover:text-[#0d9488] hover:border-[#0d9488] hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(13,148,136,0.12)] transition-all duration-200 w-full sm:w-auto">
              See How It Works
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-[12px] text-[#64748b] font-medium"
          >
            <span>✓ No API Key for your data</span>
            <span className="opacity-50">·</span>
            <span>✓ FDR q=0.05 guaranteed</span>
            <span className="opacity-50">·</span>
            <span>✓ Every claim auditable</span>
          </motion.div>
        </div>

        {/* 3. HERO PIPELINE PREVIEW CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
          className="relative z-10 w-full max-w-[90vw] md:max-w-[860px] mt-[48px] bg-white rounded-[20px] border border-[#e2e8f0] shadow-[0_32px_64px_rgba(15,23,42,0.08),0_8px_16px_rgba(13,148,136,0.06)] p-[28px]"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-1.5">
              <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f56]" />
              <div className="w-[10px] h-[10px] rounded-full bg-[#ffbd2e]" />
              <div className="w-[10px] h-[10px] rounded-full bg-[#27c93f]" />
            </div>
            <div className="text-[12px] text-[#64748b] font-mono">ledger — analysis running</div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0d9488] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#0d9488] animate-pulse" />
              Live
            </div>
          </div>

          {/* Pipeline */}
          <div className="flex items-center justify-between overflow-x-auto pb-4 hide-scrollbar">
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes dashAnim { to { stroke-dashoffset: -8; } }
              .stroke-anim { animation: dashAnim 0.5s linear infinite; }
              .hide-scrollbar::-webkit-scrollbar { display: none; }
            `}} />
            {[
              { id: 'A0', label: 'Janitor', color: '#6366f1', status: '✓ done' },
              { id: 'A1', label: 'Profiler', color: '#0d9488', status: '✓ done' },
              { id: 'A2', label: 'Proposer', color: '#f59e0b', status: '✓ done' },
              { id: 'A3', label: 'Registrar 🔒', color: '#ef4444', status: '✓ done', isFrozen: true },
              { id: 'A4', label: 'Executor', color: '#10b981', status: '⟳ running' },
            ].map((node, i, arr) => (
              <React.Fragment key={node.id}>
                <div 
                  className="bg-white rounded-xl border border-[#e2e8f0] py-[10px] px-[14px] min-w-[90px] text-center flex flex-col items-center shadow-sm relative shrink-0"
                  style={{ borderLeft: `3px solid ${node.color}` }}
                >
                  {node.isFrozen && (
                    <div className="absolute -top-2 -right-2 bg-[#ef4444] text-white text-[9px] font-bold px-1.5 rounded-sm uppercase">Frozen</div>
                  )}
                  <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#0f172a] whitespace-nowrap mb-1">
                    {node.id} {node.label}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${node.status.includes('done') ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600 animate-pulse'}`}>
                    {node.status}
                  </span>
                </div>
                
                {i < arr.length - 1 && (
                  <div className="flex-grow min-w-[20px] h-[20px] flex items-center shrink-0">
                    <svg width="100%" height="2" className="w-full">
                      <line x1="0" y1="1" x2="100%" y2="1" stroke="#0d9488" strokeWidth="1.5" strokeDasharray="4 4" className="stroke-anim" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Bottom Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {["12 hypotheses registered", "FDR q=0.05", "Groundedness 1.00"].map((text, i) => (
              <div key={i} className="bg-[var(--color-bg)] rounded-lg text-[11px] font-semibold text-[#0d9488] px-[10px] py-[4px] border border-[#ccfbf1]">
                {text}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 4. PROBLEM STATEMENT */}
      <section className="bg-white py-[120px]">
        <div className="max-w-[700px] mx-auto px-4 text-center">
          <div className="text-[11px] uppercase tracking-[0.12em] text-[#0d9488] font-semibold mb-4">The Problem</div>
          <h2 className="text-[52px] font-extrabold text-[#0f172a] leading-[1.1] tracking-tight">
            The Multiple Comparisons Problem.
          </h2>
          <h2 className="text-[52px] font-extrabold text-[#0d9488] leading-[1.1] tracking-tight italic mb-6">
            Solved.
          </h2>
          <p className="text-[18px] text-[#64748b] leading-[1.8] max-w-[600px] mx-auto mb-16">
            LLMs are eager to please. When handed a dataset and asked for insights, they will test thousands of combinations in the background and only report the statistically significant ones. This guarantees false discoveries. Ledger eliminates p-hacking by explicitly separating hypothesis generation from hypothesis testing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100 pt-12">
            {[
              { target: 14, label: "False findings by LLM agents on pure noise", prefix: "~" },
              { target: 0, label: "False findings by Ledger (NULLSET target)", prefix: "" },
              { target: 1.00, label: "Groundedness score (every claim auditable)", prefix: "" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-[48px] font-extrabold text-[#0d9488] leading-none mb-2">
                  {stat.prefix}<Counter to={stat.target} duration={1.5} />
                </div>
                <div className="text-[13px] text-[#64748b] font-medium leading-snug max-w-[150px]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURE CARDS */}
      <section className="bg-[#f8fafc] py-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-[11px] uppercase tracking-[0.12em] text-[#0d9488] font-semibold mb-4">How It Works</div>
            <h2 className="text-[40px] md:text-[52px] font-extrabold text-[#0f172a] leading-[1.1] tracking-tight">
              Six Agents. One Auditable Truth.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
            {[
              { icon: Lock, title: "Hypothesis Pre-registration", desc: "Hypotheses are frozen before any test executes. Post-hoc selection is structurally impossible — not just discouraged.", badge: "A3 REGISTRAR" },
              { icon: BarChart2, title: "Benjamini–Hochberg FDR Control", desc: "Every test is corrected across the full session family. The system refuses to report a finding it cannot statistically support.", badge: "A5 STATISTICIAN" },
              { icon: FileSearch, title: "Claim-Level Provenance", desc: "Every sentence in the report links to the exact code that ran, the values returned, and the test that licensed it.", badge: "A6 REPORTER" },
              { icon: Shield, title: "Sandboxed Code Execution", desc: "LLM-generated pandas code runs in an isolated subprocess with import blocklist, resource limits, and no socket access.", badge: "A4 EXECUTOR" },
              { icon: RefreshCw, title: "Self-Improving Loop", desc: "A8 Meta-Agent mines failure patterns from LangSmith telemetry and generates prompt patches — improving accuracy without retraining.", badge: "A8 META-AGENT" },
              { icon: Database, title: "Full Offline Capable", desc: "No data leaves your machine. DPDPA-compliant. Run on clinical, financial, and student data safely.", badge: "LOCAL FIRST" }
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-[20px] border border-[#e2e8f0] p-[32px] hover:-translate-y-[6px] hover:shadow-[0_20px_40px_rgba(13,148,136,0.12)] hover:border-[#99f6e4] transition-all duration-300 flex flex-col h-full"
              >
                <div className="w-[48px] h-[48px] rounded-xl bg-[var(--color-bg)] flex items-center justify-center mb-4 shrink-0">
                  <card.icon className="w-6 h-6 text-[#0d9488]" />
                </div>
                <h3 className="text-[18px] font-bold text-[#0f172a] mb-2">{card.title}</h3>
                <p className="text-[14px] text-[#64748b] leading-[1.7] flex-grow mb-6">{card.desc}</p>
                <div className="self-start inline-block bg-[var(--color-bg)] text-[#0d9488] border border-[#99f6e4] rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]">
                  {card.badge}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. AGENT PIPELINE VISUAL */}
      <section className="bg-white py-[100px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[40px] font-extrabold text-[#0f172a] leading-[1.1] tracking-tight mb-4">
              The 6-Stage Autonomous State Machine
            </h2>
            <p className="text-[18px] text-[#64748b] leading-[1.7] max-w-[600px] mx-auto">
              A rigid, inspectable LangGraph pipeline where every transition is a correctness property.
            </p>
          </div>

          <div className="relative pl-4 md:pl-0">
            {[
              { id: 0, name: "A0 Janitor", type: "DETERMINISTIC", desc: "Type coercion, dedup, domain annotation", in: "Raw CSV", out: "cleaned_df + ColumnProfiles" },
              { id: 1, name: "A1 Profiler", type: "DETERMINISTIC", desc: "Deep statistical summary, Shapiro-Wilk, entropy", in: "cleaned_df", out: "profile_json" },
              { id: 2, name: "A2 Proposer", type: "LLM + RAG", desc: "Proposes 5-12 testable hypotheses from profile", in: "profile_json + RAG", out: "HypothesisEntry list" },
              { id: 3, name: "A3 Registrar", type: "DETERMINISTIC 🔒", desc: "SHA-256 freeze — no new hypotheses after this", in: "hypothesis list", out: "Frozen Registry" },
              { id: 4, name: "A4 Executor", type: "LLM + ReAct", desc: "Writes & runs pandas code, 3-attempt repair loop", in: "Frozen Registry + schema", out: "raw_data per hypothesis" },
              { id: 5, name: "A5 Statistician", type: "DETERMINISTIC", desc: "BH-FDR, effect sizes, licensed_text", in: "raw_data", out: "LedgerEntry (SUPPORTED / NOT-SUPPORTED)" },
            ].map((stage, i, arr) => (
              <div key={stage.id} className="relative flex md:justify-center items-start md:items-stretch mb-8 last:mb-0 group">
                
                {/* Connecting Line */}
                {i < arr.length - 1 && (
                  <motion.div 
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute left-[19px] md:left-1/2 top-[40px] bottom-[-32px] w-[2px] bg-[#0d9488] md:-translate-x-1/2 origin-top opacity-30" 
                    style={{ borderLeft: '2px dashed #0d9488', background: 'transparent' }}
                  />
                )}

                {/* Stage Circle */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-[40px] h-[40px] rounded-full bg-[#0d9488] flex items-center justify-center text-white font-extrabold text-[16px] z-10 border-4 border-white shadow-sm">
                  {stage.id}
                </div>

                {/* Desktop layout: Alternate left/right cards if desired, or just stack them. 
                    The prompt implies a timeline. Let's stack them nicely to the right on mobile, and right on desktop for simplicity, 
                    or split them. The prompt says "Left side: stage number, Center: line, Right side: card". So it's a left-aligned timeline.
                 */}
                <div className="ml-[60px] md:ml-[50%] md:pl-10 w-full md:w-1/2 pt-1 pb-4">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-xl border border-[#e2e8f0] p-[20px] md:p-[24px] hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h4 className="font-bold text-[#0f172a] text-[16px]">{stage.name}</h4>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        stage.type.includes('DETERMINISTIC') 
                          ? 'bg-[#f0fdfa] text-[#0d9488] border-[#99f6e4]' 
                          : stage.type.includes('RAG')
                            ? 'bg-[#ede9fe] text-[#5b21b6] border-[#ddd6fe]'
                            : 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]'
                      }`}>
                        {stage.type}
                      </span>
                    </div>
                    <p className="text-[14px] text-[#64748b] mb-4">{stage.desc}</p>
                    <div className="flex flex-wrap items-center gap-2 text-[12px] font-mono text-[#64748b] bg-gray-50 rounded-lg p-2 border border-gray-100">
                      <span className="font-medium text-[#0f172a]">{stage.in}</span>
                      <ArrowRight className="w-3 h-3 mx-1" />
                      <span className="font-medium text-[#0d9488]">{stage.out}</span>
                    </div>
                  </motion.div>
                </div>

              </div>
            ))}
          </div>
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
