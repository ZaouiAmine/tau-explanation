import { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Module1, Module2, Module3, Module4 } from './modules/part1';
import { Module5, Module6, Module7, Module8, Module9 } from './modules/part2';
import { Module10, Module11, Module12, Module13, Module14, Module15 } from './modules/part3';

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
  flowchart: { curve: 'basis', padding: 20 },
});

// ============================================================
// MERMAID DIAGRAM WITH ZOOM
// ============================================================
function MermaidDiagram({ chart, id }: { chart: string; id: string }) {
  const ref = useRef<HTMLDivElement>(null);
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
          ref.current.innerHTML = `<pre style="color: red; font-size: 12px;">Error: ${String(e)}</pre>`;
        }
      }
    };
    renderDiagram();
  }, [chart, id]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(Math.max(0.5, Math.min(3, scale * delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  return (
    <div className="my-6">
      <div
        className="mermaid-container relative overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
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
        <div className="absolute top-3 right-3 flex gap-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 p-1">
          <button onClick={() => setScale(Math.min(3, scale * 1.2))} className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-700" title="Zoom In">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </button>
          <button onClick={() => setScale(Math.max(0.5, scale * 0.8))} className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-700" title="Zoom Out">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>
          </button>
          <button onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }} className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-700" title="Reset">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 px-3 py-1 text-xs text-slate-600 font-medium">
          {Math.round(scale * 100)}%
        </div>
      </div>
      <p className="text-xs text-slate-500 text-center mt-2">Scroll to zoom • Drag to pan • Use controls to adjust</p>
    </div>
  );
}

// ============================================================
// MODULE DEFINITIONS
// ============================================================
const MODULES = [
  { num: 1, title: 'The Problem Tau Solves', part: 'Foundations', icon: '🎯' },
  { num: 2, title: 'Peer-to-Peer Networks', part: 'Foundations', icon: '🌐' },
  { num: 3, title: 'libp2p — The Networking Stack', part: 'Foundations', icon: '🔌' },
  { num: 4, title: 'Distributed Hash Tables', part: 'Foundations', icon: '🗂️' },
  { num: 5, title: 'Content-Addressed Storage', part: 'Data & Consensus', icon: '📦' },
  { num: 6, title: 'CRDTs — Eventual Consistency', part: 'Data & Consensus', icon: '🔄' },
  { num: 7, title: 'WebAssembly — Sandboxed Execution', part: 'Execution', icon: '🧬' },
  { num: 8, title: 'Containerization & Isolation', part: 'Execution', icon: '🐳' },
  { num: 9, title: 'GitOps — Git-Native Infrastructure', part: 'Execution', icon: '📝' },
  { num: 10, title: 'Now Meet Tau — The Big Picture', part: 'Tau Deep Dive', icon: '🔥' },
  { num: 11, title: 'Services Deep Dive', part: 'Tau Deep Dive', icon: '⚙️' },
  { num: 12, title: 'Security Model', part: 'Tau Deep Dive', icon: '🔒' },
  { num: 13, title: 'Dream — Local Development', part: 'Tau Deep Dive', icon: '💭' },
  { num: 14, title: 'Building on Tau', part: 'Practical', icon: '🛠️' },
  { num: 15, title: 'Codebase Map & Next Steps', part: 'Practical', icon: '🗺️' },
];

