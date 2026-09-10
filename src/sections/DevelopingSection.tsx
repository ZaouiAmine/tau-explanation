interface Props {
  MermaidDiagram: React.FC<{ chart: string; id: string }>;
}

export function DevelopingSection({ MermaidDiagram }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4">11. Developing on Tau</h2>
      <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-8" />

      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        This section covers how to extend Tau — whether you're adding a new service, modifying
        an existing one, writing functions, or contributing to the core platform.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">Adding a New Service</h3>
      <p className="text-slate-700 mb-4">
        Tau's service architecture is extensible. You can add new services that integrate with
        the existing P2P network. Here's the process:
      </p>

      <MermaidDiagram
        id="add-service"
        chart={`
graph TB
    subgraph "Step 1: Define Interface"
        INT["core/services/myservice/<br/>Define the contract interface"]
    end

    subgraph "Step 2: Implement Service"
        SVC["services/myservice/<br/>Implement the service logic"]
        PROTO["P2P protocol handlers"]
        HTTP["HTTP route handlers"]
    end

    subgraph "Step 3: Create Client"
        CLIENT["clients/myservice/<br/>P2P + HTTP clients"]
    end

    subgraph "Step 4: Register"
        REG["cli/node/node.go<br/>Add to 'available' map"]
        SHAPE["Configure in shapes"]
    end

    subgraph "Step 5: Test"
        DREAM["dream/ fixture<br/>Integration test"]
    end

    INT --> SVC
    SVC --> PROTO
    SVC --> HTTP
    SVC --> CLIENT
    CLIENT --> REG
    REG --> SHAPE
    SHAPE --> DREAM
        `}
      />

      <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Service Implementation Pattern</h3>
      <p className="text-slate-700 mb-4">
        Every Tau service follows the same pattern. Here's the anatomy:
      </p>

      <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm overflow-x-auto mb-6">{`// services/myservice/service.go

type Service struct {
    node    node.Node          // Access to the P2P host
    config  config.Config      // Node configuration
    client  myservice.Client   // Client for other services
    close   context.CancelFunc
}

// New creates and starts the service
func New(node node.Node, config config.Config) (*Service, error) {
    svc := &Service{node: node, config: config}
    
    // Register P2P protocol handlers
    svc.registerP2PHandlers()
    
    // Register HTTP routes (if needed)
    svc.registerHTTPRoutes()
    
    // Start background goroutines
    svc.startBackgroundTasks()
    
    return svc, nil
}

// P2P handler example
func (s *Service) handleMyProtocol(stream network.Stream) {
    // Read request from stream
    // Process it
    // Write response to stream
}

// Package() returns the proto command for node registration
func Package() config.ProtoCommandIface {
    return &protoCommand{}
}`}</pre>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">Enterprise Service Extension</h3>
      <p className="text-slate-700 mb-4">
        For enterprise-only services, use the build-tag seam pattern:
      </p>

      <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm overflow-x-auto mb-6">{`// services/myservice/register_ee.go
//go:build ee

package myservice

import "github.com/taubyte/tau/cli/node"

func init() {
    // Register this service when building with -tags ee
    node.Register("myservice", Package())
}

// services/myservice/register_community.go
//go:build !ee

package myservice

// No-op: service not available in community build`}</pre>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">Writing WASM Functions</h3>
      <p className="text-slate-700 mb-4">
        Functions are the user-facing code that runs on Substrate. They're written in Go
        (compiled via TinyGo) and use the Tau SDK to interact with platform services:
      </p>

      <MermaidDiagram
        id="function-dev"
        chart={`
graph LR
    subgraph "Developer Workflow"
        CODE["Write Go code<br/>(with Tau SDK)"]
        BUILD["tau build<br/>(TinyGo → WASM)"]
        PUSH["git push<br/>(triggers CI/CD)"]
        DEPLOY["Auto-deploy<br/>(Patrick → Monkey)"]
        RUN["Live!<br/>(Substrate serves it)"]
    end

    CODE --> BUILD --> PUSH --> DEPLOY --> RUN
        `}
      />

      <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Development Workflow</h3>

      <div className="space-y-4 mb-8">
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-green-700 font-bold">1</span>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Start Dream</h4>
            <p className="text-sm text-slate-600">
              <code className="bg-slate-100 px-1 rounded text-xs">dream new universe</code> — starts a complete
              local cloud with all services.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-green-700 font-bold">2</span>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Create Project</h4>
            <p className="text-sm text-slate-600">
              Use the Web Console or CLI to create a project. This creates config + code repositories.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-green-700 font-bold">3</span>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Write Functions</h4>
            <p className="text-sm text-slate-600">
              Add functions using the Tau SDK. Define routes, databases, storage in YAML config.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-green-700 font-bold">4</span>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Push to Dream</h4>
            <p className="text-sm text-slate-600">
              <code className="bg-slate-100 px-1 rounded text-xs">tau push</code> — sends your code and config
              to the local Dream cloud for testing.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-green-700 font-bold">5</span>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Test Locally</h4>
            <p className="text-sm text-slate-600">
              Hit your functions via the Gateway URL. Everything works exactly like production.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-green-700 font-bold">6</span>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Deploy to Production</h4>
            <p className="text-sm text-slate-600">
              <code className="bg-slate-100 px-1 rounded text-xs">git push</code> to your real repo → Patrick picks
              it up → Monkey builds → Substrate serves it. Zero configuration needed.
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">Contributing to Tau Core</h3>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
        <h4 className="font-semibold text-slate-900 mb-3">Guidelines</h4>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Fork → branch from <code className="bg-slate-200 px-1 rounded text-xs">main</code> → make changes → test → submit PR</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Keep commits focused and describe what & why clearly</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>New here? Look for <code className="bg-slate-200 px-1 rounded text-xs">good first issue</code> labels</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Follow the KV naming conventions in AGENTS.md</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Write Dream integration tests for service changes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Community build must compile without ee/ submodule</span>
          </li>
        </ul>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">Key Dependencies</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 font-semibold border-b border-slate-200">Dependency</th>
              <th className="text-left p-3 font-semibold border-b border-slate-200">Purpose</th>
              <th className="text-left p-3 font-semibold border-b border-slate-200">Used In</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">libp2p</td>
              <td className="p-3 text-slate-600">P2P networking (host, DHT, pubsub, relay)</td>
              <td className="p-3 text-slate-500">p2p/, all services</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">wazero</td>
              <td className="p-3 text-slate-600">WebAssembly runtime (zero-dependency)</td>
              <td className="p-3 text-slate-500">services/substrate/</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">go-ipfs-pos</td>
              <td className="p-3 text-slate-600">Content-addressed storage primitives</td>
              <td className="p-3 text-slate-500">pkg/, services/hoarder/</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">google/nftables</td>
              <td className="p-3 text-slate-600">Linux firewall programming</td>
              <td className="p-3 text-slate-500">pkg/netguard/</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">containerd</td>
              <td className="p-3 text-slate-600">Container runtime for builds</td>
              <td className="p-3 text-slate-500">services/monkey/</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">tinygo</td>
              <td className="p-3 text-slate-600">Go → WASM compiler</td>
              <td className="p-3 text-slate-500">Build pipeline</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 mt-8">
        <h3 className="font-bold text-slate-900 mb-2">🚀 You're Ready!</h3>
        <p className="text-sm text-slate-700">
          With this guide, you now understand Tau's complete architecture — from the P2P network fabric
          to the WASM runtime, from the CI/CD pipeline to the security model. You're equipped to
          contribute to the codebase, write functions, add services, and build on the platform.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="https://github.com/taubyte/tau" className="inline-flex items-center gap-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 transition-colors">
            GitHub Repo →
          </a>
          <a href="https://tau.how" className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
            Official Docs →
          </a>
          <a href="https://discord.gg/KbN3KN7kpQ" className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors">
            Discord →
          </a>
        </div>
      </div>
    </div>
  );
}
