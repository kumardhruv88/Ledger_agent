import React from 'react';
import { ShieldCheck, ServerOff, Lock, Code2, Network, FileSearch, ArrowRight, BrainCircuit } from 'lucide-react';
import { cn } from '../lib/utils';

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

      {/* 3. Architecture Pipeline */}
      <section className="w-full max-w-[1000px] px-6 mt-32 flex flex-col items-center">
        <h2 className="text-[28px] font-semibold tracking-tight text-white mb-16">
          The 6-Stage Autonomous State Machine
        </h2>
        
        <div className="w-full max-w-[700px] relative">
          {/* Vertical connection line */}
          <div className="absolute left-[27px] top-[10px] bottom-[10px] w-px bg-white/10 z-0"></div>

          <div className="space-y-12">
            <PipelineStep 
              num="A1" 
              title="The Profiler" 
              desc="Generates deterministic descriptive statistics: cardinality, missingness, outliers, and candidate keys without LLM hallucinations." 
              type="Deterministic"
            />
            <PipelineStep 
              num="A2" 
              title="The Proposer" 
              desc="Reads the profile and proposes strictly testable hypotheses in natural language. Driven by injected domain knowledge." 
              type="Model"
            />
            <PipelineStep 
              num="A3" 
              title="The Registrar" 
              desc="Freezes all candidate hypotheses and their intended statistical tests before any execution begins to prevent p-hacking." 
              type="Deterministic"
            />
            <PipelineStep 
              num="A4" 
              title="The Executor" 
              desc="Writes highly optimized pandas code, runs it in an isolated sandbox, and repairs errors in an autonomous loop." 
              type="Model"
            />
            <PipelineStep 
              num="A5" 
              title="The Statistician" 
              desc="Checks assumptions (e.g. Shapiro-Wilk), picks the test, computes effect sizes, and applies Benjamini-Hochberg FDR correction." 
              type="Deterministic"
            />
            <PipelineStep 
              num="A6" 
              title="The Reporter" 
              desc="Compiles the final prose. Strictly constrained to surviving claims—sentences without a ledger entry are structurally rejected." 
              type="Model"
            />
          </div>
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

function PipelineStep({ num, title, desc, type }) {
  const isModel = type === 'Model';
  return (
    <div className="relative z-10 flex items-start space-x-8 group">
      <div className="flex-shrink-0 w-[56px] h-[56px] rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <span className="text-[14px] font-bold font-mono text-white tracking-widest">{num}</span>
      </div>
      <div className="pt-2">
        <div className="flex items-center space-x-3 mb-2">
          <h4 className="text-[18px] font-semibold text-[#f5f5f5] tracking-tight">{title}</h4>
          <span className={cn(
            "text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded",
            isModel ? "bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20" : "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20"
          )}>
            {type}
          </span>
        </div>
        <p className="text-[15px] text-[#888] leading-relaxed max-w-[500px]">
          {desc}
        </p>
      </div>
    </div>
  );
}
