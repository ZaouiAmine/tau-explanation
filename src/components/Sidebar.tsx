interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const sections = [
  { id: 'overview', label: '1. Overview', icon: '🔭' },
  { id: 'architecture', label: '2. Architecture', icon: '🏗️' },
  { id: 'services', label: '3. Services Deep Dive', icon: '⚙️' },
  { id: 'p2p', label: '4. P2P Network Layer', icon: '🌐' },
  { id: 'substrate', label: '5. Substrate & WASM', icon: '🧬' },
  { id: 'cicd', label: '6. CI/CD Pipeline', icon: '🔄' },
  { id: 'data-layer', label: '7. Data & Storage', icon: '💾' },
  { id: 'security', label: '8. Security Model', icon: '🔒' },
  { id: 'dream', label: '9. Dream (Dev Env)', icon: '💭' },
  { id: 'codebase', label: '10. Codebase Map', icon: '🗺️' },
  { id: 'developing', label: '11. Contributing', icon: '🛠️' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-slate-50 border-r border-slate-200 z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">τ</span>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Tau Guide</h2>
              <p className="text-xs text-slate-500">Architecture Deep Dive</p>
            </div>
          </div>

          <nav>
            <ul className="space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <span className="text-base">{section.icon}</span>
                    <span>{section.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-800 font-medium">Based on</p>
            <p className="text-xs text-blue-600 mt-1">github.com/taubyte/tau</p>
            <p className="text-xs text-slate-500 mt-2">Complete analysis of every directory, service, and package in the repository.</p>
          </div>
        </div>
      </aside>
    </>
  );
}
