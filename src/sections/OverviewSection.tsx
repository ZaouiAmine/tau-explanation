interface Props {
  MermaidDiagram: React.FC<{ chart: string; id: string }>;
}

export function OverviewSection({ MermaidDiagram }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4">1. Overview — What is Tau?</h2>
      <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-8" />

      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        <strong>Tau</strong> is an open-source, distributed Platform-as-a-Service (PaaS) built entirely in Go.
        It provides a self-hosted alternative to Vercel, Netlify, and Cloudflare — but with a fundamentally
        different architecture: <em>there is no central server</em>. Every node in the network is a peer,
        and the entire cloud is a single binary you can deploy anywhere.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <h4 className="font-semibold text-amber-900 mb-2">💡 Core Philosophy</h4>
        <p className="text-sm text-amber-800">
          <strong>"Local Development = Global Production"</strong> — The same binary, the same runtime,
          the same services run on your laptop (via Dream) and in a 100-node production cluster.
          No Kubernetes, no Docker Swarm, no external orchestration. Just peers talking to peers.
        </p>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">High-Level System View</h3>

      <MermaidDiagram
        id="overview-diagram"
        chart={`
graph TB
    subgraph "User Layer"
        DEV["Developer<br/>(Git Push)"]
        USER["End User<br/>(HTTP Request)"]
    end

    subgraph "Tau Cloud (P2P Network)"
        GW["Gateway<br/>L7 Load Balancer"]
        SEER["Seer<br/>DNS & Discovery"]
        AUTH["Auth<br/>Identity & Secrets"]
        TNS["TNS<br/>Config Registry"]
        
        subgraph "CI/CD Pipeline"
            PAT["Patrick<br/>Job Orchestrator"]
            MON["Monkey<br/>Build Executor"]
        end

        subgraph "Runtime Layer"
            SUB["Substrate<br/>WASM Runtime"]
        end

        subgraph "Data Layer"
            HOAR["Hoarder<br/>Replication"]
            KV["KV Database"]
            OBJ["Object Storage"]
            MSG["Pub/Sub Messaging"]
        end
    end

    DEV -->|"git push"| PAT
    PAT -->|"create job"| MON
    MON -->|"build & publish"| TNS
    MON -->|"mark assets"| HOAR
    HOAR -->|"replicate"| KV
    HOAR -->|"replicate"| OBJ

    USER -->|"HTTPS"| GW
    GW -->|"route to"| SUB
    SUB -->|"serve"| USER
    SEER -->|"DNS"| GW
    AUTH -->|"verify"| GW
    TNS -->|"config"| SUB
        `}
      />

      <h3 className="text-xl font-semibold text-slate-900 mt-10 mb-4">Key Design Decisions</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">🔗 Peer-to-Peer (libp2p)</h4>
          <p className="text-sm text-slate-600">
            Built on libp2p, nodes discover each other via DHT, communicate over encrypted multiplexed streams,
            and relay through public nodes when behind NATs. No central coordinator exists.
          </p>
        </div>
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">🧬 WebAssembly (wazero)</h4>
          <p className="text-sm text-slate-600">
            User functions compile to WASM and execute in wazero — a zero-dependency Go WASM runtime.
            This provides true sandboxing, portability, and near-native performance.
          </p>
        </div>
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">📊 CRDTs for Consensus</h4>
          <p className="text-sm text-slate-600">
            Services like Auth, Seer, Patrick, TNS, and Hoarder use CRDTs (Conflict-free Replicated Data Types)
            for eventual consistency without coordination — enabling high availability and partition tolerance.
          </p>
        </div>
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">📦 Single Binary</h4>
          <p className="text-sm text-slate-600">
            The entire platform compiles to a single binary. You choose which services a node runs via "shapes" —
            configuration that determines the node's role in the cluster.
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">What Tau Provides</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 font-semibold text-slate-900 border-b border-slate-200">Capability</th>
              <th className="text-left p-3 font-semibold text-slate-900 border-b border-slate-200">Description</th>
              <th className="text-left p-3 font-semibold text-slate-900 border-b border-slate-200">Analog</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Serverless Functions</td>
              <td className="p-3 text-slate-600">WASM functions triggered by HTTP, WebSocket, PubSub, timers</td>
              <td className="p-3 text-slate-500">AWS Lambda</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Website Hosting</td>
              <td className="p-3 text-slate-600">Static sites with global distribution via content-addressed storage</td>
              <td className="p-3 text-slate-500">Vercel / Netlify</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">KV Databases</td>
              <td className="p-3 text-slate-600">Distributed key-value stores with automatic replication</td>
              <td className="p-3 text-slate-500">DynamoDB</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Object Storage</td>
              <td className="p-3 text-slate-600">Content-addressed file storage with deduplication</td>
              <td className="p-3 text-slate-500">S3</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Messaging</td>
              <td className="p-3 text-slate-600">Pub/Sub channels with WebSocket support</td>
              <td className="p-3 text-slate-500">PubNub</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">CI/CD</td>
              <td className="p-3 text-slate-600">Git-native build pipeline with containerized builds</td>
              <td className="p-3 text-slate-500">GitHub Actions</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
