interface Props {
  MermaidDiagram: React.FC<{ chart: string; id: string }>;
}

export function SubstrateSection({ MermaidDiagram }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4">5. Substrate & WebAssembly Runtime</h2>
      <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-8" />

      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        Substrate is the execution engine of Tau. It receives requests (HTTP, WebSocket, PubSub, Timer)
        and executes the corresponding WebAssembly function. The WASM runtime is <strong>wazero</strong> —
        a zero-dependency, pure Go WebAssembly runtime that provides true sandboxing.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">Execution Pipeline</h3>

      <MermaidDiagram
        id="substrate-pipeline"
        chart={`
graph TB
    REQ["Incoming Request<br/>(HTTP/WS/PubSub/Timer)"]
    
    subgraph "Substrate Service"
        ROUTER["Event Router<br/>Match request to function"]
        CONFIG["Config Lookup<br/>(query TNS)"]
        FETCH["Module Fetch<br/>(Bitswap if not cached)"]
        POOL["Instance Pool<br/>(reuse warm instances)"]
        EXEC["WASM Execution<br/>(wazero runtime)"]
        RESP["Response Builder"]
    end

    subgraph "WASM Guest (vm-low-orbit)"
        HTTP_CLIENT["HTTP Client<br/>(host functions)"]
        DNS_RESOLVER["DNS Resolver"]
        KV_CLIENT["KV Database Client"]
        STORAGE_CLIENT["Storage Client"]
        PUBSUB_CLIENT["PubSub Client"]
        LOG["Logging"]
    end

    REQ --> ROUTER
    ROUTER --> CONFIG
    CONFIG --> FETCH
    FETCH --> POOL
    POOL --> EXEC
    EXEC --> HTTP_CLIENT
    EXEC --> DNS_RESOLVER
    EXEC --> KV_CLIENT
    EXEC --> STORAGE_CLIENT
    EXEC --> PUBSUB_CLIENT
    EXEC --> LOG
    EXEC --> RESP
    RESP --> REQ
        `}
      />

      <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">The WASM Host-Guest Boundary</h3>
      <p className="text-slate-700 mb-4">
        WASM functions cannot directly access the host system. Instead, Tau provides "host functions" —
        Go functions exposed to the WASM guest through the <code className="bg-slate-200 px-1.5 py-0.5 rounded text-sm">pkg/vm-low-orbit/</code> package.
        This is the critical security boundary.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
          <h4 className="font-semibold text-indigo-900 mb-2">Host Functions (Go → WASM)</h4>
          <ul className="text-sm text-slate-700 space-y-1">
            <li>• <code className="text-xs bg-indigo-100 px-1 rounded">eventHttpBody</code> — read request body</li>
            <li>• <code className="text-xs bg-indigo-100 px-1 rounded">eventHttpRetCode</code> — set response status</li>
            <li>• <code className="text-xs bg-indigo-100 px-1 rounded">httpClientRequest</code> — make HTTP calls</li>
            <li>• <code className="text-xs bg-indigo-100 px-1 rounded">dnsResolve</code> — DNS lookups</li>
            <li>• <code className="text-xs bg-indigo-100 px-1 rounded">databaseGet/Put</code> — KV operations</li>
            <li>• <code className="text-xs bg-indigo-100 px-1 rounded">storageGet/Put</code> — object storage</li>
            <li>• <code className="text-xs bg-indigo-100 px-1 rounded">pubsubPublish</code> — send messages</li>
          </ul>
        </div>
        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
          <h4 className="font-semibold text-red-900 mb-2">What WASM Cannot Do</h4>
          <ul className="text-sm text-slate-700 space-y-1">
            <li>• ❌ Access the filesystem directly</li>
            <li>• ❌ Open raw network sockets</li>
            <li>• ❌ Execute system commands</li>
            <li>• ❌ Access other processes</li>
            <li>• ❌ Read environment variables</li>
            <li>• ❌ Make arbitrary network connections</li>
            <li>• ❌ Access node-local services (NetGuard)</li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">Instance Pooling & Caching</h3>
      <p className="text-slate-700 mb-4">
        WASM instantiation has a cost. Substrate maintains a pool of pre-instantiated WASM modules
        to minimize cold-start latency. The Gateway's scoring algorithm favors nodes that already
        have the requested module cached and instantiated.
      </p>

      <MermaidDiagram
        id="instance-pool"
        chart={`
stateDiagram-v2
    [*] --> ColdStart: First request for function
    ColdStart --> FetchingModule: Check local cache
    FetchingModule --> Instantiating: Module found (Bitswap)
    FetchingModule --> Instantiating: Module cached locally
    Instantiating --> WarmPool: Instance ready
    WarmPool --> Executing: New request arrives
    Executing --> WarmPool: Execution complete
    WarmPool --> Evicted: TTL expired / memory pressure
    Evicted --> [*]
        `}
      />

      <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Event Types</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 font-semibold border-b border-slate-200">Event Type</th>
              <th className="text-left p-3 font-semibold border-b border-slate-200">Trigger</th>
              <th className="text-left p-3 font-semibold border-b border-slate-200">WASM Entry Point</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">HTTP</td>
              <td className="p-3 text-slate-600">Incoming HTTP request matching a route</td>
              <td className="p-3"><code className="text-xs bg-slate-100 px-1 rounded">_start → http handler</code></td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">WebSocket</td>
              <td className="p-3 text-slate-600">New WS connection or message</td>
              <td className="p-3"><code className="text-xs bg-slate-100 px-1 rounded">ws_open / ws_message</code></td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">PubSub</td>
              <td className="p-3 text-slate-600">Message on subscribed channel</td>
              <td className="p-3"><code className="text-xs bg-slate-100 px-1 rounded">pubsub handler</code></td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Timer</td>
              <td className="p-3 text-slate-600">Cron schedule fires</td>
              <td className="p-3"><code className="text-xs bg-slate-100 px-1 rounded">timer handler</code></td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Storage</td>
              <td className="p-3 text-slate-600">File change in watched path</td>
              <td className="p-3"><code className="text-xs bg-slate-100 px-1 rounded">storage handler</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mt-6">
        <h4 className="font-semibold text-indigo-900 mb-2">🔧 For Developers: Writing Functions</h4>
        <p className="text-sm text-indigo-800 mb-2">
          Functions are written in Go (compiled via TinyGo to WASM) or other languages that target WASM.
          The Tau SDK (<code className="text-xs bg-indigo-100 px-1 rounded">github.com/taubyte/go-sdk</code>) provides
          ergonomic wrappers around the host functions. A typical HTTP function:
        </p>
        <pre className="bg-indigo-900 text-indigo-100 p-3 rounded-lg text-xs overflow-x-auto mt-2">{`//go:build wasm

package main

import (
    http "github.com/taubyte/go-sdk/http"
)

func main() {}

//export handle
func handle(ctx http.Event) error {
    body := ctx.Get().Body()
    // ... process request
    return ctx.Write().Body([]byte("Hello!")).Status(200)
}`}</pre>
      </div>
    </div>
  );
}
