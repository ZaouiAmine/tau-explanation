import React from 'react';

// ============================================================
// COURSE UI COMPONENTS
// Reusable building blocks for the guided course
// ============================================================

/** Module header with number, title, and estimated time */
export function ModuleHeader({ number, title, subtitle, readTime }: {
  number: number;
  title: string;
  subtitle: string;
  readTime: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold text-sm">
          {number}
        </span>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Module {number} • {readTime} read
        </span>
      </div>
      <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-lg text-slate-600">{subtitle}</p>
      <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-4" />
    </div>
  );
}

/** "What you'll learn" box at the start of a module */
export function LearningGoals({ goals }: { goals: string[] }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
      <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
        <span>🎯</span> What you'll learn in this module
      </h4>
      <ul className="space-y-2">
        {goals.map((goal, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-blue-900">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{goal}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Prerequisite knowledge callout */
export function Prerequisites({ items }: { items: string[] }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
      <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
        <span>📚</span> Before we begin — you should know
      </h4>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-amber-900 flex items-start gap-2">
            <span className="text-amber-600">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Key concept definition box */
export function KeyConcept({ term, definition, children }: {
  term: string;
  definition: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 border-l-4 border-slate-400 rounded-r-xl p-4 my-5">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Concept</span>
      </div>
      <h5 className="font-bold text-slate-900 text-lg mb-1">{term}</h5>
      <p className="text-sm text-slate-700">{definition}</p>
      {children}
    </div>
  );
}

/** Analogy box — helps explain complex ideas */
export function Analogy({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 my-5">
      <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
        <span>💡</span> Analogy: {title}
      </h4>
      <div className="text-sm text-purple-900">{children}</div>
    </div>
  );
}

/** "How Tau uses this" connection box */
export function TauConnection({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-5 my-6">
      <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
        <span>🔥</span> How Tau uses this
      </h4>
      <div className="text-sm text-orange-900">{children}</div>
    </div>
  );
}

/** "Check your understanding" summary */
export function CheckUnderstanding({ points }: { points: string[] }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-5 my-8">
      <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
        <span>✅</span> Check your understanding
      </h4>
      <p className="text-sm text-green-800 mb-3">
        If you can answer these, you're ready for the next module:
      </p>
      <ul className="space-y-2">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-green-900">
            <span className="text-green-600 font-bold">?</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Warning / important note */
export function Important({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 my-5">
      <h4 className="font-semibold text-red-900 mb-1 flex items-center gap-2 text-sm">
        <span>⚠️</span> Important
      </h4>
      <div className="text-sm text-red-900">{children}</div>
    </div>
  );
}

/** Code block with language label */
export function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="my-4">
      <div className="bg-slate-800 rounded-t-lg px-4 py-1.5 text-xs text-slate-400 font-mono border-b border-slate-700">
        {language}
      </div>
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-b-lg text-sm overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/** Comparison table */
export function ComparisonTable({ title, headers, rows }: {
  title?: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="my-6">
      {title && <h4 className="font-semibold text-slate-900 mb-3">{title}</h4>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-50">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="text-left p-3 font-semibold text-slate-900 border-b border-slate-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="p-3 text-slate-700">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Module navigation (prev/next) */
export function ModuleNav({ prev, next, onNavigate }: {
  prev: { num: number; title: string } | null;
  next: { num: number; title: string } | null;
  onNavigate: (num: number) => void;
}) {
  return (
    <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-200">
      {prev ? (
        <button
          onClick={() => onNavigate(prev.num)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm text-slate-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <div className="text-left">
            <div className="text-xs text-slate-500">Previous</div>
            <div className="font-medium">{prev.title}</div>
          </div>
        </button>
      ) : <div />}
      {next ? (
        <button
          onClick={() => onNavigate(next.num)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 transition-colors text-sm"
        >
          <div className="text-right">
            <div className="text-xs text-orange-100">Next</div>
            <div className="font-medium">{next.title}</div>
          </div>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ) : <div />}
    </div>
  );
}

/** Paragraph helper */
export function P({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-slate-700 leading-relaxed mb-4 ${className}`}>{children}</p>;
}

/** Section heading (h3) */
export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xl font-semibold text-slate-900 mt-10 mb-4">{children}</h3>;
}

/** Inline code */
export function Code({ children }: { children: React.ReactNode }) {
  return <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800">{children}</code>;
}