// ============================================================
// SIDEBAR
// ============================================================
function CourseSidebar({ currentModule, onNavigate, isOpen, onClose }: {
  currentModule: number;
  onNavigate: (num: number) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const parts = ['Foundations', 'Data & Consensus', 'Execution', 'Tau Deep Dive', 'Practical'];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-slate-50 border-r border-slate-200 z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 overflow-y-auto`}>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">τ</span>
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Understanding Tau</h2>
              <p className="text-xs text-slate-500">A Guided Course</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span>{currentModule}/15</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentModule / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* Module list by part */}
          {parts.map((part) => {
            const partModules = MODULES.filter(m => m.part === part);
            return (
              <div key={part} className="mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">{part}</h3>
                <ul className="space-y-0.5">
                  {partModules.map((m) => (
                    <li key={m.num}>
                      <button
                        onClick={() => { onNavigate(m.num); onClose(); }}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors text-left ${
                          currentModule === m.num
                            ? 'bg-blue-100 text-blue-800 font-medium'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-xs w-5 text-center flex-shrink-0">
                          {currentModule > m.num ? '✓' : m.icon}
                        </span>
                        <span className="truncate">{m.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}

// ============================================================
// WELCOME SCREEN
// ============================================================
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-6">
          <span className="text-white font-bold text-2xl">τ</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
          Understanding <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Tau</span>
        </h1>
        <p className="text-xl text-slate-600">A Progressive Course on Distributed Cloud Computing</p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
        <h3 className="font-semibold text-slate-900 mb-3">📖 How this course works</h3>
        <p className="text-slate-700 mb-4">
          This isn't just documentation — it's a <strong>guided learning path</strong>. Each module teaches you the
          foundational concepts you need <em>before</em> tackling Tau-specific topics. By the end, you'll understand
          not just <em>what</em> Tau does, but <em>why</em> it does it and <em>how</em> the underlying technologies work.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <strong className="text-blue-900">Part 1: Foundations</strong>
            <p className="text-blue-700 mt-1">P2P, libp2p, DHTs — the networking layer</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <strong className="text-green-900">Part 2: Data & Execution</strong>
            <p className="text-green-700 mt-1">CRDTs, WASM, containers, GitOps</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
            <strong className="text-orange-900">Part 3: Tau Deep Dive</strong>
            <p className="text-orange-700 mt-1">Services, security, building, contributing</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <h4 className="font-semibold text-amber-900 mb-2">🎓 Prerequisites</h4>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• Basic programming knowledge (any language)</li>
          <li>• Understanding of how the internet works (HTTP, IP addresses)</li>
          <li>• Familiarity with Git (commits, branches, push)</li>
          <li>• Curiosity about distributed systems!</li>
        </ul>
      </div>

      <div className="text-center">
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all shadow-lg shadow-orange-200 text-lg"
        >
          Start the Course
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        <p className="text-sm text-slate-500 mt-3">15 modules • ~2 hours total • Interactive diagrams</p>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [currentModule, setCurrentModule] = useState(0); // 0 = welcome
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const navigateTo = (num: number) => {
    setCurrentModule(num);
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const moduleProps = { MermaidDiagram, onNavigate: navigateTo };

  const renderModule = () => {
    switch (currentModule) {
      case 0: return <WelcomeScreen onStart={() => navigateTo(1)} />;
      case 1: return <Module1 {...moduleProps} />;
      case 2: return <Module2 {...moduleProps} />;
      case 3: return <Module3 {...moduleProps} />;
      case 4: return <Module4 {...moduleProps} />;
      case 5: return <Module5 {...moduleProps} />;
      case 6: return <Module6 {...moduleProps} />;
      case 7: return <Module7 {...moduleProps} />;
      case 8: return <Module8 {...moduleProps} />;
      case 9: return <Module9 {...moduleProps} />;
      case 10: return <Module10 {...moduleProps} />;
      case 11: return <Module11 {...moduleProps} />;
      case 12: return <Module12 {...moduleProps} />;
      case 13: return <Module13 {...moduleProps} />;
      case 14: return <Module14 {...moduleProps} />;
      case 15: return <Module15 {...moduleProps} />;
      default: return <WelcomeScreen onStart={() => navigateTo(1)} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-lg rounded-lg p-2 border border-slate-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex">
        <CourseSidebar
          currentModule={currentModule}
          onNavigate={navigateTo}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main ref={contentRef} className="flex-1 lg:ml-72 min-h-screen">
          <div className="max-w-4xl mx-auto px-6 py-12 lg:px-12">
            {renderModule()}
          </div>
        </main>
      </div>
    </div>
  );
}
