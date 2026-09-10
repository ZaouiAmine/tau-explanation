import React from 'react';
import {
  ModuleHeader, LearningGoals, Prerequisites, KeyConcept, Analogy,
  TauConnection, CheckUnderstanding, Important, CodeBlock, ComparisonTable,
  ModuleNav, P, H3, Code
} from '../components/CourseUI';

type MermaidProps = React.FC<{ chart: string; id: string }>;
interface Props { MermaidDiagram: MermaidProps; onNavigate: (num: number) => void; }

// ============================================================
// MODULE 5: CONTENT-ADDRESSED STORAGE
// ============================================================
export function Module5({ MermaidDiagram, onNavigate }: Props) {
  return (
    <div>
      <ModuleHeader number={5} title="Content-Addressed Storage" subtitle="Finding data by what it is, not where it lives" readTime="8 min" />

      <Prerequisites items={[
        'Module 4: Distributed Hash Tables (hash functions, keys)',
        'Basic understanding of SHA-256 or similar hash functions',
      ]} />

      <LearningGoals goals={[
        'Understand content addressing vs location addressing',
        'Learn how hash functions create unique fingerprints',
        'Grasp CIDs (Content Identifiers)',
        'See how Bitswap distributes content across peers',
      ]} />

      <H3>Location vs Content Addressing</H3>
      <P>When you visit a website, you use a <strong>location address</strong> — a URL that says "go to this server, at this path." If the server moves or the file is copied elsewhere, the URL breaks.</P>

      <P><strong>Content addressing</strong> flips this: you identify data by <em>what it is</em>, not <em>where it is</em>. The address is a hash of the content itself.</P>

      <ComparisonTable
        headers={['', 'Location Addressing', 'Content Addressing']}
        rows={[
          ['Example', 'https://example.com/file.pdf', 'QmXyz...abc (hash of content)'],
          ['If file moves', 'Link breaks', 'Still works — find anyone who has it'],
          ['If file changes', 'Same link, different content', 'Different hash — different address'],
          ['Trust', 'Trust the server', 'Verify the content matches the hash'],
          ['Deduplication', 'Hard', 'Automatic — same content = same address'],
        ]}
      />

      <H3>How Hash Functions Work</H3>
      <P>A hash function takes any input and produces a fixed-size output. Key properties:</P>
      <ul className="list-disc list-inside space-y-1 text-slate-700 mb-4">
        <li><strong>Deterministic:</strong> Same input always produces same output</li>
        <li><strong>Unique:</strong> Different inputs produce different outputs (in practice)</li>
        <li><strong>One-way:</strong> You can't reverse the hash to get the original content</li>
        <li><strong>Avalanche effect:</strong> Changing one bit of input changes ~50% of output</li>
      </ul>

      <CodeBlock language="conceptual" code={`SHA-256("Hello World")
→ a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e

SHA-256("Hello world")  // lowercase 'w'
→ 64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c
// Completely different output!`} />

      <KeyConcept term="CID (Content Identifier)" definition="A self-describing content hash. It encodes the hashing algorithm used, the format of the content, and the hash itself. In Tau/IPFS, CIDs typically look like QmXyz... or bafyrei...">
        <P className="mt-2">A CID is like a fingerprint for data. If you have the CID, you can verify that any data you receive is exactly what was intended — bit for bit.</P>
      </KeyConcept>

      <H3>Bitswap — The Exchange Protocol</H3>
      <P>When a Tau node needs a piece of content (like a WASM module), it uses <strong>Bitswap</strong> to find and download it:</P>

      <MermaidDiagram id="m5-bitswap" chart={`
sequenceDiagram
    participant S as Substrate Node<br/>(needs WASM module)
    participant DHT as DHT
    participant M as Monkey Node<br/>(has the module)
    participant H as Hoarder Node<br/>(also has it)

    S->>S: Need CID QmWasm123
    S->>DHT: Who has QmWasm123?
    DHT-->>S: Monkey (QmMon) and Hoarder (QmHrd)
    S->>M: Send WANT QmWasm123
    S->>H: Send WANT QmWasm123
    M-->>S: Here's the block! (faster)
    H-->>S: Here's the block! (slower)
    S->>S: Verify hash matches CID ✓
    S->>S: Cache locally for future requests
      `} />

      <P>Key features of Bitswap:</P>
      <ul className="list-disc list-inside space-y-1 text-slate-700 mb-4">
        <li><strong>Parallel downloads:</strong> Requests go to multiple providers simultaneously</li>
        <li><strong>Verification:</strong> Every block is verified against its CID hash</li>
        <li><strong>Caching:</strong> Once downloaded, the node becomes a provider too</li>
        <li><strong>Want lists:</strong> Nodes broadcast what they need, providers respond</li>
      </ul>

      <Analogy title="The Puzzle Piece">
        <P className="!mb-0">Imagine you need a specific puzzle piece. With location addressing, you'd go to "Bob's house, top drawer." If Bob moved, you're stuck. With content addressing, you have a photo of the exact piece. You can ask anyone — "do you have a piece that looks like this?" — and when someone hands you a piece, you compare it to the photo. If it matches, it's the right piece, regardless of who gave it to you.</P>
      </Analogy>

      <TauConnection>
        <P className="!mb-0">When Monkey builds a WASM module, it stores the binary in its local blockstore and gets a CID. This CID is published to TNS as part of the project configuration. When Substrate needs to run that function, it reads the config from TNS, sees the CID, and uses Bitswap to fetch the module. Any node that has the module can serve it — creating natural distribution and caching.</P>
      </TauConnection>

      <CheckUnderstanding points={[
        'What is the difference between location addressing and content addressing?',
        'Why are hash functions essential for content addressing?',
        'How does Bitswap find and verify content?',
        'Why does content addressing enable automatic deduplication?',
      ]} />

      <ModuleNav
        prev={{ num: 4, title: 'Distributed Hash Tables' }}
        next={{ num: 6, title: 'CRDTs — Eventual Consistency' }}
        onNavigate={onNavigate}
      />
    </div>
  );
}

