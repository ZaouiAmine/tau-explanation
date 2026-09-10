export function HeroSection() {
  return (
    <div className="mb-20">
      <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-xs font-medium px-3 py-1 rounded-full border border-orange-200 mb-6">
        <span>🔥</span> Comprehensive Architecture Guide
      </div>
      <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
        Understanding{' '}
        <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          Tau
        </span>
      </h1>
      <p className="text-xl text-slate-600 leading-relaxed mb-8">
        A complete, deep-dive guide to the open-source distributed cloud computing platform.
        This document covers every layer — from the peer-to-peer network fabric to the WebAssembly
        runtime, from the CI/CD pipeline to the security model — so you can confidently develop on and contribute to Tau.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="text-2xl mb-2">🌐</div>
          <h3 className="font-semibold text-slate-900 text-sm">P2P Native</h3>
          <p className="text-xs text-slate-600 mt-1">No central servers. Every node is equal.</p>
        </div>
        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
          <div className="text-2xl mb-2">🧬</div>
          <h3 className="font-semibold text-slate-900 text-sm">WASM Runtime</h3>
          <p className="text-xs text-slate-600 mt-1">Sandboxed, secure, portable execution.</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
          <div className="text-2xl mb-2">📦</div>
          <h3 className="font-semibold text-slate-900 text-sm">Git-Native</h3>
          <p className="text-xs text-slate-600 mt-1">Infrastructure as code, branch-based envs.</p>
        </div>
      </div>

      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-3">📖 What This Guide Covers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">→</span>
            <span>Full distributed architecture with diagrams</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">→</span>
            <span>Every service explained in depth</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">→</span>
            <span>P2P networking, DHT, and transport layers</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">→</span>
            <span>WebAssembly execution pipeline</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">→</span>
            <span>CI/CD with Patrick & Monkey</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">→</span>
            <span>CRDT-based data replication (Hoarder)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">→</span>
            <span>Security model & NetGuard</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">→</span>
            <span>Dream local development environment</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">→</span>
            <span>Complete codebase directory map</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">→</span>
            <span>How to contribute and extend Tau</span>
          </div>
        </div>
      </div>
    </div>
  );
}
