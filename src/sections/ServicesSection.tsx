interface Props {
  MermaidDiagram: React.FC<{ chart: string; id: string }>;
}

export function ServicesSection({ MermaidDiagram }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4">3. Services Deep Dive</h2>
      <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-8" />

      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        Services are the heart of Tau. Each service runs as a module within a node and communicates
        with other services via P2P streams. The community build ships 7 services; enterprise builds
        can add more via build tags.
      </p>

      <MermaidDiagram
        id="services-overview"
        chart={`
graph LR
    subgraph "Request Handling"
        GW["🚪 Gateway<br/>L7 Load Balancer"]
        SUB["🧬 Substrate<br/>Function Runtime"]
        SEER["👁️ Seer<br/>DNS & Discovery"]
    end

    subgraph "CI/CD Pipeline"
        PAT["📋 Patrick<br/>Job Orchestrator"]
        MON["🐒 Monkey<br/>Build Executor"]
    end

    subgraph "Infrastructure"
        AUTH["🔐 Auth<br/>Identity & Secrets"]
        TNS["📚 TNS<br/>Config Registry"]
        HOAR["📦 Hoarder<br/>Replication"]
    end

    GW -->|"route to"| SUB
    SEER -->|"DNS + topology"| GW
    PAT -->|"dispatch job"| MON
    MON -->|"publish config"| TNS
    MON -->|"mark assets"| HOAR
    AUTH -->|"verify identity"| GW
    TNS -->|"serve config"| SUB
    HOAR -->|"replicate data"| TNS
        `}
      />

      {/* Auth Service */}
      <div className="mt-10 mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-sm">🔐</span>
          Auth Service
        </h3>
        <p className="text-slate-700 mb-4">
          Auth is the security backbone of Tau. It manages authentication, authorization, and secrets
          across the entire platform. It integrates with Git providers (GitHub) to map repository
          access to projects and securely stores credentials that other services consume.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-sm">
            <strong>Responsibilities:</strong>
            <ul className="mt-1 space-y-1 text-slate-700">
              <li>• Deployment keys management</li>
              <li>• Webhook secrets storage</li>
              <li>• X509 certificate handling</li>
              <li>• ACME challenges (Let's Encrypt)</li>
              <li>• Repository → Project access mapping</li>
            </ul>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-sm">
            <strong>Implementation:</strong>
            <ul className="mt-1 space-y-1 text-slate-700">
              <li>• CRDT-based replication</li>
              <li>• Identity seam (build-tagged)</li>
              <li>• P2P + HTTP client interfaces</li>
              <li>• <code className="text-xs bg-red-100 px-1 rounded">services/auth/</code></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Seer Service */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm">👁️</span>
          Seer Service
        </h3>
        <p className="text-slate-700 mb-4">
          Seer is the network's directory service. It maintains a comprehensive record of all nodes,
          their services, usage metrics, and metadata. It provides DNS resolution externally and
          shares topology information internally with Gateway and other services.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm">
            <strong>Responsibilities:</strong>
            <ul className="mt-1 space-y-1 text-slate-700">
              <li>• Node discovery & registration</li>
              <li>• DNS service (authoritative)</li>
              <li>• Load balancing information</li>
              <li>• Network topology management</li>
              <li>• Service availability tracking</li>
              <li>• Auto-cert (Let's Encrypt)</li>
            </ul>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm">
            <strong>Implementation:</strong>
            <ul className="mt-1 space-y-1 text-slate-700">
              <li>• Pub-sub for node updates</li>
              <li>• CRDT for consistency</li>
              <li>• Beacon system for heartbeats</li>
              <li>• Host binding for custom domains</li>
              <li>• <code className="text-xs bg-blue-100 px-1 rounded">services/seer/</code></li>
            </ul>
          </div>
        </div>
      </div>

      {/* TNS Service */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-sm">📚</span>
          TNS (Taubyte Name Service)
        </h3>
        <p className="text-slate-700 mb-4">
          TNS is the distributed configuration registry. It tracks all projects hosted on the platform,
          maps Git branches and commits to configurations, and serves as the source of truth for what
          each function/website/database should look like at any given version.
        </p>
        <div className="p-3 bg-green-50 rounded-lg border border-green-100 text-sm mb-4">
          <strong>Key Mechanism:</strong> TNS stores configurations as content-addressed data. When Monkey
          builds a project, it publishes the resulting configuration to TNS. Substrate then queries TNS
          to know what WASM modules to load and how to route requests. This creates a clean separation
          between build-time and run-time.
        </div>
      </div>

      {/* Gateway Service */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-sm">🚪</span>
          Gateway Service
        </h3>
        <p className="text-slate-700 mb-4">
          Gateway is the L7 load balancer and entry point for all external traffic. It terminates TLS,
          identifies healthy Substrate nodes via Seer, and routes requests using a scoring system that
          considers cache status, resource availability, and latency.
        </p>
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 text-sm mb-4">
          <strong>Scoring Algorithm:</strong> Gateway maintains multiplexed P2P connections to Substrate nodes.
          When a request arrives, it scores each connected node based on: (1) whether the node has the
          requested WASM module cached, (2) current load/capacity, (3) network latency. The highest-scoring
          node receives the request via a P2P HTTP tunnel.
        </div>
      </div>

      {/* Patrick Service */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center text-sm">📋</span>
          Patrick Service
        </h3>
        <p className="text-slate-700 mb-4">
          Patrick is the CI/CD orchestrator. It listens for Git webhook events (push, PR, etc.),
          validates them, creates build jobs with appropriate metadata, and manages the job lifecycle.
          It uses CRDT for replication so multiple Patrick instances can share the job queue.
        </p>
      </div>

      {/* Monkey Service */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-sm">🐒</span>
          Monkey Service
        </h3>
        <p className="text-slate-700 mb-4">
          Monkey is the build executor. Multiple Monkey instances compete for jobs using a race-to-lock
          mechanism. Once a Monkey locks a job, it: (1) clones the repository, (2) runs the build in a
          containerized environment (Docker or containerd), (3) compiles functions to WASM, (4) publishes
          configuration to TNS, (5) marks assets for replication by Hoarder, and (6) reports status to Patrick.
        </p>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800">
          <strong>Security:</strong> Build containers run with restricted egress (NetGuard). They cannot
          reach node-local services or cloud metadata endpoints (169.254.169.254). On Linux, this is
          enforced via nftables + cgroups. CAP_NET_RAW is dropped for restricted containers.
        </div>
      </div>

      {/* Hoarder Service */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-sm">📦</span>
          Hoarder Service
        </h3>
        <p className="text-slate-700 mb-4">
          Hoarder manages data replication across the network. It implements a "rarity-based" strategy:
          Hoarder instances communicate asset/resource IDs and assign rarity scores. Rare items (few copies)
          trigger competition among Hoarder instances to store them, ensuring high availability of critical content.
        </p>
        <div className="p-3 bg-teal-50 rounded-lg border border-teal-100 text-sm">
          <strong>CRDT Stash Registry:</strong> Hoarder uses a CRDT-based "stash" registry where each node
          claims assets it stores. The <code className="text-xs bg-teal-100 px-1 rounded">Rare()</code> and
          <code className="text-xs bg-teal-100 px-1 rounded">List()</code> operations are eventually consistent —
          nodes poll until convergence rather than expecting immediate results.
        </div>
      </div>

      {/* Substrate Service */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-sm">🧬</span>
          Substrate Service
        </h3>
        <p className="text-slate-700 mb-4">
          Substrate is the execution engine — the service that actually runs your functions and serves your content.
          It listens for events from Gateway (HTTP requests, WebSocket connections) and from internal sources
          (PubSub messages, timer triggers), then executes the corresponding WASM module or serves static content.
        </p>
        <p className="text-slate-700">
          See <a href="#substrate" className="text-blue-600 hover:underline">Section 5</a> for the detailed
          Substrate & WASM execution pipeline.
        </p>
      </div>
    </div>
  );
}
