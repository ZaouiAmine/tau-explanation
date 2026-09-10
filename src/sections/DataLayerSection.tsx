interface Props {
  MermaidDiagram: React.FC<{ chart: string; id: string }>;
}

export function DataLayerSection({ MermaidDiagram }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4">7. Data & Storage Layer</h2>
      <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-8" />

      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        Tau provides three types of data storage, all distributed and content-addressed.
        Data flows through Hoarder for replication and is served by Substrate to functions.
      </p>

      <MermaidDiagram
        id="data-layer"
        chart={`
graph TB
    subgraph "Data Types"
        KV["KV Database<br/>(Key-Value Store)"]
        OBJ["Object Storage<br/>(Files/Blobs)"]
        MSG["Messaging<br/>(Pub/Sub Channels)"]
    end

    subgraph "Storage Engine"
        CRDT_DB["CRDT-based KV<br/>(eventual consistency)"]
        BLOCKSTORE["Block Store<br/>(content-addressed)"]
        PUBSUB_ENGINE["GossipSub<br/>(message fan-out)"]
    end

    subgraph "Replication (Hoarder)"
        RARE["Rarity Scoring"]
        CLAIM["Stash Claims"]
        FANOUT["Fan-out Replication"]
    end

    subgraph "Access (Substrate)"
        WASM_KV["WASM KV Client<br/>(host functions)"]
        WASM_OBJ["WASM Storage Client"]
        WASM_MSG["WASM PubSub Client"]
    end

    KV --> CRDT_DB
    OBJ --> BLOCKSTORE
    MSG --> PUBSUB_ENGINE

    CRDT_DB --> RARE
    BLOCKSTORE --> RARE
    RARE --> CLAIM
    CLAIM --> FANOUT

    CRDT_DB --> WASM_KV
    BLOCKSTORE --> WASM_OBJ
    PUBSUB_ENGINE --> WASM_MSG
        `}
      />

      <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">KV Database</h3>
      <p className="text-slate-700 mb-4">
        The KV database is a distributed key-value store built on CRDTs. Each project can define
        multiple databases, each with its own encryption and access controls. Keys are scoped
        to the database, and values are replicated across nodes via Hoarder.
      </p>
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
        <h4 className="font-semibold text-slate-900 mb-2">KV Design Rules (from AGENTS.md)</h4>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>• Keys use compound paths with <code className="text-xs bg-slate-200 px-1 rounded">/</code> separators</li>
          <li>• Avoid single-key-per-value patterns (causes last-write-wins conflicts)</li>
          <li>• Per-claimant indexing for deterministic resolution across nodes</li>
          <li>• Prefix scanning works on path segments, not compound words</li>
        </ul>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">Object Storage</h3>
      <p className="text-slate-700 mb-4">
        Object storage uses content-addressed blocks (similar to IPFS). Each file gets a CID
        (Content Identifier) based on its hash. This enables:
      </p>
      <ul className="list-disc list-inside space-y-2 text-slate-700 mb-6">
        <li><strong>Deduplication:</strong> Identical files are stored only once</li>
        <li><strong>Integrity:</strong> Content is verified against its hash on every read</li>
        <li><strong>Distribution:</strong> Any node can serve any file it has cached</li>
        <li><strong>Efficiency:</strong> Bitswap finds the closest/fastest provider</li>
      </ul>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">Pub/Sub Messaging</h3>
      <p className="text-slate-700 mb-4">
        Messaging uses GossipSub (the same protocol used for peer discovery) but scoped to
        application channels. Messages are published to a channel and fanned out to all
        subscribers across the network.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Hoarder: Replication Strategy</h3>

      <MermaidDiagram
        id="hoarder-strategy"
        chart={`
graph LR
    subgraph "Hoarder Network"
        H1["Hoarder Node 1"]
        H2["Hoarder Node 2"]
        H3["Hoarder Node 3"]
    end

    subgraph "Asset Registry (CRDT)"
        ASSET["Asset CID: QmXyz..."]
        SCORE["Rarity Score: 2/3"]
        CLAIMS["Claims: H1✓ H2✓ H3✗"]
    end

    subgraph "Decision"
        RARE{"Rarity < threshold?"}
        COMPETE["H3 competes to claim"]
        REPLICATE["H3 fetches via Bitswap"]
        STORE["H3 stores locally"]
    end

    H1 -->|"List()"| ASSET
    H2 -->|"List()"| ASSET
    H3 -->|"Rare()"| SCORE
    SCORE --> CLAIMS
    CLAIMS --> RARE
    RARE -->|Yes| COMPETE
    COMPETE --> REPLICATE --> STORE
    STORE -->|"Update claim"| CLAIMS
        `}
      />

      <p className="text-slate-700 mt-4 mb-4">
        Hoarder's rarity-based replication ensures that assets with fewer copies get replicated more aggressively.
        When a new asset is published (by Monkey after a build), Hoarder instances across the network
        assess its rarity. If it's below the target replication factor, instances compete to store it.
      </p>

      <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
        <h4 className="font-semibold text-teal-900 mb-2">📊 Convergence Model</h4>
        <p className="text-sm text-teal-800">
          The stash registry is eventually consistent. <code className="text-xs bg-teal-100 px-1 rounded">Rare()</code> and
          <code className="text-xs bg-teal-100 px-1 rounded">List()</code> are per-node views that may temporarily disagree.
          The system converges when all nodes have processed the fan-out claims. Tests must poll for
          convergence rather than expecting immediate consistency.
        </p>
      </div>
    </div>
  );
}
