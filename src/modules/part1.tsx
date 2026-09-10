import React from 'react';
import {
  ModuleHeader, LearningGoals, Prerequisites, KeyConcept, Analogy,
  TauConnection, CheckUnderstanding, Important, CodeBlock, ComparisonTable,
  ModuleNav, P, H3, Code
} from '../components/CourseUI';

type MermaidProps = React.FC<{ chart: string; id: string }>;

interface Props {
  MermaidDiagram: MermaidProps;
  onNavigate: (num: number) => void;
}

// ============================================================
// MODULE 1: THE PROBLEM TAUBYTE SOLVES
// ============================================================
export function Module1({ MermaidDiagram, onNavigate }: Props) {
  return (
    <div>
      <ModuleHeader number={1} title="The Problem Tau Solves" subtitle="Why does Tau exist? What's wrong with the cloud today?" readTime="8 min" />

      <LearningGoals goals={[
        'Understand the pain points of modern cloud platforms',
        'See why Kubernetes, while powerful, adds complexity',
        'Grasp the vision of "Local Development = Global Production"',
        'Understand what a PaaS (Platform as a Service) actually does',
      ]} />

      <P>Before we dive into how Tau works, let's understand <em>why</em> it exists. If you've ever deployed an application to the cloud, you know the journey is far from simple.</P>

      <H3>The Traditional Cloud Journey</H3>
      <P>Imagine you've built a web application. It works perfectly on your laptop. Now you need to put it on the internet so others can use it. Here's what that typically looks like:</P>

      <MermaidDiagram id="m1-traditional" chart={`
graph LR
    A["Your Code"] --> B["Choose Cloud Provider<br/>(AWS/GCP/Azure)"]
    B --> C["Set up VPC, subnets,<br/>security groups"]
    C --> D["Configure load balancers"]
    D --> E["Set up CI/CD pipeline"]
    E --> F["Configure auto-scaling"]
    F --> G["Set up monitoring"]
    G --> H["Deploy 🎉"]
    H --> I["Maintain forever..."]

    style A fill:#f0fdf4,stroke:#22c55e
    style H fill:#f0fdf4,stroke:#22c55e
    style I fill:#fef2f2,stroke:#ef4444
      `} />

      <P>That's a lot of steps <em>before</em> your users can see your app. And once deployed, you're responsible for patches, scaling, monitoring, and costs — forever.</P>

      <H3>The PaaS Promise (and its limits)</H3>
      <P>Platform-as-a-Service products like Vercel, Netlify, and Heroku promised to simplify this. They handle the infrastructure so you can focus on code. But they come with trade-offs:</P>

      <ComparisonTable
        headers={['Benefit', 'Trade-off']}
        rows={[
          ['Easy deployment', 'Vendor lock-in — you can\'t easily leave'],
          ['Managed infrastructure', 'Limited control over the runtime'],
          ['Global CDN built-in', 'Expensive at scale'],
          ['Git-push deploys', 'Opaque — you don\'t know how it works'],
          ['Zero config', 'Black box — hard to debug issues'],
        ]}
      />

      <Analogy title="The Restaurant Analogy">
        <P className="!mb-0">Think of cloud providers like owning a restaurant. You need to buy the building, install the kitchen, hire staff, handle permits, and manage everything. PaaS platforms are like a food court — you get a ready-made space, but you're limited to their menu, their hours, and their rules. <strong>Tau aims to be something different:</strong> a portable kitchen you can set up anywhere, that works exactly the same whether you're in your garage or a professional facility.</P>
      </Analogy>

      <H3>The Kubernetes Problem</H3>
      <P>Many teams turned to Kubernetes (K8s) for more control. But Kubernetes is notoriously complex:</P>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-5">
        <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-sm text-red-900">
          <strong>Steep learning curve</strong>
          <p className="mt-1 text-xs">Pods, Services, Ingress, Deployments, ConfigMaps, Secrets, PVs, PVCs, CRDs...</p>
        </div>
        <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-sm text-red-900">
          <strong>Operational burden</strong>
          <p className="mt-1 text-xs">You need a team just to maintain the cluster itself</p>
        </div>
        <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-sm text-red-900">
          <strong>Local ≠ Production</strong>
          <p className="mt-1 text-xs">Running K8s locally (minikube) is nothing like production</p>
        </div>
      </div>

      <Important>
        <P className="!mb-0">Tau is explicitly <strong>not</strong> built on Kubernetes. It's a ground-up rethinking of what a cloud platform should be — simpler, self-contained, and truly portable.</P>
      </Important>

      <H3>Tau's Vision</H3>
      <P>Tau asks: what if building a cloud was as simple as running a single binary? What if your local development environment was <em>identical</em> to production? What if there was no central server — just peers working together?</P>

      <KeyConcept term="Local Development = Global Production" definition="The core Tau principle: the same code, same runtime, same services run on your laptop and in a 100-node production cluster. No environment-specific surprises.">
        <P className="mt-2">This means if your function works locally, it <em>will</em> work in production. Same WASM runtime, same database engine, same message bus.</P>
      </KeyConcept>

      <H3>What Tau Actually Is</H3>
      <P>Tau is an <strong>open-source, distributed Platform-as-a-Service</strong> that gives you:</P>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-5">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-lg mb-1">🧬</div>
          <strong className="text-slate-900">Serverless Functions</strong>
          <p className="text-sm text-slate-600 mt-1">Write code, it runs as WASM. Auto-scales, sandboxed.</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-lg mb-1">🌐</div>
          <strong className="text-slate-900">Website Hosting</strong>
          <p className="text-sm text-slate-600 mt-1">Static sites with global distribution.</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-lg mb-1">💾</div>
          <strong className="text-slate-900">KV Databases</strong>
          <p className="text-sm text-slate-600 mt-1">Distributed key-value stores with replication.</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-lg mb-1">📦</div>
          <strong className="text-slate-900">Object Storage</strong>
          <p className="text-sm text-slate-600 mt-1">Content-addressed file storage.</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-lg mb-1">📡</div>
          <strong className="text-slate-900">Pub/Sub Messaging</strong>
          <p className="text-sm text-slate-600 mt-1">Real-time messaging with WebSocket support.</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-lg mb-1">🔄</div>
          <strong className="text-slate-900">CI/CD Pipeline</strong>
          <p className="text-sm text-slate-600 mt-1">Git-native build & deploy automation.</p>
        </div>
      </div>

      <P>All of this in a <strong>single binary</strong> you can run anywhere. No Kubernetes. No Docker Swarm. No external orchestration.</P>

      <CheckUnderstanding points={[
        'Can you explain why "Local Dev = Global Prod" matters for developer experience?',
        'What are the trade-offs of using a managed PaaS vs. self-hosted?',
        'Why did Tau choose NOT to build on Kubernetes?',
        'What capabilities does Tau provide as a platform?',
      ]} />

      <ModuleNav
        prev={null}
        next={{ num: 2, title: 'Peer-to-Peer Networks' }}
        onNavigate={onNavigate}
      />
    </div>
  );
}

