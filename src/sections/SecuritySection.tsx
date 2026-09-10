interface Props {
  MermaidDiagram: React.FC<{ chart: string; id: string }>;
}

export function SecuritySection({ MermaidDiagram }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4">8. Security Model</h2>
      <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-8" />

      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        Security in Tau is defense-in-depth. Multiple layers protect against different threat vectors:
        network encryption, node identity, WASM sandboxing, and egress filtering.
      </p>

      <MermaidDiagram
        id="security-layers"
        chart={`
graph TB
    subgraph "Layer 1: Network Security"
        NOISE["Noise Protocol<br/>(E2E Encryption)"]
        PEER_ID["Peer ID Verification<br/>(Cryptographic Identity)"]
        MUX_SEC["Multiplexed + Encrypted<br/>(yamux over Noise)"]
    end

    subgraph "Layer 2: Execution Sandbox"
        WASM_SANDBOX["WASM Sandboxing<br/>(wazero isolation)"]
        HOST_FN["Host Function Boundary<br/>(controlled API surface)"]
        NO_FS["No Filesystem Access<br/>(memory only)"]
    end

    subgraph "Layer 3: Network Egress (NetGuard)"
        GUEST_GUARD["Guest Layer (Go)<br/>RestrictedDialer"]
        FW_GUARD["Firewall Layer (nftables)<br/>Container egress filter"]
        DENY_LIST["Denied CIDRs:<br/>10/8, 172.16/12, 192.168/16<br/>127/8, 169.254/16, 100.64/10<br/>multicast, 240/4"]
    end

    subgraph "Layer 4: Container Isolation"
        CGROUP["Cgroup Confinement<br/>(tau/restricted subtree)"]
        CAPS["Capability Dropping<br/>(no CAP_NET_RAW)"]
        PROC_LIMIT["Process Cap<br/>(4096 max)"]
        RUNTIME["Sandboxed Runtime<br/>(configurable)"]
    end

    NOISE --> PEER_ID --> MUX_SEC
    WASM_SANDBOX --> HOST_FN --> NO_FS
    GUEST_GUARD --> FW_GUARD --> DENY_LIST
    CGROUP --> CAPS --> PROC_LIMIT --> RUNTIME
        `}
      />

      <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">NetGuard: Egress Filtering</h3>
      <p className="text-slate-700 mb-4">
        NetGuard (<code className="bg-slate-200 px-1.5 py-0.5 rounded text-sm">pkg/netguard/</code>) prevents
        untrusted code from reaching internal infrastructure. It operates at two layers:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
          <h4 className="font-semibold text-red-900 mb-2">Layer A: Guest (Pure Go)</h4>
          <p className="text-sm text-slate-700 mb-2">
            WASM functions can only make network calls through host functions. These are filtered in-process:
          </p>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• <code className="bg-red-100 px-1 rounded">IsDenied(ip)</code> — checks against CIDR deny list</li>
            <li>• <code className="bg-red-100 px-1 rounded">RestrictedDialer</code> — wraps net.Dialer with Control guard</li>
            <li>• Guard runs after DNS resolution (defeats rebinding)</li>
            <li>• HTTP client has timeout + redirect guard</li>
            <li>• DNS resolver also filtered</li>
          </ul>
        </div>
        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
          <h4 className="font-semibold text-red-900 mb-2">Layer B: Firewall (Linux)</h4>
          <p className="text-sm text-slate-700 mb-2">
            Build containers shell out to arbitrary tools, so filtering happens at the host firewall:
          </p>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• nftables table: <code className="bg-red-100 px-1 rounded">inet taubyte_netguard</code></li>
            <li>• Docker: rules on tau-netguard0 bridge</li>
            <li>• Containerd: socket-cgroupv2 match</li>
            <li>• Atomic transactions (no ruleless window)</li>
            <li>• Fail-closed (EPERM → build fails, re-dispatches)</li>
            <li>• Requires CAP_NET_ADMIN</li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">Cgroup Hierarchy</h3>
      <p className="text-slate-700 mb-4">
        Tau creates its own cgroup subtree to organize and confine workloads:
      </p>
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm overflow-x-auto mb-6">{`<tau>/
├── main/              ← tau process itself (no internal processes)
├── restricted/        ← egress-filtered workloads (matched by depth)
│   └── daemon/        ← rootless containerd daemon (leaf node)
└── containers/        ← unrestricted containers (beside restricted)`}</pre>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">HTTP Status Code Clamping</h3>
      <p className="text-slate-700 mb-4">
        A critical security fix: <code className="bg-slate-200 px-1 rounded text-sm">net/http</code>'s WriteHeader panics
        for status codes outside 100-999. Since WASM functions can set arbitrary status codes via host functions,
        and tunnel peers can send arbitrary codes, this could crash the gateway process. The fix:
      </p>
      <ul className="list-disc list-inside space-y-2 text-slate-700 mb-6">
        <li>WASM host functions reject out-of-range codes with <code className="bg-slate-200 px-1 rounded text-xs">errno.ErrorHttpWrite</code></li>
        <li>Tunnel headersOp clamps to 500 before WriteHeader</li>
        <li>Frontend goroutine has a recover() as defense-in-depth</li>
      </ul>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <h4 className="font-semibold text-slate-900 mb-2">🔐 Security Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-lg mb-1">🔒</div>
            <div className="font-medium text-slate-900">E2E Encrypted</div>
            <div className="text-xs text-slate-600">All P2P traffic</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-lg mb-1">🛡️</div>
            <div className="font-medium text-slate-900">WASM Sandbox</div>
            <div className="text-xs text-slate-600">No host access</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-lg mb-1">🚫</div>
            <div className="font-medium text-slate-900">NetGuard</div>
            <div className="text-xs text-slate-600">No SSRF possible</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-lg mb-1">📦</div>
            <div className="font-medium text-slate-900">Cgroup Isolation</div>
            <div className="text-xs text-slate-600">Resource limits</div>
          </div>
        </div>
      </div>
    </div>
  );
}
