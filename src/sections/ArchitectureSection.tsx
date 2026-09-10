interface Props {
  MermaidDiagram: React.FC<{ chart: string; id: string }>;
}

export function ArchitectureSection({ MermaidDiagram }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4">2. Architecture — The Distributed Stack</h2>
      <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-8" />

      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        Tau's architecture is a layered system where each layer builds on the one below it.
        At the bottom is the P2P network fabric (libp2p), on top of that sits the service layer,
        and above that is the user-facing API layer. Understanding these layers is essential for development.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">Layer Stack</h3>

      <MermaidDiagram
        id="arch-layers"
        chart={`
graph TB
    subgraph "Layer 5: User Interface"
        CLI["tau CLI"]
        CONSOLE["Web Console"]
        SPORE["Spore Drive"]
    end

    subgraph "Layer 4: HTTP Gateway"
        GW["Gateway Service<br/>(L7 Load Balancer + TLS)"]
    end

    subgraph "Layer 3: Services"
        AUTH["Auth"]
        SEER["Seer"]
        TNS["TNS"]
        PAT["Patrick"]
        MON["Monkey"]
        SUB["Substrate"]
        HOAR["Hoarder"]
    end

    subgraph "Layer 2: P2P Streams & Tunnels"
        STREAMS["p2p/streams<br/>(Multiplexed Channels)"]
        TUNNELS["p2p/streams/tunnels<br/>(HTTP, WebSocket tunnels)"]
    end

    subgraph "Layer 1: Network Fabric"
        LIBP2P["libp2p Host"]
        DHT["Kademlia DHT"]
        PUBSUB["GossipSub"]
        BITSWAP["Bitswap"]
        RELAY["Circuit Relay"]
    end

    CLI --> GW
    CONSOLE --> GW
    SPORE --> GW
    GW --> STREAMS
    STREAMS --> AUTH
    STREAMS --> SEER
    STREAMS --> TNS
    STREAMS --> PAT
    STREAMS --> MON
    STREAMS --> SUB
    STREAMS --> HOAR
    AUTH --> LIBP2P
    SEER --> LIBP2P
    TNS --> LIBP2P
    PAT --> LIBP2P
    SUB --> LIBP2P
    LIBP2P --> DHT
    LIBP2P --> PUBSUB
    LIBP2P --> BITSWAP
    LIBP2P --> RELAY
        `}
      />

      <h3 className="text-xl font-semibold text-slate-900 mt-10 mb-4">Node Anatomy</h3>
      <p className="text-slate-700 mb-4">
        Every Tau node is a single Go process that hosts one or more services. The node's "shape" determines
        which services it runs. In production, nodes typically run multiple services for efficiency.
        In development (Dream), each node runs a single service for isolation.
      </p>

      <MermaidDiagram
        id="node-anatomy"
        chart={`
graph LR
    subgraph "Tau Node"
        direction TB
        HOST["libp2p Host<br/>(Identity, Transport)"]
        
        subgraph "Services Running"
            S1["Service A"]
            S2["Service B"]
            S3["Service C"]
        end

        subgraph "Shared Infrastructure"
            CONFIG["Config (pkg/config)"]
            STORAGE["Local Storage"]
            VM["VM Pool (wazero)"]
        end
    end

    HOST --> S1
    HOST --> S2
    HOST --> S3
    S1 --> CONFIG
    S2 --> CONFIG
    S3 --> CONFIG
    S1 --> STORAGE
    S2 --> VM
        `}
      />

      <h3 className="text-xl font-semibold text-slate-900 mt-10 mb-4">How Nodes Discover Each Other</h3>
      <p className="text-slate-700 mb-4">
        When a Tau node starts, it needs to find peers. This happens through several mechanisms:
      </p>

      <div className="space-y-4 mb-8">
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-blue-700 font-bold text-sm">1</span>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Bootstrap Nodes</h4>
            <p className="text-sm text-slate-600">
              The node connects to pre-configured bootstrap peers (seed nodes) that are always running.
              These are specified in the network configuration.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-blue-700 font-bold text-sm">2</span>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">DHT Discovery</h4>
            <p className="text-sm text-slate-600">
              Using the Kademlia DHT, the node discovers other peers by looking up service providers.
              Each service advertises itself in the DHT with its capabilities.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-blue-700 font-bold text-sm">3</span>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Seer Beacons</h4>
            <p className="text-sm text-slate-600">
              Seer nodes maintain a comprehensive directory. Other nodes periodically send beacons
              to Seer, and Seer distributes the network topology via pub-sub.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-blue-700 font-bold text-sm">4</span>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Relay/Tunnel</h4>
            <p className="text-sm text-slate-600">
              If two nodes cannot connect directly (e.g., both behind NAT), public relay nodes
              establish circuit-relay tunnels between them automatically.
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">Request Flow: End-to-End</h3>
      <p className="text-slate-700 mb-4">
        Here's what happens when a user makes an HTTP request to a function deployed on Tau:
      </p>

      <MermaidDiagram
        id="request-flow"
        chart={`
sequenceDiagram
    participant User as End User
    participant DNS as Seer (DNS)
    participant GW as Gateway
    participant SUB as Substrate
    participant TNS as TNS
    participant VM as WASM Runtime

    User->>DNS: DNS query (myapp.tau.network)
    DNS-->>User: Resolve to Gateway IP
    
    User->>GW: HTTPS Request
    GW->>GW: TLS termination
    GW->>GW: Score substrate nodes
    GW->>SUB: Route via p2p tunnel (best score)
    
    SUB->>TNS: Lookup function config
    TNS-->>SUB: Return config + WASM CID
    
    SUB->>SUB: Fetch WASM module (Bitswap)
    SUB->>VM: Instantiate & execute WASM
    VM-->>SUB: Response (HTTP status, body)
    
    SUB-->>GW: Response via tunnel
    GW-->>User: HTTP Response
        `}
      />

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-8">
        <h4 className="font-semibold text-slate-900 mb-2">🔑 Key Insight: Node Shapes</h4>
        <p className="text-sm text-slate-700">
          A "shape" is a configuration that determines which services a node runs. For example, a "gateway" shape
          runs only the Gateway service, while a "full" shape might run all services. The <code className="bg-slate-200 px-1 rounded text-xs">cli/node/node.go</code> file
          contains the registry of available services that can be composed into shapes.
          The <code className="bg-slate-200 px-1 rounded text-xs">Register()</code> function allows enterprise (build-tagged) services
          to extend the available set.
        </p>
      </div>
    </div>
  );
}
