export function CodebaseSection() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4">10. Codebase Map</h2>
      <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-8" />

      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        Here's a complete map of the Tau repository structure. Every directory, its purpose,
        and what you'll find inside.
      </p>

      <div className="space-y-3">
        {/* Root directories */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2 text-lg">📁 Top-Level Directories</h3>
        </div>

        <CodeEntry
          path="cli/"
          description="CLI entry point and node configuration"
          details="Contains the main binary entry point, node startup logic, and the service registry (cli/node/node.go). The 'available' map defines which services can run in a shape. The Register() function allows enterprise services to extend this."
          color="blue"
        />

        <CodeEntry
          path="core/"
          description="Core interfaces and shared contracts"
          details="Defines the interfaces that all services implement. Contains service contracts (core/services/auth, core/services/substrate, etc.) that specify what each service must provide. Also contains the node abstraction and common types."
          color="blue"
        />

        <CodeEntry
          path="services/"
          description="Service implementations"
          details="Contains the actual implementations of all 7 community services: auth/, gateway/, hoarder/, monkey/, patrick/, seer/, substrate/, tns/. Each has its own P2P protocol handlers, HTTP routes, and business logic. Also contains services/common/ for shared service utilities."
          color="green"
        />

        <CodeEntry
          path="p2p/"
          description="P2P stream abstractions and tunnels"
          details="The networking glue. p2p/streams/ provides the stream manager and protocol handlers. p2p/streams/tunnels/ contains HTTP and WebSocket tunnel implementations that encapsulate application protocols inside P2P streams."
          color="purple"
        />

        <CodeEntry
          path="pkg/"
          description="Shared packages and libraries"
          details="Reusable packages used across services: pkg/config (configuration parsing/writing), pkg/vm-low-orbit (WASM host functions), pkg/netguard (egress filtering), pkg/specs (protocol specifications), pkg/kvdb (KV database engine), and more."
          color="orange"
        />

        <CodeEntry
          path="dream/"
          description="Local development environment framework"
          details="The Dream system for running a complete Tau cloud locally. Contains Universe creation, node management, fixture injection, and the test harness. Used both as a developer tool and as the integration testing framework."
          color="purple"
        />

        <CodeEntry
          path="clients/"
          description="P2P and HTTP client implementations"
          details="Client libraries for communicating with services over P2P and HTTP. Each service has corresponding client packages that handle the protocol details of talking to that service."
          color="teal"
        />

        <CodeEntry
          path="cdk/"
          description="Cloud Development Kit"
          details="Higher-level abstractions for building on Tau. Previously used extism, now being refactored. Provides developer-friendly APIs for common operations."
          color="teal"
        />

        <CodeEntry
          path="tools/"
          description="Development and operational tools"
          details="Contains taucorder (network diagnostic tool) and other utilities for inspecting and managing a Tau network."
          color="slate"
        />

        <CodeEntry
          path="utils/"
          description="Utility packages"
          details="Shared utilities: utils/bundle (tarball/zip creation for build artifacts), and other common helpers used across the codebase."
          color="slate"
        />

        <CodeEntry
          path="images/"
          description="README and documentation images"
          details="Visual assets for the README, including hero images, workflow diagrams, and demo GIFs."
          color="slate"
        />

        <CodeEntry
          path="ee/"
          description="Enterprise Edition submodule (git submodule)"
          details="Points to the taubyte/tee repository. Contains enterprise-only services and features gated behind the 'ee' build tag. Community builds do not include this code."
          color="amber"
        />
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mt-10 mb-4">Key Files to Understand</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 font-semibold border-b border-slate-200">File</th>
              <th className="text-left p-3 font-semibold border-b border-slate-200">Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-mono text-xs">cli/node/node.go</td>
              <td className="p-3 text-slate-600">Service registry — defines what services exist and can run</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-mono text-xs">pkg/config/</td>
              <td className="p-3 text-slate-600">Configuration schema — defines what operators can configure</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-mono text-xs">pkg/vm-low-orbit/</td>
              <td className="p-3 text-slate-600">WASM host functions — the API surface exposed to functions</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-mono text-xs">pkg/netguard/</td>
              <td className="p-3 text-slate-600">Egress filtering — prevents SSRF from untrusted code</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-mono text-xs">p2p/streams/tunnels/http/</td>
              <td className="p-3 text-slate-600">HTTP tunnel — how Gateway forwards requests to Substrate</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-mono text-xs">services/substrate/</td>
              <td className="p-3 text-slate-600">Execution engine — receives and runs WASM functions</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-mono text-xs">services/monkey/</td>
              <td className="p-3 text-slate-600">Build executor — clones repos, builds WASM, publishes to TNS</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-mono text-xs">services/patrick/</td>
              <td className="p-3 text-slate-600">CI/CD orchestrator — receives webhooks, manages job queue</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-mono text-xs">services/seer/</td>
              <td className="p-3 text-slate-600">Network directory — DNS, topology, service discovery</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-mono text-xs">services/hoarder/</td>
              <td className="p-3 text-slate-600">Replication manager — rarity-based asset distribution</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-mono text-xs">services/gateway/</td>
              <td className="p-3 text-slate-600">L7 load balancer — TLS termination, scoring, routing</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-mono text-xs">services/tns/</td>
              <td className="p-3 text-slate-600">Config registry — project/branch/commit mapping</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-mono text-xs">services/auth/</td>
              <td className="p-3 text-slate-600">Auth & secrets — identity, deployment keys, certificates</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-mono text-xs">dream/</td>
              <td className="p-3 text-slate-600">Local cloud — Universe, fixtures, test harness</td>
            </tr>
            <tr>
              <td className="p-3 font-mono text-xs">AGENTS.md</td>
              <td className="p-3 text-slate-600">Design rules — KV conventions, naming standards</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mt-10 mb-4">Build Tags</h3>
      <p className="text-slate-700 mb-4">
        Tau uses Go build tags to separate community and enterprise code:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">Default (Community)</h4>
          <pre className="text-xs bg-slate-900 text-slate-100 p-2 rounded mt-2">{`go build ./cli/...
# Builds without enterprise services
# No accounts service
# Auth identity seam = stub`}</pre>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">Enterprise</h4>
          <pre className="text-xs bg-slate-900 text-slate-100 p-2 rounded mt-2">{`go build -tags ee ./cli/...
# Includes ee/ submodule services
# Full accounts + identity
# Enterprise config handlers`}</pre>
        </div>
      </div>
    </div>
  );
}

function CodeEntry({ path, description, details, color }: {
  path: string;
  description: string;
  details: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'border-l-blue-500 bg-blue-50/50',
    green: 'border-l-green-500 bg-green-50/50',
    purple: 'border-l-purple-500 bg-purple-50/50',
    orange: 'border-l-orange-500 bg-orange-50/50',
    teal: 'border-l-teal-500 bg-teal-50/50',
    amber: 'border-l-amber-500 bg-amber-50/50',
    slate: 'border-l-slate-400 bg-slate-50/50',
  };

  return (
    <div className={`p-4 rounded-r-xl border-l-4 ${colorClasses[color] || colorClasses.slate}`}>
      <div className="flex items-center gap-2 mb-1">
        <code className="text-sm font-bold text-slate-900">{path}</code>
        <span className="text-sm text-slate-600">— {description}</span>
      </div>
      <p className="text-sm text-slate-600 mt-1">{details}</p>
    </div>
  );
}
