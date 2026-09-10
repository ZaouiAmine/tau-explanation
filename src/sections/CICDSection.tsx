interface Props {
  MermaidDiagram: React.FC<{ chart: string; id: string }>;
}

export function CICDSection({ MermaidDiagram }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4">6. CI/CD Pipeline — Patrick & Monkey</h2>
      <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-8" />

      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        Tau's CI/CD system is Git-native. When you push to a repository, a webhook triggers Patrick,
        which creates a build job. Monkey instances compete to lock and execute the job. The result
        is published to TNS and assets are marked for replication.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">Full CI/CD Flow</h3>

      <MermaidDiagram
        id="cicd-flow"
        chart={`
sequenceDiagram
    participant Dev as Developer
    participant Git as Git Provider (GitHub)
    participant Pat as Patrick
    participant Mon as Monkey (multiple)
    participant Container as Build Container
    participant TNS as TNS
    participant Hoarder as Hoarder
    participant Sub as Substrate

    Dev->>Git: git push
    Git->>Pat: Webhook (push event)
    Pat->>Pat: Validate webhook signature
    Pat->>Pat: Create job (CID, branch, repo)
    Pat->>Pat: Publish job to CRDT queue

    Mon->>Pat: Listen for jobs
    Mon->>Pat: Race-to-lock (first wins)
    Pat-->>Mon: Job locked ✓

    Mon->>Container: Clone repository
    Mon->>Container: Run build.sh / Dockerfile
    Container->>Container: Compile functions → WASM
    Container->>Container: Run tests
    Container-->>Mon: Build artifacts

    Mon->>TNS: Publish configuration
    Mon->>Hoarder: Mark assets for replication
    Mon->>Pat: Report status (success/logs)

    Hoarder->>Hoarder: Replicate to N nodes
    Sub->>TNS: Detect config change
    Sub->>Sub: Load new WASM modules
    Sub->>Sub: Hot-swap functions (zero downtime)
        `}
      />

      <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Patrick: The Orchestrator</h3>
      <p className="text-slate-700 mb-4">
        Patrick lives in <code className="bg-slate-200 px-1.5 py-0.5 rounded text-sm">services/patrick/</code>.
        Its responsibilities:
      </p>
      <ul className="list-disc list-inside space-y-2 text-slate-700 mb-6">
        <li><strong>Webhook Processing:</strong> Receives HTTPS webhooks from Git providers, validates signatures using Auth-stored secrets</li>
        <li><strong>Job Creation:</strong> Creates a job record with: repository ID, branch/commit, project ID, triggered resources</li>
        <li><strong>CRDT Queue:</strong> Jobs are stored in a CRDT so multiple Patrick replicas share the same queue</li>
        <li><strong>Job Lifecycle:</strong> Tracks jobs through states: pending → locked → running → success/failed</li>
        <li><strong>Log Collection:</strong> Receives build logs from Monkey and stores them</li>
      </ul>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">Monkey: The Executor</h3>
      <p className="text-slate-700 mb-4">
        Monkey lives in <code className="bg-slate-200 px-1.5 py-0.5 rounded text-sm">services/monkey/</code>.
        It is the worker that actually performs builds.
      </p>

      <MermaidDiagram
        id="monkey-build"
        chart={`
graph TB
    subgraph "Monkey Build Process"
        LOCK["1. Lock Job<br/>(race-to-lock via CRDT)"]
        CLONE["2. Clone Repository<br/>(using Auth deployment key)"]
        DETECT["3. Detect Build Type<br/>(build.sh? Dockerfile? tau.yaml?)"]
        
        subgraph "Build Execution"
            direction TB
            BUILD_SH["build.sh path:<br/>Run in container"]
            DOCKER["Dockerfile path:<br/>Build image, extract artifacts"]
            TAU_CONFIG["tau.yaml path:<br/>Compile functions via TinyGo"]
        end

        COMPILE["4. Compile to WASM<br/>(TinyGo for Go functions)"]
        BUNDLE["5. Bundle artifacts<br/>(tarball/zip)"]
        PUBLISH["6. Publish to TNS<br/>(config + WASM CIDs)"]
        MARK["7. Mark for Hoarder<br/>(replication trigger)"]
        REPORT["8. Report to Patrick<br/>(status + logs)"]
    end

    LOCK --> CLONE --> DETECT
    DETECT --> BUILD_SH
    DETECT --> DOCKER
    DETECT --> TAU_CONFIG
    BUILD_SH --> COMPILE
    DOCKER --> COMPILE
    TAU_CONFIG --> COMPILE
    COMPILE --> BUNDLE --> PUBLISH --> MARK --> REPORT
        `}
      />

      <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Container Backends</h3>
      <p className="text-slate-700 mb-4">
        Monkey supports two container backends for build execution:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">Docker Backend</h4>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Uses Docker daemon API</li>
            <li>• Build containers on <code className="text-xs bg-slate-200 px-1 rounded">taubyte_netguard</code> network</li>
            <li>• nftables rules on docker0 bridge</li>
            <li>• Log streaming via stdcopy</li>
            <li>• Volume mounting for artifacts</li>
          </ul>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">Containerd Backend</h4>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Direct containerd API (no Docker daemon)</li>
            <li>• Supports rootless mode</li>
            <li>• Cgroup-based egress filtering</li>
            <li>• Configurable sandboxed runtime</li>
            <li>• Process caps (4096 default)</li>
          </ul>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h4 className="font-semibold text-amber-900 mb-2">🔑 Race-to-Lock Mechanism</h4>
        <p className="text-sm text-amber-800">
          Multiple Monkey instances listen for jobs simultaneously. When a job appears, they all attempt
          to "lock" it via the CRDT. Only one succeeds (first-write-wins on the lock field). This provides
          natural load distribution — the fastest/least-loaded Monkey gets the job. Failed builds can be
          retried by other Monkeys if the lock times out.
        </p>
      </div>
    </div>
  );
}
