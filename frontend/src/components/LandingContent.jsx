import React from 'react';
import { ArrowRight, Play, Upload, ShieldCheck, Activity, Search } from 'lucide-react';

export default function LandingContent() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] font-sans text-[var(--color-navy)] selection:bg-[var(--color-accent-light)] selection:text-[var(--color-navy)]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">Ledger</span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex space-x-8">
              {['Home', 'AI Agents', 'About', 'Pricing'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-navy)] transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* CTA */}
            <div>
              <button className="bg-white text-[var(--color-navy)] border border-[var(--color-border)] px-5 py-2.5 rounded-2xl text-sm font-semibold hover:bg-[var(--color-bg)] transition-colors shadow-sm">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] to-white pt-24 pb-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[var(--color-border)] text-[var(--color-accent)] text-xs font-semibold mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
            Stop Hunting for Omnichannel Performance Data
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Turn Raw Data Into <br className="hidden md:block" />
            <span className="relative inline-block px-4 pb-2 bg-[var(--color-accent-light)]/50 rounded-2xl text-[var(--color-navy)]">
              Statistically Proven
            </span> Insights
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--color-muted)] mb-10 leading-relaxed">
            Ledger helps businesses structure messy data, build trusted data foundations, and deploy AI agents—empowering teams to move faster with FDR-controlled analysis and confident, data-driven decisions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="flex items-center gap-2 bg-white text-[var(--color-navy)] border border-[var(--color-border)] px-8 py-3.5 rounded-2xl font-semibold hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto justify-center">
              <Play className="w-4 h-4 text-[var(--color-accent)]" />
              See How It Works
            </button>
            <button className="flex items-center gap-2 bg-[var(--color-accent)] text-white px-8 py-3.5 rounded-2xl font-semibold hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-600/30 w-full sm:w-auto justify-center">
              <Upload className="w-4 h-4" />
              Upload CSV
            </button>
          </div>
        </div>

        {/* Dashboard Preview Card */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 relative z-10">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-[var(--color-border)] p-6 md:p-10 overflow-hidden">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-bg)] flex items-center justify-center">
                  <Activity className="w-6 h-6 text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Analysis Pipeline</h3>
                  <p className="text-sm text-[var(--color-muted)]">Live monitoring of FDR-controlled execution</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[var(--color-bg)] px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-accent)] border border-[var(--color-border)]">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Pipeline Active
              </div>
            </div>

            {/* Mock Pipeline */}
            <div className="flex flex-wrap items-center justify-center gap-3 py-16 bg-gray-50/50 rounded-2xl border border-gray-100">
              {[
                { id: 'A0', label: 'Janitor', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                { id: 'A1', label: 'Feature Eng', color: 'bg-purple-100 text-purple-700 border-purple-200' },
                { id: 'A2', label: 'Hypothesis Gen', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                { id: 'A3', label: 'Statistical Test', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                { id: 'A4', label: 'FDR Control', color: 'bg-[var(--color-accent-light)] text-[var(--color-accent)] border-[var(--color-accent-light)]' }
              ].map((node, index, arr) => (
                <React.Fragment key={node.id}>
                  <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border bg-white shadow-sm w-36 transition-transform hover:-translate-y-1`}>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg mb-2 ${node.color}`}>{node.id}</span>
                    <span className="font-semibold text-sm text-center">{node.label}</span>
                  </div>
                  {index < arr.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-gray-300 mx-2" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-white py-32 border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">
              The Multiple Comparisons Problem. <span className="text-[var(--color-accent)]">Solved.</span>
            </h2>
            <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
              Ledger eliminates p-hacking and false discoveries by automatically managing your hypothesis tests with rigorous statistical control.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Hypothesis Pre-registration',
                desc: 'Agents explicitly state their hypotheses before seeing the test data, completely preventing data dredging.',
                icon: <Search className="w-6 h-6 text-purple-600" />,
                bg: 'bg-purple-50',
                border: 'border-purple-100'
              },
              {
                title: 'BH-FDR Correction',
                desc: 'Automatic Benjamini-Hochberg procedure applied globally across all agent interactions to bound false discoveries.',
                icon: <Activity className="w-6 h-6 text-emerald-600" />,
                bg: 'bg-emerald-50',
                border: 'border-emerald-100'
              },
              {
                title: 'Claim-Level Provenance',
                desc: 'Every resulting claim maps directly to the exact statistical test, p-value, and agent prompt that generated it.',
                icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
                bg: 'bg-blue-50',
                border: 'border-blue-100'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-[var(--color-border)] shadow-xl shadow-[var(--color-border)]/20 hover:shadow-2xl hover:shadow-[var(--color-accent-light)]/40 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.border} border flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[var(--color-muted)] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
