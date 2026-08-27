import React from 'react';
import { ShieldCheck, ServerOff, Lock, Code2, Network, FileSearch, ArrowRight, BrainCircuit } from 'lucide-react';
import { cn } from '../lib/utils';
import { CoverflowCarousel } from './ui/coverflow-carousel';

const UNSPLASH = (id) => `https://images.unsplash.com/photo-${id}?w=640&h=640&fit=crop&q=70&auto=format`;

const AGENT_SLIDES = [
  {
    src: UNSPLASH("1551288049-bebda4e38f71"), // Abstract tech/data
    alt: "A1 Profiler",
    title: "A1 Profiler",
    subtitle: "Deterministic",
    desc: "Generates deterministic descriptive statistics: cardinality, missingness, outliers, and candidate keys without LLM hallucinations.",
    meta: [
      { label: "Type", value: "Code Execution" },
      { label: "Constraint", value: "Fixed Output" }
    ],
  },
  {
    src: UNSPLASH("1451187580459-43490279c0fa"), // Abstract network
    alt: "A2 Proposer",
    title: "A2 Proposer",
    subtitle: "Model",
    desc: "Reads the profile and proposes strictly testable hypotheses in natural language. Driven by injected domain knowledge.",
    meta: [
      { label: "Type", value: "LLM Generation" },
      { label: "Input", value: "A1 Profile" }
    ],
  },
  {
    src: UNSPLASH("1526374965328-7f61d4dc18c5"), // Abstract matrix/lock
    alt: "A3 Registrar",
    title: "A3 Registrar",
    subtitle: "Deterministic",
    desc: "Freezes all candidate hypotheses and their intended statistical tests before any execution begins to prevent p-hacking.",
    meta: [
      { label: "Type", value: "State Manager" },
      { label: "Role", value: "Immutability lock" }
    ],
  },
  {
    src: UNSPLASH("1518770660439-4636190af475"), // Circuit board/compute
    alt: "A4 Executor",
    title: "A4 Executor",
    subtitle: "Model",
    desc: "Writes highly optimized pandas code, runs it in an isolated sandbox, and repairs errors in an autonomous loop.",
    meta: [
      { label: "Type", value: "LLM Coding" },
      { label: "Sandbox", value: "Secure Subprocess" }
    ],
  },
  {
    src: UNSPLASH("1550751827-4bd374c3f58b"), // Abstract structure
    alt: "A5 Statistician",
    title: "A5 Statistician",
    subtitle: "Deterministic",
    desc: "Checks assumptions (e.g. Shapiro-Wilk), picks the test, computes effect sizes, and applies Benjamini-Hochberg FDR correction.",
    meta: [
      { label: "Type", value: "SciPy/Pingouin" },
      { label: "Action", value: "FDR Control" }
    ],
  },
  {
    src: UNSPLASH("1504868584819-f818b4d8a9e7"), // Abstract light
    alt: "A6 Reporter",
    title: "A6 Reporter",
    subtitle: "Model",
    desc: "Compiles the final prose. Strictly constrained to surviving claims—sentences without a ledger entry are structurally rejected.",
    meta: [
      { label: "Type", value: "LLM Generation" },
      { label: "Constraint", value: "Licensed Text Only" }
    ],
  }
];

export default function LandingContent() {
  return (
    <div className="w-full flex flex-col items-center justify-center pb-32">
      
      {/* Divider */}
      <div className="w-full max-w-[1000px] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-16"></div>

      {/* 1. The Core Problem Hook */}
      <section className="w-full max-w-[1000px] px-6 flex flex-col items-center text-center">
        <h2 className="text-[32px] md:text-[42px] font-semibold tracking-tight text-white mb-6">
          The Multiple Comparisons Problem. <br/>
          <span className="text-[#666]">Solved.</span>
        </h2>
        <p className="text-[16px] md:text-[18px] leading-relaxed text-[#A0A0A0] max-w-[750px]">
          Conventional language-model analysts search hard enough through random noise until they find something, 
          leading to a page of insights with a plausible narrative attached to pure noise. 
          <strong className="text-[#d4d4d4] font-medium"> Ledger refuses to report what statistics cannot support.</strong>
        </p>
      </section>

      {/* 2. Key Features Grid */}
      <section className="w-full max-w-[1000px] px-6 mt-32">
        <div className="grid md:grid-cols-2 gap-6">
          
          <FeatureCard 
            icon={<ServerOff className="w-6 h-6 text-[#10b981]" strokeWidth={1.5}/>}
            title="Fully Offline & Private"
            desc="Runs entirely on your local machine using open-weight models (Ollama). No API keys, no network access, no data egress. Perfect for highly confidential clinical or financial datasets."
            glowColor="rgba(16,185,129,0.1)"
          />
          
          <FeatureCard 
            icon={<Lock className="w-6 h-6 text-[#0ea5e9]" strokeWidth={1.5}/>}
            title="Hypothesis Pre-registration"
            desc="The model proposes hypotheses before any execution begins. The registry is frozen, making post-hoc selective reporting (p-hacking) structurally impossible."
            glowColor="rgba(14,165,233,0.1)"
          />
          
          <FeatureCard 
            icon={<BrainCircuit className="w-6 h-6 text-[#f97316]" strokeWidth={1.5}/>}
            title="Deterministic Adjudication"
            desc="The language model proposes, but deterministic statistics decides. Test selection, effect-size estimation, and False Discovery Rate (FDR) correction are handled entirely by code."
            glowColor="rgba(249,115,22,0.1)"
          />
          
          <FeatureCard 
            icon={<Code2 className="w-6 h-6 text-[#8b5cf6]" strokeWidth={1.5}/>}
            title="Claim-Level Provenance"
            desc="Every sentence in the final report is cryptographically bound to the code that executed it, the values returned, and the test that licensed it. Unbacked narration is rejected."
            glowColor="rgba(139,92,246,0.1)"
          />

        </div>
      </section>

      {/* 3. Architecture Pipeline Carousel */}
      <section className="w-full overflow-hidden mt-32 flex flex-col items-center relative z-20">
        <h2 className="text-[28px] font-semibold tracking-tight text-white mb-8">
          The 6-Stage Autonomous State Machine
        </h2>
        
        <div className="w-full py-6">
          <CoverflowCarousel 
            slides={AGENT_SLIDES} 
            showCaption={true} 
            showNavigation={true}
            showPagination={true}
            cardWidth="clamp(200px, 30vw, 320px)"
          />
        </div>
      </section>

    </div>
  );
}

function FeatureCard({ icon, title, desc, glowColor }) {
  return (
    <div className="aivora-card p-1.5 bg-[#0A0A0A] group relative overflow-hidden">
      {/* Hover glow effect */}
      <div className="absolute top-0 left-0 w-[150px] h-[150px] rounded-full blur-[50px] transition-opacity duration-500 opacity-0 group-hover:opacity-100" style={{ backgroundColor: glowColor, transform: 'translate(-30%, -30%)' }}></div>
      
      <div className="relative z-10 w-full h-full border border-white/5 rounded-[8px] p-8 flex flex-col items-start bg-[#080808]/80">
        <div className="w-12 h-12 rounded-lg bg-[#111111] border border-white/5 flex items-center justify-center mb-6 shadow-inner">
          {icon}
        </div>
        <h3 className="text-[18px] font-semibold text-[#f5f5f5] tracking-tight mb-3">{title}</h3>
        <p className="text-[14px] leading-relaxed text-[#888]">{desc}</p>
      </div>
    </div>
  );
}
