import { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Sidebar } from './components/Sidebar';
import { HeroSection } from './sections/HeroSection';
import { OverviewSection } from './sections/OverviewSection';
import { ArchitectureSection } from './sections/ArchitectureSection';
import { ServicesSection } from './sections/ServicesSection';
import { P2PSection } from './sections/P2PSection';
import { SubstrateSection } from './sections/SubstrateSection';
import { CICDSection } from './sections/CICDSection';
import { DataLayerSection } from './sections/DataLayerSection';
import { SecuritySection } from './sections/SecuritySection';
import { DreamSection } from './sections/DreamSection';
import { CodebaseSection } from './sections/CodebaseSection';
import { DevelopingSection } from './sections/DevelopingSection';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  themeVariables: {
    primaryColor: '#f0f9ff',
    primaryTextColor: '#1e293b',
    primaryBorderColor: '#3b82f6',
    lineColor: '#64748b',
    secondaryColor: '#f1f5f9',
    tertiaryColor: '#e0f2fe',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '14px',
  },
  flowchart: {
    curve: 'basis',
    padding: 20,
  },
});

function MermaidDiagram({ chart, id }: { chart: string; id: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (ref.current) {
        try {
          const { svg } = await mermaid.render(id, chart);
          ref.current.innerHTML = svg;
        } catch (e) {
          console.error('Mermaid render error:', e);
          ref.current.innerHTML = `<pre style="color: red;">Error rendering diagram: ${String(e)}</pre>`;
        }
      }
    };
    renderDiagram();
  }, [chart, id]);

  return <div ref={ref} className="mermaid-container my-6" />;
}

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 mb-16">
      {children}
    </section>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-lg rounded-lg p-2 border border-slate-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:ml-72">
          <div className="max-w-4xl mx-auto px-6 py-12 lg:px-12">
            <HeroSection />

            <Section id="overview">
              <OverviewSection MermaidDiagram={MermaidDiagram} />
            </Section>

            <Section id="architecture">
              <ArchitectureSection MermaidDiagram={MermaidDiagram} />
            </Section>

            <Section id="services">
              <ServicesSection MermaidDiagram={MermaidDiagram} />
            </Section>

            <Section id="p2p">
              <P2PSection MermaidDiagram={MermaidDiagram} />
            </Section>

            <Section id="substrate">
              <SubstrateSection MermaidDiagram={MermaidDiagram} />
            </Section>

            <Section id="cicd">
              <CICDSection MermaidDiagram={MermaidDiagram} />
            </Section>

            <Section id="data-layer">
              <DataLayerSection MermaidDiagram={MermaidDiagram} />
            </Section>

            <Section id="security">
              <SecuritySection MermaidDiagram={MermaidDiagram} />
            </Section>

            <Section id="dream">
              <DreamSection MermaidDiagram={MermaidDiagram} />
            </Section>

            <Section id="codebase">
              <CodebaseSection />
            </Section>

            <Section id="developing">
              <DevelopingSection MermaidDiagram={MermaidDiagram} />
            </Section>

            <footer className="border-t border-slate-200 pt-8 mt-16 text-center text-sm text-slate-500">
              <p>Comprehensive Tau Architecture Guide — Based on thorough analysis of the taubyte/tau repository</p>
              <p className="mt-2">
                <a href="https://github.com/taubyte/tau" className="text-blue-600 hover:underline">github.com/taubyte/tau</a>
                {' • '}
                <a href="https://tau.how" className="text-blue-600 hover:underline">tau.how</a>
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