// ============================================================
// MODULE 2: PEER-TO-PEER NETWORKS
// ============================================================
export function Module2({ MermaidDiagram, onNavigate }: Props) {
  return (
    <div>
      <ModuleHeader number={2} title="Peer-to-Peer Networks" subtitle="The foundation of Tau's architecture — no central server" readTime="10 min" />

      <Prerequisites items={[
        'Basic understanding of how the internet works (IP addresses, ports)',
        'Familiarity with client-server model (browser → server)',
      ]} />

      <LearningGoals goals={[
        'Understand the difference between client-server and P2P',
        'Learn why P2P eliminates single points of failure',
        'Grasp the concept of node identity',
        'Understand NAT traversal and why it matters',
      ]} />

      <H3>Client-Server vs Peer-to-Peer</H3>
      <P>Most of the internet uses the <strong>client-server</strong> model. Your browser (client) asks a server for a webpage. The server responds. If the server goes down, nobody gets the page.</P>

      <MermaidDiagram id="m2-client-server" chart={`
graph LR
    subgraph "Client-Server Model"
        C1["Client 1"] --> S["Server<br/>(Single Point<br/>of Failure)"]
        C2["Client 2"] --> S
        C3["Client 3"] --> S
        C4["Client 4"] --> S
    end

    style S fill:#fef2f2,stroke:#ef4444
      `} />

      <P>In a <strong>peer-to-peer (P2P)</strong> network, every participant is both a client and a server. There's no central authority. If one node goes down, the others keep working.</P>

      <MermaidDiagram id="m2-p2p" chart={`
graph LR
    subgraph "Peer-to-Peer Model"
        N1["Node 1"] <--> N2["Node 2"]
        N2 <--> N3["Node 3"]
        N3 <--> N4["Node 4"]
        N4 <--> N1
        N1 <--> N3
        N2 <--> N4
    end

    style N1 fill:#f0fdf4,stroke:#22c55e
    style N2 fill:#f0fdf4,stroke:#22c55e
    style N3 fill:#f0fdf4,stroke:#22c55e
    style N4 fill:#f0fdf4,stroke:#22c55e
      `} />

      <Analogy title="The Phone Tree">
        <P className="!mb-0">Client-server is like calling a single information hotline. If the line is busy or down, you're stuck. P2P is like asking your friends, who ask their friends, who ask their friends. Information spreads through the network organically. If one person is unavailable, you just ask someone else.</P>
      </Analogy>

      <H3>Why P2P Matters for a Cloud Platform</H3>
      <P>Traditional clouds have central coordinators — a master node, a control plane, a database. If that central piece fails, the whole cloud can fail. Tau's P2P approach means:</P>

      <div className="space-y-3 my-5">
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-green-700 font-bold text-sm">✓</span>
          </div>
          <div>
            <strong className="text-slate-900">No single point of failure</strong>
            <p className="text-sm text-slate-600">Any node can fail without taking down the cloud</p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-green-700 font-bold text-sm">✓</span>
          </div>
          <div>
            <strong className="text-slate-900">Natural scalability</strong>
            <p className="text-sm text-slate-600">Adding more nodes increases capacity automatically</p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-green-700 font-bold text-sm">✓</span>
          </div>
          <div>
            <strong className="text-slate-900">Self-organizing</strong>
            <p className="text-sm text-slate-600">Nodes discover each other automatically — no manual configuration</p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-green-700 font-bold text-sm">✓</span>
          </div>
          <div>
            <strong className="text-slate-900">Trustless</strong>
            <p className="text-sm text-slate-600">Cryptographic identity means you know who you're talking to</p>
          </div>
        </div>
      </div>

      <H3>Node Identity — Who Are You?</H3>
      <P>In a P2P network, nodes need a way to identify themselves. Tau uses <strong>cryptographic keypairs</strong> — each node has a public key and a private key.</P>

      <KeyConcept term="Peer ID" definition="A unique identifier derived from a node's public key. It looks like QmPeerID... and serves as the node's permanent address in the network.">
        <P className="mt-2">The private key proves the node's identity (like a password). The public key is shared with others (like your name). Nobody can impersonate a node without its private key.</P>
      </KeyConcept>

      <MermaidDiagram id="m2-identity" chart={`
graph TB
    subgraph "Node Identity"
        PRIV["Private Key<br/>(secret, never shared)"]
        PUB["Public Key<br/>(shared with network)"]
        PID["Peer ID<br/>(derived from public key)"]
    end

    PRIV -->|"generates"| PUB
    PUB -->|"hash of"| PID

    subgraph "Verification"
        MSG["Message"] -->|"signed with"| PRIV
        SIG["Signature"] -->|"verified with"| PUB
    end

    style PRIV fill:#fef2f2,stroke:#ef4444
    style PUB fill:#f0f9ff,stroke:#3b82f6
    style PID fill:#f0fdf4,stroke:#22c55e
      `} />

      <H3>NAT Traversal — The Connectivity Challenge</H3>
      <P>Most devices are behind NATs (Network Address Translation) — routers that hide them from the public internet. This makes P2P tricky: how can two nodes behind NATs talk to each other?</P>

      <MermaidDiagram id="m2-nat" chart={`
graph LR
    subgraph "Network A"
        NA["Node A<br/>(Behind NAT)"]
        RTRA["Router/NAT A"]
        NA --> RTRA
    end

    subgraph "Network B"
        NB["Node B<br/>(Behind NAT)"]
        RTRB["Router/NAT B"]
        NB --> RTRB
    end

    subgraph "Public Internet"
        RELAY["Relay Node<br/>(Public IP)"]
    end

    RTRA -->|"Can't reach directly"| RTRB
    RTRA --> RELAY
    RTRB --> RELAY
    NA -.->|"Via relay"| NB

    style NA fill:#f0f9ff,stroke:#3b82f6
    style NB fill:#f0f9ff,stroke:#3b82f6
    style RELAY fill:#fefce8,stroke:#eab308
      `} />

      <P>Tau solves this with <strong>circuit relay</strong> — public nodes act as relays, forwarding traffic between nodes that can't connect directly. This is transparent to the services running on the nodes.</P>

      <TauConnection>
        <P className="!mb-0">Every Tau node has a Peer ID from its keypair. When nodes start, they connect to bootstrap peers and discover others through the network. If two nodes can't connect directly (both behind NATs), public relay nodes establish tunnels between them automatically. This is why Tau can run on laptops, home servers, and cloud VMs interchangeably.</P>
      </TauConnection>

      <CheckUnderstanding points={[
        'What is the fundamental difference between client-server and P2P?',
        'Why does P2P eliminate single points of failure?',
        'How does a node prove its identity to other nodes?',
        'What problem does NAT traversal solve, and how does relay work?',
      ]} />

      <ModuleNav
        prev={{ num: 1, title: 'The Problem Tau Solves' }}
        next={{ num: 3, title: 'libp2p — The Networking Stack' }}
        onNavigate={onNavigate}
      />
    </div>
  );
}

