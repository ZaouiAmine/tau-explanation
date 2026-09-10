import React from 'react';
import {
  ModuleHeader, LearningGoals, Prerequisites, KeyConcept, Analogy,
  TauConnection, CheckUnderstanding, Important, CodeBlock, ComparisonTable,
  ModuleNav, P, H3, Code
} from '../components/CourseUI';

type MermaidProps = React.FC<{ chart: string; id: string }>;
interface Props { MermaidDiagram: MermaidProps; onNavigate: (num: number) => void; }

// ============================================================
// MODULE 10: NOW MEET TAU
// ============================================================
export function Module10({ MermaidDiagram, onNavigate }: Props) {
  return (
    <div>
      <ModuleHeader number={10} title="Now Meet Tau — The Big Picture" subtitle="How all the pieces connect into a complete cloud platform" readTime="12 min" />

      <Prerequisites items={[
        'Modules 1-9: All foundational concepts',
        'You understand P2P, DHT, CRDTs, WASM, containers, GitOps',
      ]} />

      <LearningGoals goals={[
        'See how all foundational technologies combine in Tau',
        'Understand the 7 core services and their roles',
        'Learn what "node shapes" are',
        'Follow a request from user to function and back',
      ]} />

      <P>Congratulations! You now understand every building block Tau is made of. Let's see how they all come together.</P>

      <H3>The Complete Picture</H3>
      <MermaidDiagram id="m10-full" chart={`
graph TB
    subgraph "User Layer"
        DEV["Developer<br/>(git push)"]
        USER["End User<br/>(HTTP request)"]
    end

    subgraph "Tau Cloud (P2P Network of Peers)"
        GW["Gateway<br/>L7 Load Balancer<br/>(libp2p + Noise)"]
        SEER["Seer<br/>DNS & Discovery<br/>(DHT + CRDT)"]
        AUTH["Auth<br/>Identity & Secrets<br/>(CRDT)"]
        TNS["TNS<br/>Config Registry<br/>(CRDT + CAS)"]

        subgraph "CI/CD Pipeline"
            PAT["Patrick<br/>Job Orchestrator<br/>(CRDT queue)"]
            MON["Monkey<br/>Build Executor<br/>(Containers + WASM)"]
        end

        subgraph "Runtime"
            SUB["Substrate<br/>WASM Runtime<br/>(wazero)"]
        end

        subgraph "Data Layer"
            HOAR["Hoarder<br/>Replication<br/>(CRDT + Bitswap)"]
        end
    end

    DEV -->|"webhook"| PAT
    PAT -->|"job"| MON
    MON -->|"publish config"| TNS
    MON -->|"mark assets"| HOAR
    HOAR -->|"replicate"| TNS

    USER -->|"HTTPS"| GW
    GW -->|"DNS lookup"| SEER
    GW -->|"verify"| AUTH
    GW -->|"route to"| SUB
    SUB -->|"read config"| TNS
    SUB -->|"execute WASM"| SUB

    style GW fill:#f0f9ff,stroke:#3b82f6
    style SUB fill:#f0fdf4,stroke:#22c55e
    style TNS fill:#fef3c7,stroke:#f59e0b
      `} />

      <H3>The 7 Core Services</H3>
      <P>Every Tau cloud runs at least one instance of each of these services (except Gateway, which is optional):</P>

      <div className="space-y-4 my-6">
        <ServiceCard
          emoji="🚪"
          name="Gateway"
          color="blue"
          what="L7 load balancer and entry point for external traffic"
          tech="libp2p tunnels, TLS termination, scoring algorithm"
          analogy="The receptionist who directs visitors to the right department"
        />
        <ServiceCard
          emoji="👁️"
          name="Seer"
          color="indigo"
          what="Network directory — DNS, topology, service discovery"
          tech="CRDT for consistency, pub-sub for updates, DNS server"
          analogy="The phone book + switchboard operator"
        />
        <ServiceCard
          emoji="🔐"
          name="Auth"
          color="red"
          what="Authentication, authorization, and secrets management"
          tech="CRDT replication, identity seam, Git integration"
          analogy="The security guard who checks IDs and holds the keys"
        />
        <ServiceCard
          emoji="📚"
          name="TNS"
          color="green"
          what="Taubyte Name Service — project registry and config store"
          tech="CRDT, content-addressed storage, branch/commit mapping"
          analogy="The library catalog that knows which book is at which version"
        />
        <ServiceCard
          emoji="📋"
          name="Patrick"
          color="yellow"
          what="CI/CD orchestrator — receives webhooks, manages job queue"
          tech="CRDT job queue, webhook validation, lifecycle tracking"
          analogy="The project manager who assigns work to the team"
        />
        <ServiceCard
          emoji="🐒"
          name="Monkey"
          color="orange"
          what="Build executor — clones repos, compiles to WASM, publishes"
          tech="Containers (Docker/containerd), NetGuard, TinyGo"
          analogy="The construction worker who actually builds things"
        />
        <ServiceCard
          emoji="📦"
          name="Hoarder"
          color="teal"
          what="Data replication manager — ensures content availability"
          tech="CRDT stash registry, Bitswap, rarity-based replication"
          analogy="The librarian who makes sure popular books have multiple copies"
        />
      </div>

      <H3>Substrate — The 8th Service</H3>
      <P><strong>Substrate</strong> deserves special mention. It's the execution engine — the service that actually <em>runs</em> your functions and serves your content. While the other services manage infrastructure, Substrate is where user code executes.</P>

      <KeyConcept term="Node Shapes" definition="A configuration that determines which services a node runs. A 'gateway' shape runs only Gateway. A 'full' shape runs everything. Shapes allow flexible deployment — from single-service nodes to all-in-one appliances.">
        <P className="mt-2">In production, nodes typically run multiple services for efficiency. In development (Dream), each node runs a single service for easier debugging.</P>
      </KeyConcept>

      <H3>Request Lifecycle — End to End</H3>
      <P>Let's trace what happens when a user visits a function deployed on Tau:</P>

      <MermaidDiagram id="m10-lifecycle" chart={`
sequenceDiagram
    participant U as User Browser
    participant DNS as Seer (DNS)
    participant GW as Gateway
    participant AUTH as Auth
    participant SUB as Substrate
    participant TNS as TNS
    participant BS as Block Store<br/>(Bitswap)
    participant WASM as WASM Runtime<br/>(wazero)

    U->>DNS: 1. DNS query: myapp.tau.net
    DNS-->>U: 2. Resolve to Gateway IP

    U->>GW: 3. HTTPS request
    GW->>GW: 4. TLS termination
    GW->>AUTH: 5. Verify request (if needed)
    AUTH-->>GW: 6. Authenticated ✓

    GW->>GW: 7. Score substrate nodes<br/>(cache, load, latency)
    GW->>SUB: 8. Route via P2P tunnel (best score)

    SUB->>TNS: 9. Lookup function config
    TNS-->>SUB: 10. Config + WASM CID

    SUB->>BS: 11. Fetch WASM module (if not cached)
    BS-->>SUB: 12. Module received, verified

    SUB->>WASM: 13. Instantiate & execute
    WASM-->>SUB: 14. Response (via host functions)

    SUB-->>GW: 15. Response via tunnel
    GW-->>U: 16. HTTP response
      `} />

      <H3>How the Technologies Combine</H3>
      <ComparisonTable
        headers={['Technology', 'Where Tau Uses It', 'Why']}
        rows={[
          ['libp2p', 'All inter-node communication', 'Encrypted, multiplexed P2P without central server'],
          ['Kademlia DHT', 'Low-level peer/content discovery', 'Finding providers for services and content'],
          ['CRDTs', 'Auth, Seer, TNS, Patrick, Hoarder', 'Coordination-free consistency across replicas'],
          ['Bitswap', 'WASM module distribution, asset replication', 'Content-addressed data exchange'],
          ['WebAssembly', 'Substrate function execution', 'Sandboxed, portable, fast user code execution'],
          ['wazero', 'WASM runtime in Substrate', 'Zero-dependency Go WASM engine'],
          ['Containers', 'Monkey build process', 'Isolating untrusted build operations'],
          ['nftables/cgroups', 'NetGuard egress filtering', 'Preventing SSRF from build containers'],
          ['Git webhooks', 'Patrick CI/CD trigger', 'Git-native deployment automation'],
        ]}
      />

      <CheckUnderstanding points={[
        'Can you name all 7+1 services and describe what each does?',
        'How does a request flow from user to function execution?',
        'What is a node shape, and why does it matter?',
        'Which foundational technology does each service primarily rely on?',
      ]} />

      <ModuleNav
        prev={{ num: 9, title: 'GitOps — Git-Native Infrastructure' }}
        next={{ num: 11, title: 'Services Deep Dive' }}
        onNavigate={onNavigate}
      />
    </div>
  );
}

