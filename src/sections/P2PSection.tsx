interface Props {
  MermaidDiagram: React.FC<{ chart: string; id: string }>;
}

export function P2PSection({ MermaidDiagram }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4">4. P2P Network Layer</h2>
      <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-8" />

      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        The P2P layer is the foundation of everything in Tau. Built on <strong>libp2p</strong>,
        it provides node identity, encrypted transport, peer discovery, content routing, and
        pub/sub messaging. The <code className="bg-slate-200 px-1.5 py-0.5 rounded text-sm">p2p/</code> directory
        contains the stream abstractions and tunnel implementations that services use to communicate.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">P2P Stack Components</h3>

      <MermaidDiagram
        id="p2p-stack"
        chart={`
graph TB
    subgraph "Application Layer"
        SVC["Services<br/>(Auth, Seer, TNS, etc.)"]
    end

    subgraph "Stream Layer (p2p/streams)"
        STREAM["Stream Manager"]
        TUNNEL_HTTP["HTTP Tunnel"]
        TUNNEL_WS["WebSocket Tunnel"]
        TUNNEL_P2P["P2P Stream Tunnel"]
    end

    subgraph "Protocol Layer"
        PROTO["Protocol Handlers<br/>(/tau/auth/1.0, /tau/seer/1.0, etc.)"]
    end

    subgraph "Transport Layer (libp2p)"
        CONN["Connections<br/>(QUIC, TCP+TLS)"]
        MUX["Multiplexing<br/>(yamux)"]
        SEC["Security<br/>(Noise/TLS)"]
    end

    subgraph "Discovery & Routing"
        DHT["Kademlia DHT"]
        PS["GossipSub"]
        RELAY["Circuit Relay v2"]
        AUTORELAY["AutoRelay"]
    end

    subgraph "Data Exchange"
        BITSWAP["Bitswap<br/>(Content Routing)"]
        IPFS["Block Store<br/>(Content Addressed)"]
    end

    SVC --> STREAM
    STREAM --> TUNNEL_HTTP
    STREAM --> TUNNEL_WS
    STREAM --> TUNNEL_P2P
    TUNNEL_HTTP --> PROTO
    TUNNEL_WS --> PROTO
    TUNNEL_P2P --> PROTO
    PROTO --> CONN
    CONN --> MUX
    MUX --> SEC
    SEC --> DHT
    SEC --> PS
    SEC --> RELAY
    RELAY --> AUTORELAY
    BITSWAP --> IPFS
    DHT --> BITSWAP
        `}
      />

      <h3 className="text-xl font-semibold text-slate-900 mt-10 mb-4">Identity & Addressing</h3>
      <p className="text-slate-700 mb-4">
        Every Tau node has a cryptographic identity — a keypair that generates a unique Peer ID.
        This Peer ID is the node's permanent address in the network. The identity is used for:
      </p>
      <ul className="list-disc list-inside space-y-2 text-slate-700 mb-6">
        <li><strong>Authentication:</strong> Other nodes verify the node's identity during handshake</li>
        <li><strong>Addressing:</strong> The Peer ID appears in multiaddrs (e.g., <code className="bg-slate-100 px-1 rounded text-xs">/p2p/QmPeerID</code>)</li>
        <li><strong>Trust:</strong> Services can verify that requests come from known peers</li>
        <li><strong>Encryption:</strong> The keypair is used in the Noise protocol handshake</li>
      </ul>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">Streams & Tunnels</h3>
      <p className="text-slate-700 mb-4">
        The <code className="bg-slate-200 px-1.5 py-0.5 rounded text-sm">p2p/streams/</code> package provides
        the abstraction layer between raw P2P connections and service-level communication. Key concepts:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">P2P Streams</h4>
          <p className="text-sm text-slate-600">
            A stream is a bidirectional byte channel between two peers over a multiplexed connection.
            Each stream is identified by a protocol string (e.g., <code className="text-xs">/tau/seer/gc/v1</code>).
            Services register handlers for their protocols.
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">HTTP Tunnels</h4>
          <p className="text-sm text-slate-600">
            HTTP tunnels encapsulate HTTP request/response pairs inside P2P streams. The Gateway uses
            these to forward user HTTP requests to Substrate nodes. The tunnel preserves headers, body,
            and status codes across the P2P boundary.
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">WebSocket Tunnels</h4>
          <p className="text-sm text-slate-600">
            Similar to HTTP tunnels but for WebSocket connections. They maintain the bidirectional,
            long-lived nature of WebSockets while transporting the data over P2P streams.
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">Circuit Relay</h4>
          <p className="text-sm text-slate-600">
            When two nodes cannot connect directly (both behind NAT/firewall), public relay nodes
            establish a "circuit" between them. Data flows: Node A → Relay → Node B. This is
            automatic and transparent to services.
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">Kademlia DHT</h3>
      <p className="text-slate-700 mb-4">
        The DHT (Distributed Hash Table) is used for low-level peer and content discovery.
        It maps keys to values across the network using the Kademlia algorithm:
      </p>

      <MermaidDiagram
        id="dht-flow"
        chart={`
graph LR
    A["Node A wants to find<br/>providers of service 'seer'"]
    B["Query DHT with key:<br/>/tau/service/seer"]
    C["DHT returns closest peers<br/>who advertised 'seer'"]
    D["Node A connects to<br/>Seer node directly"]

    A --> B --> C --> D

    style A fill:#f0f9ff,stroke:#3b82f6
    style B fill:#f1f5f9,stroke:#64748b
    style C fill:#f1f5f9,stroke:#64748b
    style D fill:#f0fdf4,stroke:#22c55e
        `}
      />

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6">
        <h4 className="font-semibold text-blue-900 mb-2">⚠️ DHT Limitations in Tau</h4>
        <p className="text-sm text-blue-800">
          Tau only relies on the DHT for <em>low-level</em> information (peer addresses, content CIDs).
          For service-level discovery and topology, it uses Seer + pub-sub instead. This is because
          Kademlia DHT has known issues with uneven key distribution and stale entries.
          Seer provides a more reliable, actively-maintained directory.
        </p>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Bitswap & Content Routing</h3>
      <p className="text-slate-700 mb-4">
        Bitswap is the protocol for exchanging content-addressed blocks between peers. When Substrate
        needs a WASM module, it asks Bitswap for the content by its CID (Content Identifier).
        Bitswap finds peers who have that block (via DHT or direct requests) and downloads it.
      </p>
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-2">Content Addressing Flow</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700">
          <li>Monkey builds WASM module → stores in local blockstore → gets CID</li>
          <li>Monkey publishes CID to TNS as part of project configuration</li>
          <li>Substrate reads config from TNS → sees CID needed</li>
          <li>Substrate asks Bitswap for CID → Bitswap finds providers</li>
          <li>Block is downloaded, verified against CID hash, and cached locally</li>
          <li>Substrate instantiates WASM from the verified block</li>
        </ol>
      </div>
    </div>
  );
}
