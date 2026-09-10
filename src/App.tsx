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
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(3, scale * delta));
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const zoomIn = () => {
    setScale(Math.min(3, scale * 1.2));
  };

  const zoomOut = () => {
    setScale(Math.max(0.5, scale * 0.8));
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="my-6">
      <div
        ref={containerRef}
        className="mermaid-container relative overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          ref={ref}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease',
          }}
        />
        
        {/* Zoom Controls */}
        <div className="absolute top-3 right-3 flex gap-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 p-1">
          <button
            onClick={zoomIn}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 transition-colors text-slate-700"
            title="Zoom In"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button
            onClick={zoomOut}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 transition-colors text-slate-700"
            title="Zoom Out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </button>
          <button
            onClick={resetZoom}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 transition-colors text-slate-700"
            title="Reset Zoom"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Zoom Level Indicator */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 px-3 py-1 text-xs text-slate-600 font-medium">
          {Math.round(scale * 100)}%
        </div>
      </div>
      
      {/* Help Text */}
      <p className="text-xs text-slate-500 text-center mt-2">
        Scroll to zoom • Drag to pan • Use controls to adjust
      </p>
    </div>
  );
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