function ServiceCard({ emoji, name, color, what, tech, analogy }: {
  emoji: string; name: string; color: string; what: string; tech: string; analogy: string;
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200',
    indigo: 'bg-indigo-50 border-indigo-200',
    red: 'bg-red-50 border-red-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    orange: 'bg-orange-50 border-orange-200',
    teal: 'bg-teal-50 border-teal-200',
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{emoji}</span>
        <h4 className="font-bold text-slate-900">{name}</h4>
      </div>
      <p className="text-sm text-slate-700 mb-2"><strong>What:</strong> {what}</p>
      <p className="text-sm text-slate-600 mb-2"><strong>Technologies:</strong> {tech}</p>
      <p className="text-sm text-slate-500 italic">💭 {analogy}</p>
    </div>
  );
}

// ============================================================
// MODULE 11: SERVICES DEEP DIVE
// ============================================================
export function Module11({ MermaidDiagram, onNavigate }: Props) {
  return (
    <div>
      <ModuleHeader number={11} title="Services Deep Dive" subtitle="Understanding each service's internals and interactions" readTime="15 min" />

      <Prerequisites items={[
        'Module 10: The Big Picture (service overview)',
        'Modules 2-9: All foundational technologies',
      ]} />

      <LearningGoals goals={[
        'Understand how each service works internally',
        'See the interactions between services',
        'Learn the CI/CD pipeline in detail',
        'Grasp the replication strategy',
      ]} />

      <H3>The CI/CD Pipeline — Patrick & Monkey</H3>
      <MermaidDiagram id="m11-cicd" chart={`
sequenceDiagram
    participant Dev as Developer
    participant Git as GitHub
    participant Pat as Patrick
    participant Mon1 as Monkey #1
    participant Mon2 as Monkey #2
    participant C as Container
    participant TNS as TNS
    participant H as Hoarder

    Dev->>Git: git push
    Git->>Pat: Webhook (push event)
    Pat->>Pat: Validate signature (Auth)
    Pat->>Pat: Create job in CRDT queue

    Mon1->>Pat: Race-to-lock
    Mon2->>Pat: Race-to-lock
    Pat-->>Mon1: Locked! (first wins)
    Pat-->>Mon2: Already locked

    Mon1->>C: Clone repo (Auth key)
    Mon1->>C: Run build (restricted egress)
    C->>C: Compile → WASM
    C-->>Mon1: Build artifacts

    Mon1->>TNS: Publish config + CIDs
    Mon1->>H: Mark assets for replication
    Mon1->>Pat: Report success + logs
      `} />

      <P><strong>Race-to-lock:</strong> Multiple Monkey instances compete for jobs. The first to lock a job via CRDT gets it. This provides natural load distribution — the fastest/least-loaded Monkey wins.</P>

      <H3>Gateway — The Smart Router</H3>
      <P>Gateway doesn't just forward requests — it <strong>scores</strong> Substrate nodes to find the best one:</P>

      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 my-4">
        <h5 className="font-semibold text-slate-900 mb-2">Scoring Factors:</h5>
        <ul className="space-y-1 text-sm text-slate-700">
          <li>• <strong>Cache status:</strong> Does the node already have the WASM module? (+high score)</li>
          <li>• <strong>Current load:</strong> How busy is the node? (+score if lightly loaded)</li>
          <li>• <strong>Latency:</strong> How fast is the P2P connection? (+score if low latency)</li>
          <li>• <strong>Health:</strong> Is the node responsive? (disqualified if unhealthy)</li>
        </ul>
      </div>

      <P>Gateway maintains persistent multiplexed connections to Substrate nodes. When a request arrives, it opens a new stream on the best-scoring node's connection — no new TCP handshake needed.</P>

      <H3>Hoarder — Rarity-Based Replication</H3>
      <MermaidDiagram id="m11-hoarder" chart={`
graph LR
    subgraph "Asset Registry (CRDT)"
        A1["Asset QmXyz<br/>Claims: 2/3 nodes<br/>Rarity: HIGH"]
        A2["Asset QmAbc<br/>Claims: 5/5 nodes<br/>Rarity: LOW"]
    end

    subgraph "Decision"
        A1 -->|"Rare! Compete to store"| H1["Hoarder 1"]
        A1 -->|"Rare! Compete to store"| H2["Hoarder 2"]
        A1 -->|"Rare! Compete to store"| H3["Hoarder 3"]
        A2 -->|"Already replicated enough"| SKIP["No action needed"]
    end

    H1 -->|"Bitswap fetch"| STORE["Store locally + claim"]
    H2 -->|"Bitswap fetch"| STORE
    H3 -->|"Bitswap fetch"| STORE

    style A1 fill:#fef2f2,stroke:#ef4444
    style A2 fill:#f0fdf4,stroke:#22c55e
      `} />

      <P>Hoarder instances communicate via CRDT. Each claims which assets it stores. Assets with few claims are "rare" and trigger competition — Hoarder instances race to fetch and store them. This ensures critical content always has enough copies.</P>

      <H3>Seer — The Network's Brain</H3>
      <P>Seer maintains a comprehensive view of the network:</P>
      <ul className="list-disc list-inside space-y-1 text-slate-700 mb-4">
        <li>Which nodes exist and what services they run</li>
        <li>Node health and availability</li>
        <li>DNS records for project domains</li>
        <li>TLS certificate management (Let's Encrypt)</li>
        <li>Load balancing information for Gateway</li>
      </ul>

      <P>Seer uses pub-sub to distribute topology updates and CRDTs to maintain consistency across replicas. It also runs a DNS server that resolves <Code>*.tau.network</Code> domains to Gateway IPs.</P>

      <H3>TNS — The Configuration Source of Truth</H3>
      <P>TNS maps the Git world to the runtime world:</P>

      <CodeBlock language="TNS key structure" code={`/tau/projects/{projectID}/
  /branches/{branchName}/
    /commits/{commitHash}/
      /config/         # YAML configurations
      /functions/      # Function definitions + WASM CIDs
      /databases/      # Database configs
      /storage/        # Storage configs
      /websites/       # Website configs`} />

      <P>When Substrate needs to know what functions exist, it queries TNS. When Monkey finishes a build, it publishes the result to TNS. TNS is the bridge between Git state and runtime state.</P>

      <CheckUnderstanding points={[
        'How does the race-to-lock mechanism work between Monkey instances?',
        'What factors does Gateway use to score Substrate nodes?',
        'How does Hoarder decide which assets to replicate?',
        'What does TNS map, and why is it critical?',
      ]} />

      <ModuleNav
        prev={{ num: 10, title: 'Now Meet Tau — The Big Picture' }}
        next={{ num: 12, title: 'Security Model' }}
        onNavigate={onNavigate}
      />
    </div>
  );
}

// ============================================================
// MODULE 12: SECURITY MODEL
// ============================================================
export function Module12({ MermaidDiagram, onNavigate }: Props) {
  return (
    <div>
      <ModuleHeader number={12} title="Security Model" subtitle="Defense in depth — multiple layers of protection" readTime="10 min" />

      <Prerequisites items={[
        'Module 7: WebAssembly (WASM sandboxing)',
        'Module 8: Containerization (namespace/cgroup isolation)',
      ]} />

      <LearningGoals goals={[
        'Understand Tau\'s defense-in-depth approach',
        'Learn about NetGuard egress filtering',
        'See how WASM + containers provide layered security',
        'Understand the threat model',
      ]} />

      <H3>The Four Layers of Defense</H3>
      <MermaidDiagram id="m12-layers" chart={`
graph TB
    subgraph "Layer 1: Network Encryption"
        L1["All P2P traffic encrypted with Noise protocol<br/>Node identity verified via Peer ID"]
    end

    subgraph "Layer 2: WASM Sandbox (Runtime)"
        L2["User functions run in wazero<br/>No direct host access<br/>Only host functions allowed"]
    end

    subgraph "Layer 3: NetGuard (Egress Filtering)"
        L3["Guest layer: RestrictedDialer in Go<br/>Firewall layer: nftables + cgroups<br/>Blocks: private IPs, metadata endpoints, loopback"]
    end

    subgraph "Layer 4: Container Isolation (Build)"
        L4["Namespaces: PID, Network, Mount, User<br/>Cgroups: process limits, resource caps<br/>Capabilities: CAP_NET_RAW dropped"]
    end

    L1 --> L2 --> L3 --> L4

    style L1 fill:#f0fdf4,stroke:#22c55e
    style L2 fill:#f0f9ff,stroke:#3b82f6
    style L3 fill:#fef3c7,stroke:#f59e0b
    style L4 fill:#fef2f2,stroke:#ef4444
      `} />

      <H3>NetGuard in Detail</H3>
      <P>NetGuard prevents untrusted code from reaching internal infrastructure (SSRF attacks). It operates at two layers:</P>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Layer A: Guest (Pure Go)</h4>
          <p className="text-sm text-blue-800 mb-2">WASM functions can only make network calls through host functions. These are filtered in-process:</p>
          <ul className="text-xs text-blue-900 space-y-1">
            <li>• <Code>IsDenied(ip)</Code> checks against CIDR deny list</li>
            <li>• <Code>RestrictedDialer</Code> wraps net.Dialer</li>
            <li>• Guard runs after DNS resolution (defeats rebinding)</li>
            <li>• HTTP client has timeout + redirect guard</li>
          </ul>
        </div>
        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
          <h4 className="font-semibold text-red-900 mb-2">Layer B: Firewall (Linux)</h4>
          <p className="text-sm text-red-800 mb-2">Build containers shell out to arbitrary tools, so filtering happens at the host firewall:</p>
          <ul className="text-xs text-red-900 space-y-1">
            <li>• nftables table: <Code>inet taubyte_netguard</Code></li>
            <li>• Docker: rules on tau-netguard0 bridge</li>
            <li>• Containerd: socket-cgroupv2 match</li>
            <li>• Atomic transactions (no ruleless window)</li>
            <li>• Fail-closed (EPERM → build fails, re-dispatches)</li>
          </ul>
        </div>
      </div>

      <H3>Denied CIDRs</H3>
      <P>These address ranges are always blocked — untrusted code cannot reach them:</P>
      <ComparisonTable
        headers={['CIDR', 'Range', 'Why Blocked']}
        rows={[
          ['10.0.0.0/8', '10.0.0.0 – 10.255.255.255', 'Private network (RFC 1918)'],
          ['172.16.0.0/12', '172.16.0.0 – 172.31.255.255', 'Private network (RFC 1918)'],
          ['192.168.0.0/16', '192.168.0.0 – 192.168.255.255', 'Private network (RFC 1918)'],
          ['127.0.0.0/8', '127.0.0.0 – 127.255.255.255', 'Loopback (node-local services)'],
          ['169.254.0.0/16', '169.254.0.0 – 169.254.255.255', 'Link-local (cloud metadata!)'],
          ['100.64.0.0/10', '100.64.0.0 – 100.127.255.255', 'Carrier-grade NAT'],
          ['224.0.0.0/4', 'Multicast range', 'Multicast traffic'],
          ['240.0.0.0/4', 'Reserved range', 'Reserved/future use'],
        ]}
      />

      <Important>
        <P className="!mb-0">The metadata endpoint <Code>169.254.169.254</Code> is especially critical. In cloud environments (AWS, GCP, Azure), this address provides access to instance credentials, API keys, and other secrets. Blocking it prevents a compromised function from stealing the node's cloud credentials.</P>
      </Important>

      <H3>HTTP Status Code Clamping</H3>
      <P>A subtle but important security fix: Go's <Code>net/http</Code> panics for status codes outside 100-999. Since WASM functions can set arbitrary status codes via host functions, and tunnel peers can send arbitrary codes, this could crash the Gateway process. The fix clamps all codes to valid ranges before calling WriteHeader.</P>

      <CheckUnderstanding points={[
        'What are the four layers of defense in Tau?',
        'Why is blocking 169.254.169.254 critical in cloud environments?',
        'How does NetGuard work at both the guest and firewall layers?',
        'Why is fail-closed important for the firewall layer?',
      ]} />

      <ModuleNav
        prev={{ num: 11, title: 'Services Deep Dive' }}
        next={{ num: 13, title: 'Dream — Local Development' }}
        onNavigate={onNavigate}
      />
    </div>
  );
}

// ============================================================
// MODULE 13: DREAM
// ============================================================
export function Module13({ MermaidDiagram, onNavigate }: Props) {
  return (
    <div>
      <ModuleHeader number={13} title="Dream — Local Development" subtitle="Running a complete Tau cloud on your laptop" readTime="8 min" />

      <Prerequisites items={[
        'Module 10: The Big Picture (all services)',
        'Module 1: Local Dev = Global Prod principle',
      ]} />

      <LearningGoals goals={[
        'Understand what Dream is and why it exists',
        'Learn how Dream differs from production',
        'See how to use Dream for testing',
        'Understand the Universe/Fixture model',
      ]} />

      <H3>What is Dream?</H3>
      <P><strong>Dream</strong> is Tau's local development environment — a complete cloud running on your laptop. It embodies the core principle: "Local Development = Global Production." Same binary, same services, same runtime — just smaller.</P>

      <MermaidDiagram id="m13-dream" chart={`
graph TB
    subgraph "Dream Universe (Your Laptop)"
        N1["Node 1: Seer"]
        N2["Node 2: TNS"]
        N3["Node 3: Auth"]
        N4["Node 4: Patrick"]
        N5["Node 5: Monkey"]
        N6["Node 6: Substrate"]
        N7["Node 7: Hoarder"]
        N8["Node 8: Gateway"]
    end

    N1 <-->|"P2P (localhost)"| N2
    N2 <--> N3
    N3 <--> N4
    N4 <--> N5
    N5 <--> N6
    N6 <--> N7
    N7 <--> N8
    N8 <--> N1

    DEV["Developer"] -->|"HTTP :8080"| N8
      `} />

      <H3>Dream vs Production</H3>
      <ComparisonTable
        headers={['Aspect', 'Dream (Dev)', 'Production']}
        rows={[
          ['Nodes', '1 service per node (8 nodes)', 'Multiple services per node (shapes)'],
          ['Network', 'Localhost P2P', 'Internet P2P + relay'],
          ['DNS', '.gq test domains', "Real domains + Let's Encrypt"],
          ['Auth', 'Simplified (no accounts)', 'Full identity + Git integration'],
          ['NetGuard', 'Disabled (dev mode)', 'Active (nftables + cgroups)'],
          ['Persistence', 'Ephemeral', 'Persistent storage'],
          ['Scaling', 'Fixed (8 nodes)', 'Dynamic (add nodes as needed)'],
        ]}
      />

      <H3>The Universe Model</H3>
      <P>Dream organizes everything into a <strong>Universe</strong> — a complete cloud instance you can create, manipulate, and destroy programmatically:</P>

      <CodeBlock language="Go" code={`// Create a universe with all services
u, err := dream.New(dream.Config{
    Services: map[string]int{
        "seer":      1,
        "tns":       1,
        "auth":      1,
        "patrick":   1,
        "monkey":    1,
        "substrate": 1,
        "hoarder":   1,
        "gateway":   1,
    },
})
defer u.Stop()

// Get a service client
tns := u.Tns()

// Inject test fixtures
err = u.RunFixture("create_project", "my-project")

// Test your functionality
config, err := tns.Fetch(...)
assert.NotNil(t, config)`} />

      <H3>Fixtures — Pre-built Test Data</H3>
      <P><strong>Fixtures</strong> are pre-built test data (projects, functions, configurations) that can be injected into a universe. They let tests set up known states without manual configuration:</P>

      <CodeBlock language="Go" code={`// Fixture: create a project with a function
func CreateProjectWithFunction(u dream.Universe) error {
    // Create project config
    project := &config.Project{
        Name: "test-project",
        Functions: []*config.Function{{
            Name:   "hello",
            Source: "./functions/hello",
            Routes: []string{"GET /hello"},
        }},
    }
    // Push to TNS
    return u.Tns().Publish(project)
}`} />

      <Analogy title="The Simulation">
        <P className="!mb-0">Dream is like a flight simulator for your cloud. Just as pilots practice in a simulator before flying a real plane, Tau developers test their applications in Dream before deploying to production. The simulator behaves exactly like the real thing — same controls, same responses — but crashes have no real consequences.</P>
      </Analogy>

      <CheckUnderstanding points={[
        'What is Dream and why is it important for the "Local Dev = Global Prod" principle?',
        'How does Dream differ from production?',
        'What is a Universe in Dream?',
        'How do fixtures help with testing?',
      ]} />

      <ModuleNav
        prev={{ num: 12, title: 'Security Model' }}
        next={{ num: 14, title: 'Building on Tau' }}
        onNavigate={onNavigate}
      />
    </div>
  );
}

// ============================================================
// MODULE 14: BUILDING ON TAU
// ============================================================
export function Module14({ MermaidDiagram, onNavigate }: Props) {
  return (
    <div>
      <ModuleHeader number={14} title="Building on Tau" subtitle="Writing functions, creating projects, and deploying" readTime="10 min" />

      <Prerequisites items={[
        'Module 7: WebAssembly (how functions execute)',
        'Module 9: GitOps (how deployment works)',
        'Module 13: Dream (local testing)',
      ]} />

      <LearningGoals goals={[
        'Learn how to write a Tau function',
        'Understand project structure (config + code repos)',
        'See the development workflow end-to-end',
        'Know how to contribute to Tau core',
      ]} />

      <H3>Writing Your First Function</H3>
      <P>Functions are written in Go (compiled via TinyGo to WASM). Here's a simple HTTP function:</P>

      <CodeBlock language="Go (function source)" code={`//go:build wasm

package main

import (
    "github.com/taubyte/go-sdk/http"
)

func main() {}

//export handle
func handle(ctx http.Event) error {
    // Read the request
    name := ctx.Request().Query().Get("name")
    if name == "" {
        name = "World"
    }

    // Write the response
    return ctx.Response().
        Status(200).
        Header("Content-Type", "text/plain").
        Body([]byte("Hello, " + name + "!")).
        Send()
}`} />

      <H3>Project Structure</H3>
      <P>Every Tau project has two repositories:</P>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">📁 Config Repository</h4>
          <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto">{`project.yaml
functions/
  hello.yaml
  goodbye.yaml
databases/
  users.yaml
storage/
  uploads.yaml
websites/
  main.yaml`}</pre>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">📁 Code Repository</h4>
          <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto">{`functions/
  hello/
    main.go
    go.mod
  goodbye/
    main.go
    go.mod
libraries/
  shared/
    utils.go`}</pre>
        </div>
      </div>

      <H3>The Development Workflow</H3>
      <MermaidDiagram id="m14-workflow" chart={`
graph LR
    subgraph "Local Development"
        DREAM["1. Start Dream<br/>(dream new universe)"]
        CODE["2. Write code<br/>(Go + Tau SDK)"]
        CONFIG["3. Define config<br/>(YAML files)"]
        PUSH["4. Push to Dream<br/>(tau push)"]
        TEST["5. Test locally<br/>(curl localhost:8080)"]
    end

    subgraph "Production Deployment"
        GIT["6. git push<br/>(to GitHub)"]
        PAT["7. Patrick<br/>(webhook → job)"]
        MON["8. Monkey<br/>(build → WASM)"]
        SUB["9. Substrate<br/>(serve function)"]
    end

    DREAM --> CODE --> CONFIG --> PUSH --> TEST
    TEST -->|"Ready?"| GIT
    GIT --> PAT --> MON --> SUB

    style DREAM fill:#f0f9ff,stroke:#3b82f6
    style GIT fill:#fef3c7,stroke:#f59e0b
    style SUB fill:#f0fdf4,stroke:#22c55e
      `} />

      <H3>Available SDK Features</H3>
      <P>The Tau SDK (<Code>github.com/taubyte/go-sdk</Code>) provides host function wrappers:</P>

      <ComparisonTable
        headers={['SDK Package', 'What it does', 'Example']}
        rows={[
          ['http', 'Read requests, write responses', 'ctx.Request().Body()'],
          ['kv', 'Key-value database operations', 'db.Get("key"), db.Put("key", val)'],
          ['storage', 'Object storage operations', 'store.Get("file.pdf")'],
          ['pubsub', 'Publish/subscribe messaging', 'channel.Publish(msg)'],
          ['dns', 'DNS resolution', 'dns.Resolve("example.com")'],
          ['crypto', 'Cryptographic operations', 'crypto.Hash(data)'],
        ]}
      />

      <H3>Contributing to Tau Core</H3>
      <P>Want to add a new service or modify an existing one? Here's the pattern:</P>

      <div className="space-y-3 my-5">
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 text-green-700 font-bold text-sm">1</div>
          <div>
            <strong className="text-slate-900">Define the interface</strong>
            <p className="text-sm text-slate-600">Create <Code>core/services/myservice/</Code> with the contract your service must fulfill.</p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 text-green-700 font-bold text-sm">2</div>
          <div>
            <strong className="text-slate-900">Implement the service</strong>
            <p className="text-sm text-slate-600">Create <Code>services/myservice/</Code> with P2P handlers, HTTP routes, and business logic.</p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 text-green-700 font-bold text-sm">3</div>
          <div>
            <strong className="text-slate-900">Create clients</strong>
            <p className="text-sm text-slate-600">Create <Code>clients/myservice/</Code> with P2P and HTTP client implementations.</p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 text-green-700 font-bold text-sm">4</div>
          <div>
            <strong className="text-slate-900">Register the service</strong>
            <p className="text-sm text-slate-600">Add to <Code>cli/node/node.go</Code>'s <Code>available</Code> map, or use <Code>node.Register()</Code>.</p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 text-green-700 font-bold text-sm">5</div>
          <div>
            <strong className="text-slate-900">Write Dream tests</strong>
            <p className="text-sm text-slate-600">Create integration tests using Dream universes and fixtures.</p>
          </div>
        </div>
      </div>

      <CheckUnderstanding points={[
        'What does a minimal Tau function look like?',
        'What are the two repositories in a Tau project?',
        'How does the development workflow differ from the deployment workflow?',
        'What are the steps to add a new service to Tau?',
      ]} />

      <ModuleNav
        prev={{ num: 13, title: 'Dream — Local Development' }}
        next={{ num: 15, title: 'Codebase Map & Next Steps' }}
        onNavigate={onNavigate}
      />
    </div>
  );
}

// ============================================================
// MODULE 15: CODEBASE MAP
// ============================================================
export function Module15({ MermaidDiagram, onNavigate }: Props) {
  return (
    <div>
      <ModuleHeader number={15} title="Codebase Map & Next Steps" subtitle="Navigating the Tau repository and where to go from here" readTime="8 min" />

      <Prerequisites items={[
        'All previous modules — you now have the full picture!',
      ]} />

      <LearningGoals goals={[
        'Navigate the Tau repository with confidence',
        'Know where to find specific functionality',
        'Understand build tags and enterprise extensions',
        'Have a plan for your next steps',
      ]} />

      <H3>Repository Structure</H3>
      <CodeBlock language="directory tree" code={`tau/
├── cli/                    # CLI entry point
│   └── node/node.go        # Service registry (the 'available' map)
├── core/                   # Interfaces and contracts
│   └── services/           # Service interface definitions
├── services/               # Service implementations
│   ├── auth/              # Authentication & secrets
│   ├── gateway/           # L7 load balancer
│   ├── hoarder/           # Data replication
│   ├── monkey/            # Build executor
│   ├── patrick/           # CI/CD orchestrator
│   ├── seer/              # DNS & discovery
│   ├── substrate/         # WASM runtime
│   └── tns/               # Config registry
├── p2p/                    # P2P networking
│   └── streams/           # Stream abstractions & tunnels
├── pkg/                    # Shared packages
│   ├── config/            # Configuration parsing
│   ├── vm-low-orbit/      # WASM host functions
│   ├── netguard/          # Egress filtering
│   ├── kvdb/              # KV database engine
│   └── specs/             # Protocol specifications
├── clients/                # P2P & HTTP client libraries
├── dream/                  # Local development environment
├── tools/                  # Utilities (taucorder, etc.)
├── utils/                  # Shared utilities (bundle, etc.)
├── ee/                     # Enterprise Edition (git submodule)
├── AGENTS.md              # Design rules & conventions
└── Makefile               # Build targets`} />

      <H3>Key Files to Know</H3>
      <ComparisonTable
        headers={['File', 'What it does', 'When to look here']}
        rows={[
          ['cli/node/node.go', 'Service registry', 'Adding a new service'],
          ['pkg/config/', 'Configuration schema', 'Understanding what operators can configure'],
          ['pkg/vm-low-orbit/', 'WASM host functions', 'Adding new capabilities for functions'],
          ['pkg/netguard/', 'Egress filtering', 'Understanding/modifying security'],
          ['p2p/streams/tunnels/', 'HTTP/WS tunnels', 'Understanding request routing'],
          ['services/substrate/', 'Execution engine', 'How functions run'],
          ['services/monkey/', 'Build executor', 'How builds work'],
          ['services/patrick/', 'CI/CD orchestrator', 'How webhooks become builds'],
          ['dream/', 'Local cloud', 'Testing, fixtures, development'],
          ['AGENTS.md', 'Design rules', 'KV naming, conventions'],
        ]}
      />

      <H3>Build Tags</H3>
      <P>Tau uses Go build tags to separate community and enterprise code:</P>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">Community (default)</h4>
          <pre className="text-xs bg-slate-900 text-slate-100 p-2 rounded mt-2">{`go build ./cli/...
# No enterprise services
# No accounts service
# Auth identity = stub`}</pre>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">Enterprise</h4>
          <pre className="text-xs bg-slate-900 text-slate-100 p-2 rounded mt-2">{`go build -tags ee ./cli/...
# Includes ee/ submodule
# Full accounts + identity
# Enterprise config handlers`}</pre>
        </div>
      </div>

      <H3>Your Learning Path — What's Next?</H3>
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-4">🚀 Recommended Next Steps</h4>
        <div className="space-y-3">
          <div className="flex gap-3 items-start">
            <span className="text-orange-500 font-bold">1.</span>
            <div>
              <strong className="text-slate-900">Try Dream locally</strong>
              <p className="text-sm text-slate-600">Spin up a local Tau cloud and experiment. Nothing beats hands-on experience.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-orange-500 font-bold">2.</span>
            <div>
              <strong className="text-slate-900">Write a function</strong>
              <p className="text-sm text-slate-600">Create a project, write an HTTP function, deploy it to Dream, test it.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-orange-500 font-bold">3.</span>
            <div>
              <strong className="text-slate-900">Read the source</strong>
              <p className="text-sm text-slate-600">Start with <Code>cli/node/node.go</Code>, then explore one service (try <Code>services/seer/</Code>).</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-orange-500 font-bold">4.</span>
            <div>
              <strong className="text-slate-900">Join the community</strong>
              <p className="text-sm text-slate-600">Discord, GitHub Discussions, look for "good first issue" labels.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-orange-500 font-bold">5.</span>
            <div>
              <strong className="text-slate-900">Contribute</strong>
              <p className="text-sm text-slate-600">Fix a bug, add a test, improve docs. Every contribution matters.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-6 text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-2">🎉 Course Complete!</h3>
        <p className="text-slate-700 mb-4">
          You now understand Tau from the ground up — from P2P networking to WASM execution,
          from CRDTs to CI/CD. You're ready to build on and contribute to the platform.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
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

      <ModuleNav
        prev={{ num: 14, title: 'Building on Tau' }}
        next={null}
        onNavigate={onNavigate}
      />
    </div>
  );
}