// ============================================================
// MODULE 6: CRDTs — EVENTUAL CONSISTENCY
// ============================================================
export function Module6({ MermaidDiagram, onNavigate }: Props) {
  return (
    <div>
      <ModuleHeader number={6} title="CRDTs — Eventual Consistency" subtitle="How distributed systems agree without a central coordinator" readTime="12 min" />

      <Prerequisites items={[
        'Module 2: P2P Networks (why no central server)',
        'Module 4: DHTs (distributed data)',
        'Basic understanding of databases (read/write operations)',
      ]} />

      <LearningGoals goals={[
        'Understand the distributed consensus problem',
        'Learn why traditional consensus (Paxos, Raft) is complex',
        'Grasp what CRDTs are and how they achieve convergence',
        'See why Tau chose CRDTs over traditional consensus',
      ]} />

      <H3>The Consensus Problem</H3>
      <P>Imagine you have a counter shared across 5 nodes. Node A increments it. How do the other nodes know? In a centralized system, there's one database — easy. In a distributed system, every node has its own copy. Keeping them in sync is the <strong>consensus problem</strong>.</P>

      <MermaidDiagram id="m6-consensus" chart={`
graph TB
    subgraph "Traditional (Centralized)"
        A1["Node A"] --> DB["Central Database<br/>counter = 5"]
        B1["Node B"] --> DB
        C1["Node C"] --> DB
    end

    subgraph "Distributed (No Central DB)"
        A2["Node A<br/>counter = 5"] <-->|"sync?"| B2["Node B<br/>counter = 4"]
        B2 <-->|"sync?"| C2["Node C<br/>counter = 5"]
        A2 <-->|"sync?"| C2
    end

    style DB fill:#fef2f2,stroke:#ef4444
      `} />

      <H3>Traditional Consensus: Paxos & Raft</H3>
      <P>Algorithms like Paxos and Raft solve consensus by electing a <strong>leader</strong> that coordinates all writes. They guarantee <strong>strong consistency</strong> — every read sees the latest write. But they have costs:</P>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-5">
        <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-sm">
          <strong className="text-red-900">Requires a leader</strong>
          <p className="text-red-800 mt-1">If the leader fails, writes stop until a new leader is elected</p>
        </div>
        <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-sm">
          <strong className="text-red-900">Needs majority quorum</strong>
          <p className="text-red-800 mt-1">More than half the nodes must be online for writes to succeed</p>
        </div>
        <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-sm">
          <strong className="text-red-900">Complex implementation</strong>
          <p className="text-red-800 mt-1">Thousands of lines of tricky distributed systems code</p>
        </div>
        <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-sm">
          <strong className="text-red-900">Latency spikes</strong>
          <p className="text-red-800 mt-1">Every write must be acknowledged by a majority before returning</p>
        </div>
      </div>

      <H3>Enter CRDTs</H3>
      <P><strong>Conflict-free Replicated Data Types</strong> (CRDTs) take a different approach. Instead of coordinating writes, they design data structures so that <em>any</em> order of operations produces the same final state.</P>

      <KeyConcept term="CRDT" definition="A data structure that can be replicated across multiple nodes, where each node can update independently and concurrently, and all replicas are guaranteed to converge to the same state — without any coordination.">
        <P className="mt-2">The key insight: if you design the data type correctly, conflicts become impossible. There's no need for a leader, no need for quorum, no need for complex protocols.</P>
      </KeyConcept>

      <H3>Types of CRDTs</H3>

      <ComparisonTable
        headers={['CRDT Type', 'Purpose', 'Example', 'How it merges']}
        rows={[
          ['G-Counter', 'Grow-only counter', 'Page views, likes', 'Take the max of each node\'s count'],
          ['PN-Counter', 'Increment/decrement', 'Inventory count', 'Two G-Counters (one for +, one for -)'],
          ['LWW-Register', 'Last value wins', 'User profile field', 'Keep the value with highest timestamp'],
          ['OR-Set', 'Add/remove elements', 'Friend list', 'Track adds and removes with unique IDs'],
          ['LWW-Map', 'Key-value with LWW', 'Config store', 'Each key has a timestamp, highest wins'],
        ]}
      />

      <MermaidDiagram id="m6-crdt-converge" chart={`
graph TB
    subgraph "G-Counter Example"
        A["Node A<br/>local_count = 3"]
        B["Node B<br/>local_count = 2"]
        C["Node C<br/>local_count = 4"]
    end

    A -->|"share state"| B
    B -->|"share state"| C
    A -->|"share state"| C

    subgraph "After sync (all nodes)"
        R["Total = max(A) + max(B) + max(C)<br/>= 3 + 2 + 4 = 9<br/>ALL NODES AGREE ✓"]
    end

    style R fill:#f0fdf4,stroke:#22c55e
      `} />

      <H3>Eventual Consistency</H3>
      <P>CRDTs provide <strong>eventual consistency</strong> — not strong consistency. This means:</P>
      <ul className="list-disc list-inside space-y-1 text-slate-700 mb-4">
        <li>Nodes may temporarily have different values</li>
        <li>But they will <em>eventually</em> converge to the same state</li>
        <li>No coordination is needed for convergence</li>
        <li>The system works even during network partitions</li>
      </ul>

      <Analogy title="The Group Document">
        <P className="!mb-0">Think of Google Docs with offline mode. You edit on your laptop while offline. Your friend edits on theirs. When you both reconnect, the changes merge. CRDTs are like that — but mathematically guaranteed to merge correctly every time, with no conflicts possible.</P>
      </Analogy>

      <Important>
        <P className="!mb-0">CRDTs are not magic — they have trade-offs. You can't implement every data structure as a CRDT. Some operations (like "set this value only if it equals X") are impossible. But for the operations Tau needs (counters, sets, maps with timestamps), CRDTs are perfect.</P>
      </Important>

      <TauConnection>
        <P className="!mb-2">Five of Tau's seven services use CRDTs:</P>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Auth:</strong> CRDT-based secret storage and identity mapping</li>
          <li><strong>Seer:</strong> CRDT for node registry and topology</li>
          <li><strong>TNS:</strong> CRDT for project configuration registry</li>
          <li><strong>Patrick:</strong> CRDT for the CI/CD job queue</li>
          <li><strong>Hoarder:</strong> CRDT stash registry for replication claims</li>
        </ul>
        <P className="mt-2 !mb-0">This is why Tau can have multiple replicas of each service without coordination — they all converge to the same state automatically.</P>
      </TauConnection>

      <CheckUnderstanding points={[
        'What is the consensus problem, and why is it hard in distributed systems?',
        'How do CRDTs differ from Paxos/Raft?',
        'What does "eventual consistency" mean in practice?',
        'Why did Tau choose CRDTs for most of its services?',
      ]} />

      <ModuleNav
        prev={{ num: 5, title: 'Content-Addressed Storage' }}
        next={{ num: 7, title: 'WebAssembly — Sandboxed Execution' }}
        onNavigate={onNavigate}
      />
    </div>
  );
}