// ============================================================
// MODULE 3: libp2p — THE NETWORKING STACK
// ============================================================
export function Module3({ MermaidDiagram, onNavigate }: Props) {
  return (
    <div>
      <ModuleHeader number={3} title="libp2p — The Networking Stack" subtitle="The modular library that powers Tau's P2P communication" readTime="10 min" />

      <Prerequisites items={[
        'Module 2: Peer-to-Peer Networks (node identity, NAT traversal)',
        'Basic understanding of TCP/IP (connections, ports)',
      ]} />

      <LearningGoals goals={[
        'Understand what libp2p is and why it exists',
        'Learn about multiaddrs (self-describing addresses)',
        'Grasp stream multiplexing and why it matters',
        'Understand the Noise protocol for encrypted communication',
      ]} />

      <H3>What is libp2p?</H3>
      <P><strong>libp2p</strong> is a modular networking library originally created for IPFS (InterPlanetary File System). It provides all the building blocks needed for P2P applications: transport, security, routing, and pub/sub. Think of it as a toolkit — you pick the pieces you need and assemble them.</P>

      <Analogy title="The Swiss Army Knife of Networking">
        <P className="!mb-0">Traditional networking is like a fixed toolbox — you get TCP, TLS, HTTP, and that's it. libp2p is like a Swiss Army knife where you can swap out any blade. Need a different transport? Swap it. Need a different encryption protocol? Swap it. This modularity is why Tau (and IPFS, Ethereum 2.0, and others) chose it.</P>
      </Analogy>

      <H3>The libp2p Stack</H3>

      <MermaidDiagram id="m3-stack" chart={`
graph TB
    subgraph "Your Application (Tau Services)"
        APP["Auth, Seer, TNS, etc."]
    end

    subgraph "Protocol Layer"
        P1["/tau/auth/1.0"]
        P2["/tau/seer/1.0"]
        P3["/tau/tns/1.0"]
    end

    subgraph "Stream Multiplexing"
        MUX["yamux<br/>(multiple streams over one connection)"]
    end

    subgraph "Security"
        SEC["Noise Protocol<br/>(encrypted + authenticated)"]
    end

    subgraph "Transport"
        T1["QUIC (UDP)"]
        T2["TCP + TLS"]
        T3["WebSocket"]
    end

    subgraph "Peer Routing & Discovery"
        DHT["Kademlia DHT"]
        MDNS["mDNS (local)"]
        RELAY["Circuit Relay"]
    end

    APP --> P1
    APP --> P2
    APP --> P3
    P1 --> MUX
    P2 --> MUX
    P3 --> MUX
    MUX --> SEC
    SEC --> T1
    SEC --> T2
    SEC --> T3
    T1 --> DHT
    T2 --> MDNS
    T3 --> RELAY
      `} />

      <H3>Multiaddrs — Self-Describing Addresses</H3>
      <P>Traditional addresses like <Code>192.168.1.1:8080</Code> don't tell you <em>how</em> to connect. Is it TCP? UDP? Encrypted? <strong>Multiaddrs</strong> solve this by encoding the full path to a peer:</P>

      <CodeBlock language="multiaddr format" code={`/ip4/192.168.1.1/tcp/4001/p2p/QmPeer123...
/ip4/203.0.113.5/udp/4001/quic/p2p/QmPeer123...
/dns4/seed.tau.network/tcp/4001/p2p/QmSeed456...`} />

      <KeyConcept term="Multiaddr" definition="A self-describing network address that encodes the full protocol stack needed to reach a peer. Each segment describes one layer: /ip4/ for IPv4, /tcp/ for TCP, /p2p/ for the peer's identity.">
        <P className="mt-2">This means a node can be reachable via multiple paths (TCP, QUIC, WebSocket) and the address tells you exactly how to connect.</P>
      </KeyConcept>

      <H3>Stream Multiplexing</H3>
      <P>Without multiplexing, every service would need its own TCP connection. That's wasteful. <strong>yamux</strong> (Yet another Multiplexer) allows many logical streams over a single connection:</P>

      <MermaidDiagram id="m3-mux" chart={`
graph LR
    subgraph "Single Physical Connection"
        CONN["TCP/QUIC Connection<br/>(encrypted with Noise)"]
    end

    subgraph "Logical Streams (yamux)"
        S1["Stream 1<br/>/tau/auth/1.0"]
        S2["Stream 2<br/>/tau/seer/1.0"]
        S3["Stream 3<br/>/tau/tns/1.0"]
        S4["Stream 4<br/>/tau/auth/1.0<br/>(second request)"]
    end

    CONN --- S1
    CONN --- S2
    CONN --- S3
    CONN --- S4

    style CONN fill:#f0f9ff,stroke:#3b82f6
      `} />

      <P>This is crucial for Tau: a Gateway node might maintain one connection to each Substrate node but send hundreds of requests through it via different streams.</P>

      <H3>The Noise Protocol — Security by Default</H3>
      <P>Every libp2p connection is encrypted and authenticated using the <strong>Noise Protocol Framework</strong>. During the handshake:</P>
      <ol className="list-decimal list-inside space-y-1 text-slate-700 mb-4">
        <li>Both peers exchange public keys</li>
        <li>They verify each other's Peer IDs</li>
        <li>They derive a shared secret using Diffie-Hellman</li>
        <li>All subsequent data is encrypted with this secret</li>
      </ol>

      <Important>
        <P className="!mb-0">This means <strong>all P2P communication in Tau is encrypted by default</strong>. There's no "unencrypted mode." You cannot accidentally send data in plaintext between nodes.</P>
      </Important>

      <TauConnection>
        <P className="!mb-0">Tau uses libp2p as its networking foundation. Every service communicates over libp2p streams. The <Code>p2p/streams/</Code> directory in the codebase contains the abstraction layer that services use. When Gateway forwards a request to Substrate, it opens a new stream on their existing multiplexed connection — no new TCP handshake needed.</P>
      </TauConnection>

      <CheckUnderstanding points={[
        'What is libp2p and why is it modular?',
        'How does a multiaddr differ from a traditional IP:port address?',
        'Why is stream multiplexing important for a service like Tau?',
        'What does the Noise protocol provide, and why does it matter?',
      ]} />

      <ModuleNav
        prev={{ num: 2, title: 'Peer-to-Peer Networks' }}
        next={{ num: 4, title: 'Distributed Hash Tables' }}
        onNavigate={onNavigate}
      />
    </div>
  );
}

