import React from 'react';
import { CardStack } from './ui/card-stack';

const UNSPLASH = (id) => `https://images.unsplash.com/photo-${id}?w=640&h=640&fit=crop&q=70&auto=format`;

const AGENT_SLIDES = [
  {
    id: 1,
    imageSrc: UNSPLASH("1550751827-4bd374c3f58b"), // Abstract dark tech
    title: "A1 Profiler",
    tag: "Deterministic",
    description: "Generates deterministic descriptive statistics: cardinality, missingness, outliers, and candidate keys without LLM hallucinations.",
  },
  {
    id: 2,
    imageSrc: UNSPLASH("1451187580459-43490279c0fa"), // Abstract network / earth
    title: "A2 Proposer",
    tag: "Model",
    description: "Reads the profile and proposes strictly testable hypotheses in natural language. Driven by injected domain knowledge.",
  },
  {
    id: 3,
    imageSrc: UNSPLASH("1526374965328-7f61d4dc18c5"), // Lock / Grid
    title: "A3 Registrar",
    tag: "Deterministic",
    description: "Freezes all candidate hypotheses and their intended statistical tests before any execution begins to prevent p-hacking.",
  },
  {
    id: 4,
    imageSrc: UNSPLASH("1518770660439-4636190af475"), // Circuit board/compute
    title: "A4 Executor",
    tag: "Model",
    description: "Writes highly optimized pandas code, runs it in an isolated sandbox, and repairs errors in an autonomous loop.",
  },
  {
    id: 5,
    imageSrc: UNSPLASH("1551288049-bebda4e38f71"), // Data/Nodes
    title: "A5 Statistician",
    tag: "Deterministic",
    description: "Checks assumptions (e.g. Shapiro-Wilk), picks the test, computes effect sizes, and applies Benjamini-Hochberg FDR correction.",
  },
  {
    id: 6,
    imageSrc: UNSPLASH("1614064641983-4005pi68434"), // Server light
    title: "A6 Reporter",
    tag: "Model",
    description: "Compiles the final prose. Strictly constrained to surviving claims—sentences without a ledger entry are structurally rejected.",
  }
];

const FEATURE_SLIDES = [
  {
    id: "f1",
    imageSrc: UNSPLASH("1558494949-ef010cbdcc31"), // Lock / Blueprint abstract
    title: "Fully Offline & Private",
    tag: "Security",
    description: "Runs entirely on your local machine using open-weight models (Ollama). No API keys, no network access, no data egress. Perfect for highly confidential clinical or financial datasets."
  },
  {
    id: "f2",
    imageSrc: UNSPLASH("1509095400922-8eb78b27f311"), // Circuit / Logic
    title: "Hypothesis Pre-registration",
    tag: "Integrity",
    description: "The model proposes hypotheses before any execution begins. The registry is frozen, making post-hoc selective reporting (p-hacking) structurally impossible."
  },
  {
    id: "f3",
    imageSrc: UNSPLASH("1550751827-4bd374c3f58b"), // Abstract dark tech
    title: "Deterministic Adjudication",
    tag: "Execution",
    description: "The language model proposes, but deterministic statistics decides. Test selection, effect-size estimation, and False Discovery Rate (FDR) correction are handled entirely by code."
  },
  {
    id: "f4",
    imageSrc: UNSPLASH("1451187580459-43490279c0fa"), // Node network / earth
    title: "Claim-Level Provenance",
    tag: "Traceability",
    description: "Every sentence in the final report is cryptographically bound to the code that executed it, the values returned, and the test that licensed it. Unbacked narration is rejected."
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

      {/* 2. Key Features Stack */}
      <section className="w-full overflow-hidden mt-24 flex flex-col items-center relative z-20">
        <div className="w-full py-6">
          <CardStack 
            items={FEATURE_SLIDES}
            initialIndex={0}
            autoAdvance={true}
            intervalMs={4000}
            pauseOnHover={true}
            showDots={true}
            cardWidth={440}
            cardHeight={280}
          />
        </div>
      </section>

      {/* 3. Architecture Pipeline Stack */}
      <section className="w-full overflow-hidden mt-32 flex flex-col items-center relative z-20">
        <h2 className="text-[28px] font-semibold tracking-tight text-white mb-8">
          The 6-Stage Autonomous State Machine
        </h2>
        
        <div className="w-full py-6">
          <CardStack 
            items={AGENT_SLIDES}
            initialIndex={0}
            autoAdvance={true}
            intervalMs={3000}
            pauseOnHover={true}
            showDots={true}
            cardWidth={440}
            cardHeight={280}
            className="pb-16"
          />
        </div>
      </section>

    </div>
  );
}