// ============================================================
// MODULE 7: WEBASSEMBLY
// ============================================================
export function Module7({ MermaidDiagram, onNavigate }: Props) {
  return (
    <div>
      <ModuleHeader number={7} title="WebAssembly — Sandboxed Execution" subtitle="How Tau runs user code safely and portably" readTime="12 min" />

      <Prerequisites items={[
        'Basic programming knowledge (any language)',
        'Understanding of what "compilation" means (source code → machine code)',
        'Module 1: Why Tau exists (serverless functions)',
      ]} />

      <LearningGoals goals={[
        'Understand what WebAssembly is and why it exists',
        'Learn how WASM provides sandboxing',
        'Grasp the host-guest boundary (host functions)',
        'See how wazero fits into Tau',
      ]} />

      <H3>What is WebAssembly?</H3>
      <P><strong>WebAssembly (WASM)</strong> is a binary instruction format designed to run code at near-native speed in a sandboxed environment. Originally created for the web (to run C++/Rust in browsers), it's now used far beyond browsers — including serverless computing.</P>

      <KeyConcept term="WebAssembly (WASM)" definition="A portable binary format that runs in a virtual machine. Code compiled to WASM can run anywhere there's a WASM runtime — browsers, servers, edge devices — with identical behavior and guaranteed sandboxing.">
      </KeyConcept>

      <H3>Why WASM for Serverless?</H3>
      <P>Traditional serverless platforms use containers (Docker) to isolate functions. WASM offers a fundamentally different approach:</P>

      <ComparisonTable
        headers={['', 'Containers (Docker)', 'WebAssembly']}
        rows={[
          ['Startup time', '100ms - 1s', '< 1ms (often)'],
          ['Memory overhead', '50-200 MB', 'KB to low MB'],
          ['Sandboxing', 'OS-level (namespaces, cgroups)', 'Instruction-level (VM isolation)'],
          ['Portability', 'OS/architecture specific', 'Runs anywhere with a WASM runtime'],
          ['Binary size', '100MB+ (full OS layer)', 'KB to low MB'],
          ['Security boundary', 'Kernel must be trusted', 'Mathematical isolation'],
        ]}
      />

      <H3>The Sandboxing Model</H3>
      <P>WASM code runs in a <strong>virtual machine</strong> — it cannot directly access the host system. No filesystem, no network sockets, no system calls. The only way to interact with the outside world is through <strong>host functions</strong> — specific APIs the host chooses to expose.</P>

      <MermaidDiagram id="m7-sandbox" chart={`
graph TB
    subgraph "WASM Guest (User Code)"
        WASM["Your Function<br/>(compiled to WASM)"]
        WASM_CALL["Can only call:<br/>• Host functions<br/>• WASM built-ins"]
    end

    subgraph "The Boundary"
        BOUNDARY["Host Function Interface<br/>(controlled API surface)"]
    end

    subgraph "Host System (Tau)"
        HTTP["HTTP Client"]
        DB["KV Database"]
        STORE["Object Storage"]
        MSG["Pub/Sub"]
        LOG["Logging"]
    end

    WASM --> WASM_CALL
    WASM_CALL -->|"only through"| BOUNDARY
    BOUNDARY --> HTTP
    BOUNDARY --> DB
    BOUNDARY --> STORE
    BOUNDARY --> MSG
    BOUNDARY --> LOG

    style BOUNDARY fill:#fef3c7,stroke:#f59e0b,stroke-width:3px
    style WASM fill:#f0f9ff,stroke:#3b82f6
      `} />

      <P>This is a <strong>mathematical guarantee</strong>, not a policy. The WASM specification defines exactly what instructions are valid. Anything outside the spec (like a raw system call) is simply not a valid WASM instruction — it can't be expressed, let alone executed.</P>

      <H3>Host Functions — The Bridge</H3>
      <P>Host functions are Go functions that the WASM runtime exposes to guest code. They're the <em>only</em> way for WASM code to do anything useful:</P>

      <CodeBlock language="Go (host side)" code={`// This Go function is exposed to WASM as "kv_get"
func kvGet(ctx context.Context, mod api.Module, keyPtr, keyLen uint32) uint32 {
    // Read the key from WASM memory
    key, _ := mod.Memory().Read(keyPtr, keyLen)
    // Look up in the database
    value := database.Get(string(key))
    // Write result back to WASM memory
    // ...
    return resultCode
}`} />

      <CodeBlock language="Go (guest/WASM side)" code={`// From the Tau SDK — wraps the host function
func KVGet(key string) ([]byte, error) {
    // Calls the host function "kv_get"
    // The WASM runtime handles the boundary crossing
    result := hostCall("kv_get", key)
    return result.data, result.err
}`} />

      <H3>wazero — Tau's WASM Runtime</H3>
      <P><strong>wazero</strong> is a zero-dependency WebAssembly runtime written in pure Go. Tau chose it because:</P>
      <ul className="list-disc list-inside space-y-1 text-slate-700 mb-4">
        <li><strong>No CGo:</strong> Pure Go means it works everywhere Go works</li>
        <li><strong>Fast:</strong> Uses JIT compilation on supported platforms</li>
        <li><strong>Secure:</strong> Strict adherence to the WASM spec</li>
        <li><strong>Embeddable:</strong> No external processes or dependencies</li>
      </ul>

      <Analogy title="The Bank Teller">
        <P className="!mb-0">WASM sandboxing is like a bank. You (the WASM code) are inside the bank. You can't just reach into the vault (the filesystem) or walk out the back door (network sockets). You can only interact through the teller window (host functions). The teller decides what services to offer — they might let you deposit money (write to KV) or withdraw (read from KV), but they won't let you access the security system (raw network access).</P>
      </Analogy>

      <H3>Compilation Flow</H3>
      <MermaidDiagram id="m7-compile" chart={`
graph LR
    GO["Go Source Code"] -->|"TinyGo compiler"| WASM["WASM Binary<br/>(.wasm file)"]
    WASM -->|"Bitswap distribution"| NODE["Tau Node"]
    NODE -->|"wazero loads"| INST["WASM Instance<br/>(ready to execute)"]
    INST -->|"called by"| REQ["HTTP Request"]
    REQ -->|"response"| RESP["HTTP Response"]

    style GO fill:#f0f9ff,stroke:#3b82f6
    style WASM fill:#fef3c7,stroke:#f59e0b
    style INST fill:#f0fdf4,stroke:#22c55e
      `} />

      <P>Functions are written in Go (or Rust, AssemblyScript, etc.), compiled to WASM using <strong>TinyGo</strong> (a Go compiler that targets WASM), distributed via Bitswap, and executed by wazero in Substrate.</P>

      <TauConnection>
        <P className="!mb-0">Substrate is Tau's WASM execution engine. When a request arrives, Substrate looks up the function's WASM module by CID, fetches it via Bitswap if not cached, instantiates it in wazero, and executes it. The function can only interact with Tau's services through the host functions defined in <Code>pkg/vm-low-orbit/</Code> — HTTP client, KV database, object storage, pub/sub, DNS, and logging.</P>
      </TauConnection>

      <CheckUnderstanding points={[
        'What is WebAssembly and why is it used for serverless?',
        'How does WASM sandboxing differ from container isolation?',
        'What are host functions and why are they the only way for WASM to interact with the outside?',
        'What is wazero and why did Tau choose it?',
      ]} />

      <ModuleNav
        prev={{ num: 6, title: 'CRDTs — Eventual Consistency' }}
        next={{ num: 8, title: 'Containerization & Isolation' }}
        onNavigate={onNavigate}
      />
    </div>
  );
}