// ============================================================
// MODULE 4: DISTRIBUTED HASH TABLES
// ============================================================
export function Module4({ MermaidDiagram, onNavigate }: Props) {
  return (
    <div>
      <ModuleHeader number={4} title="Distributed Hash Tables" subtitle="How nodes find each other and content in a massive network" readTime="10 min" />

      <Prerequisites items={[
        'Module 2: Peer-to-Peer Networks (Peer IDs)',
        'Module 3: libp2p (multiaddrs, streams)',
        'Basic understanding of hash functions (input → fixed output)',
      ]} />

      <LearningGoals goals={[
        'Understand what a hash table is (quick refresher)',
        'Learn how a DHT distributes data across nodes',
        'Grasp the Kademlia algorithm and XOR distance',
        'Understand DHT limitations and why Tau uses it sparingly',
      ]} />

      <H3>Hash Tables — A Quick Refresher</H3>
      <P>A hash table is a data structure that maps keys to values. You put in a key, and you get out a value. Simple.</P>

      <CodeBlock language="conceptual" code={`hashTable.put("user:123", { name: "Alice" })
hashTable.get("user:123")  // → { name: "Alice" }`} />

      <P>A <strong>Distributed</strong> Hash Table spreads this across many nodes. No single node has all the data. Each node is responsible for a portion of the keyspace.</P>

      <H3>The Kademlia Algorithm</H3>
      <P><strong>Kademlia</strong> is the DHT algorithm used by libp2p (and BitTorrent, IPFS, etc.). Its key insight: measure distance between keys using <strong>XOR</strong>.</P>

      <KeyConcept term="XOR Distance" definition="The distance between two keys is calculated by XORing their binary representations. This creates a metric where distance is symmetric (A→B = B→A) and satisfies the triangle inequality.">
        <CodeBlock language="example" code={`Key A: 10110
Key B: 10100
XOR:   00010  → distance = 2

Key A: 10110
Key C: 01001
XOR:   11111  → distance = 31`} />
      </KeyConcept>

      <MermaidDiagram id="m4-kademlia" chart={`
graph TB
    subgraph "Kademlia Lookup"
        A["Node A wants to find<br/>key K = 10110"]
        A -->|"asks closest known peers"| B["Peer B<br/>(distance 5 from K)"]
        A -->|"asks closest known peers"| C["Peer C<br/>(distance 12 from K)"]
        B -->|"I know peers closer:"| D["Peer D<br/>(distance 2 from K)"]
        C -->|"I know peers closer:"| E["Peer E<br/>(distance 8 from K)"]
        A -->|"asks"| D
        D -->|"I know:"| F["Peer F<br/>(distance 0 from K)<br/>HAS THE VALUE!"]
    end

    style F fill:#f0fdf4,stroke:#22c55e
    style A fill:#f0f9ff,stroke:#3b82f6
      `} />

      <P>The magic of Kademlia: each lookup step roughly <strong>halves</strong> the distance to the target. Finding any key takes O(log n) steps, where n is the number of nodes. Even in a network of a million nodes, you need only ~20 hops.</P>

      <H3>K-Buckets — Organizing Knowledge</H3>
      <P>Each node maintains "k-buckets" — lists of known peers organized by distance. Peers that are "closer" (in XOR terms) go in different buckets than distant peers. This ensures a node always knows peers at every distance range.</P>

      <MermaidDiagram id="m4-kbuckets" chart={`
graph LR
    subgraph "Node A's K-Buckets"
        B0["Bucket 0<br/>(distance 1-1)<br/>Peers: X, Y"]
        B1["Bucket 1<br/>(distance 2-3)<br/>Peers: Z"]
        B2["Bucket 2<br/>(distance 4-7)<br/>Peers: W, V, U"]
        B3["Bucket 3<br/>(distance 8-15)<br/>Peers: T"]
        Bn["..."]
    end

    style B0 fill:#f0f9ff,stroke:#3b82f6
    style B1 fill:#f0f9ff,stroke:#3b82f6
    style B2 fill:#f0f9ff,stroke:#3b82f6
    style B3 fill:#f0f9ff,stroke:#3b82f6
      `} />

      <H3>What's Stored in Tau's DHT?</H3>
      <P>Tau uses the DHT for <em>low-level</em> information only:</P>
      <ul className="list-disc list-inside space-y-1 text-slate-700 mb-4">
        <li><strong>Peer addresses:</strong> "Peer QmXyz is reachable at /ip4/1.2.3.4/tcp/4001"</li>
        <li><strong>Content providers:</strong> "CID QmAbc is stored by peers QmXyz, QmDef"</li>
        <li><strong>Service advertisements:</strong> "Peer QmXyz provides the 'seer' service"</li>
      </ul>

      <Important>
        <P className="!mb-0">Tau deliberately uses the DHT <em>minimally</em>. Kademlia has known issues: uneven key distribution, stale entries, and slow convergence. For service-level discovery and topology, Tau uses <strong>Seer</strong> (a dedicated directory service) instead. The DHT is a bootstrap mechanism, not the primary source of truth.</P>
      </Important>

      <Analogy title="The Library Index">
        <P className="!mb-0">Imagine a library with a million books but no central catalog. Each librarian knows about books in their section and knows which other librarians handle adjacent sections. To find a book, you ask your librarian, who asks the librarian most likely to know, and so on. You'll find the book in about 20 questions — even in a million-book library.</P>
      </Analogy>

      <TauConnection>
        <P className="!mb-0">When a new Tau node starts, it queries the DHT to find peers providing specific services. For example, to find a Substrate node, it looks up the key <Code>/tau/service/substrate</Code> in the DHT. The DHT returns peers that have advertised themselves as Substrate providers. The node then connects to them directly via libp2p streams.</P>
      </TauConnection>

      <CheckUnderstanding points={[
        'What problem does a DHT solve in a P2P network?',
        'How does XOR distance work, and why is it useful?',
        'Why does Kademlia achieve O(log n) lookups?',
        'Why does Tau use the DHT sparingly instead of relying on it for everything?',
      ]} />

      <ModuleNav
        prev={{ num: 3, title: 'libp2p — The Networking Stack' }}
        next={{ num: 5, title: 'Content-Addressed Storage' }}
        onNavigate={onNavigate}
      />
    </div>
  );
}