// ============================================================
// MODULE 8: CONTAINERIZATION & ISOLATION
// ============================================================
export function Module8({ MermaidDiagram, onNavigate }: Props) {
  return (
    <div>
      <ModuleHeader number={8} title="Containerization & Isolation" subtitle="How build processes are sandboxed on the host" readTime="10 min" />

      <Prerequisites items={[
        'Module 7: WebAssembly (WASM sandboxing for runtime)',
        'Basic Linux concepts (processes, file system)',
      ]} />

      <LearningGoals goals={[
        'Understand containers vs virtual machines',
        'Learn about Linux namespaces and cgroups',
        'See how Docker and containerd differ',
        'Understand why build isolation matters for security',
      ]} />

      <H3>Why Containers in a WASM Platform?</H3>
      <P>Wait — if WASM provides sandboxing for <em>running</em> functions, why do we need containers? Because <strong>building</strong> functions is different from running them. The build process (Monkey service) needs to:</P>
      <ul className="list-disc list-inside space-y-1 text-slate-700 mb-4">
        <li>Clone Git repositories</li>
        <li>Run compilers (TinyGo, Rust, etc.)</li>
        <li>Execute build scripts (build.sh, Dockerfiles)</li>
        <li>Install dependencies (npm install, go mod download)</li>
      </ul>
      <P>These are <strong>untrusted operations</strong> — the code being built could be malicious. Containers isolate the build process from the host system.</P>

      <H3>Linux Namespaces — The Foundation</H3>
      <P>Containers aren't magic — they're built on Linux kernel features called <strong>namespaces</strong>. Each namespace isolates a different aspect of the system:</P>

      <ComparisonTable
        headers={['Namespace', 'What it isolates', 'Effect']}
        rows={[
          ['PID', 'Process IDs', 'Container sees its own PID 1'],
          ['Network', 'Network stack', 'Container has its own IP, ports, interfaces'],
          ['Mount', 'Filesystem', 'Container sees its own filesystem tree'],
          ['User', 'User IDs', 'Root inside container ≠ root on host'],
          ['UTS', 'Hostname', 'Container has its own hostname'],
          ['IPC', 'Inter-process comms', 'Isolated shared memory, semaphores'],
        ]}
      />

      <H3>Cgroups — Resource Limits</H3>
      <P><strong>Control groups (cgroups)</strong> limit how much resources a container can use:</P>
      <ul className="list-disc list-inside space-y-1 text-slate-700 mb-4">
        <li>CPU: how many cores / what percentage</li>
        <li>Memory: maximum RAM usage</li>
        <li>PIDs: maximum number of processes</li>
        <li>I/O: disk read/write limits</li>
      </ul>

      <MermaidDiagram id="m8-cgroups" chart={`
graph TB
    subgraph "Tau's Cgroup Hierarchy"
        ROOT["/ (host system)"]
        TAU["/tau"]
        MAIN["/tau/main<br/>(tau process itself)"]
        RESTRICTED["/tau/restricted<br/>(egress-filtered builds)"]
        DAEMON["/tau/restricted/daemon<br/>(rootless containerd)"]
        CONTAINERS["/tau/containers<br/>(unrestricted builds)"]
    end

    ROOT --> TAU
    TAU --> MAIN
    TAU --> RESTRICTED
    TAU --> CONTAINERS
    RESTRICTED --> DAEMON

    style RESTRICTED fill:#fef2f2,stroke:#ef4444
    style DAEMON fill:#fef3c7,stroke:#f59e0b
    style CONTAINERS fill:#f0f9ff,stroke:#3b82f6
      `} />

      <H3>Docker vs Containerd</H3>
      <P>Tau supports both Docker and containerd as build backends:</P>

      <ComparisonTable
        headers={['', 'Docker', 'containerd']}
        rows={[
          ['Architecture', 'Daemon + CLI', 'Daemon (or rootless) + client'],
          ['Complexity', 'Higher (many features)', 'Lower (focused on runtime)'],
          ['Rootless support', 'Limited', 'Full'],
          ['Used for', 'Traditional container workloads', 'Kubernetes, lightweight deployments'],
          ['In Tau', 'Build backend option', 'Build backend option (preferred)'],
        ]}
      />

      <H3>Build Security in Tau</H3>
      <P>When Monkey runs a build, the container is heavily restricted:</P>

      <div className="space-y-3 my-5">
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 text-red-700 font-bold text-sm">1</div>
          <div>
            <strong className="text-slate-900">Network isolation</strong>
            <p className="text-sm text-slate-600">Container gets its own network namespace. Can only reach the public internet — not node-local services.</p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 text-red-700 font-bold text-sm">2</div>
          <div>
            <strong className="text-slate-900">Egress filtering (NetGuard)</strong>
            <p className="text-sm text-slate-600">nftables rules block access to private IPs (10/8, 172.16/12, 192.168/16), metadata endpoints (169.254.169.254), and loopback.</p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 text-red-700 font-bold text-sm">3</div>
          <div>
            <strong className="text-slate-900">Capability dropping</strong>
            <p className="text-sm text-slate-600">CAP_NET_RAW is dropped — containers can't open raw sockets or sniff traffic.</p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 text-red-700 font-bold text-sm">4</div>
          <div>
            <strong className="text-slate-900">Process limits</strong>
            <p className="text-sm text-slate-600">Maximum 4096 processes per build — prevents fork bombs from crashing the node.</p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 text-red-700 font-bold text-sm">5</div>
          <div>
            <strong className="text-slate-900">Cgroup confinement</strong>
            <p className="text-sm text-slate-600">All restricted containers are in the <Code>/tau/restricted</Code> cgroup subtree, matched by egress rules.</p>
          </div>
        </div>
      </div>

      <Important>
        <P className="!mb-0">The build process is fundamentally different from the runtime. Runtime uses WASM sandboxing (instruction-level isolation). Build uses container isolation (OS-level). Both are needed because building code requires capabilities that running WASM doesn't — like executing compilers and installing dependencies.</P>
      </Important>

      <CheckUnderstanding points={[
        'Why does Tau need containers if it already has WASM sandboxing?',
        'What do Linux namespaces isolate, and how do they enable containers?',
        'What is the difference between Docker and containerd?',
        'How does Tau restrict build containers from accessing internal infrastructure?',
      ]} />

      <ModuleNav
        prev={{ num: 7, title: 'WebAssembly — Sandboxed Execution' }}
        next={{ num: 9, title: 'GitOps — Git-Native Infrastructure' }}
        onNavigate={onNavigate}
      />
    </div>
  );
}

// ============================================================
// MODULE 9: GITOPS
// ============================================================
export function Module9({ MermaidDiagram, onNavigate }: Props) {
  return (
    <div>
      <ModuleHeader number={9} title="GitOps — Git-Native Infrastructure" subtitle="How Git becomes the source of truth for your cloud" readTime="8 min" />

      <Prerequisites items={[
        'Git basics (commits, branches, push/pull)',
        'Understanding of webhooks (HTTP callbacks)',
      ]} />

      <LearningGoals goals={[
        'Understand what GitOps means',
        'Learn how webhooks trigger automated workflows',
        'Grasp branch-based environments',
        'See how Git becomes infrastructure-as-code',
      ]} />

      <H3>What is GitOps?</H3>
      <P><strong>GitOps</strong> is an operational framework where Git is the single source of truth for infrastructure and application configuration. Instead of manually configuring servers, you push changes to Git — and automated systems make reality match the repository.</P>

      <KeyConcept term="GitOps" definition="An operational model where the desired state of a system is declared in Git. Automated agents continuously reconcile the actual state with the desired state. If they diverge, the system self-heals by reverting to the Git-declared state.">
      </KeyConcept>

      <H3>The GitOps Workflow</H3>
      <MermaidDiagram id="m9-gitops" chart={`
graph LR
    DEV["Developer"] -->|"git push"| REPO["Git Repository<br/>(source of truth)"]
    REPO -->|"webhook"| CD["CD System<br/>(Patrick in Tau)"]
    CD -->|"trigger"| BUILD["Build<br/>(Monkey in Tau)"]
    BUILD -->|"deploy"| INFRA["Infrastructure<br/>(Substrate in Tau)"]
    INFRA -->|"status"| CD
    CD -->|"observe"| INFRA

    style REPO fill:#fef3c7,stroke:#f59e0b
    style CD fill:#f0f9ff,stroke:#3b82f6
      `} />

      <H3>Webhooks — The Trigger Mechanism</H3>
      <P>A <strong>webhook</strong> is an HTTP callback. When something happens in Git (a push, a PR, a merge), the Git provider sends an HTTP POST to a configured URL. This triggers the CI/CD pipeline.</P>

      <CodeBlock language="webhook payload (simplified)" code={`{
  "event": "push",
  "repository": "my-project/config",
  "branch": "main",
  "commit": "abc123...",
  "author": "developer@example.com",
  "changes": ["functions/hello/config.yaml"]
}`} />

      <H3>Branch-Based Environments</H3>
      <P>One of Tau's most powerful features: different Git branches map to different environments. No special configuration needed — just point a node at a branch.</P>

      <ComparisonTable
        headers={['Branch', 'Environment', 'Use Case']}
        rows={[
          ['main', 'Production', 'Live traffic, full resources'],
          ['staging', 'Staging', 'Pre-production testing'],
          ['develop', 'Development', 'Daily development'],
          ['feature/auth', 'Feature env', 'Isolated feature testing'],
        ]}
      />

      <MermaidDiagram id="m9-branches" chart={`
graph TB
    subgraph "Git Repository"
        MAIN["main branch"]
        STAGE["staging branch"]
        DEV["develop branch"]
        FEAT["feature/auth branch"]
    end

    subgraph "Tau Cloud"
        PROD["Production Nodes<br/>(watching main)"]
        STAG["Staging Nodes<br/>(watching staging)"]
        DEVN["Dev Nodes<br/>(watching develop)"]
        FEATN["Feature Nodes<br/>(watching feature/auth)"]
    end

    MAIN --> PROD
    STAGE --> STAG
    DEV --> DEVN
    FEAT --> FEATN

    style PROD fill:#f0fdf4,stroke:#22c55e
    style STAG fill:#fef3c7,stroke:#f59e0b
    style DEVN fill:#f0f9ff,stroke:#3b82f6
    style FEATN fill:#faf5ff,stroke:#a855f7
      `} />

      <H3>Infrastructure as Code</H3>
      <P>In Tau, all configuration is stored as YAML files in Git repositories:</P>

      <CodeBlock language="yaml (project config)" code={`# .tau/config.yaml
project:
  name: my-app
  description: My awesome application

databases:
  - name: users
    encrypted: true

storage:
  - name: uploads
    public: true

functions:
  - name: hello
    source: ./functions/hello
    routes:
      - GET /hello
    triggers:
      - http`} />

      <P>When you push changes to these files, Patrick detects the change, Monkey rebuilds what's needed, and Substrate hot-swaps the updated configuration. No manual deployment steps.</P>

      <Analogy title="The Recipe Book">
        <P className="!mb-0">GitOps is like a restaurant where the recipe book (Git) is the only authority. If a chef wants to change a recipe, they update the book. The kitchen (automated system) reads the book and adjusts. If the kitchen drifts from the book (wrong temperature, missing ingredient), it self-corrects. You never walk into the kitchen and manually adjust things — you update the recipe.</P>
      </Analogy>

      <TauConnection>
        <P className="!mb-0">In Tau, Git is the control plane. Every project has two repositories: a <strong>config repo</strong> (YAML definitions) and a <strong>code repo</strong> (function source code). When you push to either, Patrick receives the webhook, creates a build job, and Monkey executes it. The result is published to TNS (the config registry), and Substrate picks up the changes automatically. Branches map to environments — the same code on different branches runs in completely isolated environments.</P>
      </TauConnection>

      <CheckUnderstanding points={[
        'What does "Git as the source of truth" mean in practice?',
        'How do webhooks trigger the CI/CD pipeline?',
        'How do branch-based environments work in Tau?',
        'What is the difference between infrastructure-as-code and GitOps?',
      ]} />

      <ModuleNav
        prev={{ num: 8, title: 'Containerization & Isolation' }}
        next={{ num: 10, title: 'Now Meet Tau — The Big Picture' }}
        onNavigate={onNavigate}
      />
    </div>
  );
}
