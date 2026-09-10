interface Props {
  MermaidDiagram: React.FC<{ chart: string; id: string }>;
}

export function DreamSection({ MermaidDiagram }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4">9. Dream — Local Development Environment</h2>
      <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-8" />

      <p className="text-lg text-slate-700 leading-relaxed mb-6">
        Dream is Tau's local development environment — a complete cloud running on your laptop.
        It embodies the core principle: "Local Development = Global Production." The same code,
        the same services, the same runtime — just on a smaller scale.
      </p>

      <MermaidDiagram
        id="dream-arch"
        chart={`
graph TB
    subgraph "Dream Universe (Your Laptop)"
        subgraph "Node 1"
            SEER["Seer"]
        end
        subgraph "Node 2"
            TNS["TNS"]
        end
        subgraph "Node 3"
            AUTH["Auth"]
        end
        subgraph "Node 4"
            PAT["Patrick"]
        end
        subgraph "Node 5"
            MON["Monkey"]
        end
        subgraph "Node 6"
            SUB["Substrate"]
        end
        subgraph "Node 7"
            HOAR["Hoarder"]
        end
        subgraph "Node 8"
            GW["Gateway"]
        end
    end

    SEER <-->|"P2P"| TNS
    TNS <-->|"P2P"| AUTH
    AUTH <-->|"P2P"| PAT
    PAT <-->|"P2P"| MON
    MON <-->|"P2P"| SUB
    SUB <-->|"P2P"| HOAR
    HOAR <-->|"P2P"| GW
    GW <-->|"P2P"| SEER

    DEV["Developer"] -->|"HTTP :8080"| GW
    DEV -->|"Console :4000"| SEER
        `}
      />

      <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Dream Architecture vs Production</h3>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 font-semibold border-b border-slate-200">Aspect</th>
              <th className="text-left p-3 font-semibold border-b border-slate-200">Dream (Dev)</th>
              <th className="text-left p-3 font-semibold border-b border-slate-200">Production</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Nodes</td>
              <td className="p-3 text-slate-600">1 service per node (8 nodes)</td>
              <td className="p-3 text-slate-600">Multiple services per node (shapes)</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Network</td>
              <td className="p-3 text-slate-600">Localhost P2P</td>
              <td className="p-3 text-slate-600">Internet P2P + relay</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">DNS</td>
              <td className="p-3 text-slate-600">.gq test domains</td>
              <td className="p-3 text-slate-600">Real domains + Let's Encrypt</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Auth</td>
              <td className="p-3 text-slate-600">Simplified (no accounts service)</td>
              <td className="p-3 text-slate-600">Full identity + Git integration</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">NetGuard</td>
              <td className="p-3 text-slate-600">Disabled (dev mode)</td>
              <td className="p-3 text-slate-600">Active (nftables + cgroups)</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Persistence</td>
              <td className="p-3 text-slate-600">Ephemeral (restart = clean)</td>
              <td className="p-3 text-slate-600">Persistent storage</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">Dream API</h3>
      <p className="text-slate-700 mb-4">
        Dream provides a programmatic API for creating test universes. This is used extensively
        in Tau's own test suite. The <code className="bg-slate-200 px-1.5 py-0.5 rounded text-sm">dream/</code> package
        contains:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">Universe</h4>
          <p className="text-sm text-slate-700">
            A complete cloud instance. You can create nodes, add services, inject fixtures,
            and query service instances. <code className="text-xs bg-purple-100 px-1 rounded">Universe.ServiceInstance(name)</code>
            returns any registered service by name.
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">Fixtures</h4>
          <p className="text-sm text-slate-700">
            Pre-built test data (projects, functions, configurations) that can be injected
            into a universe. Tests use fixtures to set up known states without manual configuration.
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">Simple Mode</h4>
          <p className="text-sm text-slate-700">
            One-line universe creation with default settings. <code className="text-xs bg-purple-100 px-1 rounded">dream.New().Simple()</code>
            creates a universe with all services running — perfect for quick integration tests.
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">DREAM_PKGS</h4>
          <p className="text-sm text-slate-700">
            Environment variable that controls which packages are tested in dream mode.
            Packages whose tests are all tagged for another build are skipped automatically.
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">Testing with Dream</h3>
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm overflow-x-auto mb-6">{`// Example: Integration test using Dream
func TestMyService_Dreaming(t *testing.T) {
    // Create a universe with all services
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
    require.NoError(t, err)
    defer u.Stop()

    // Get a service client
    tns := u.Tns()
    
    // Inject test fixtures
    err = u.RunFixture("create_project", "my-project")
    require.NoError(t, err)

    // Test your functionality
    config, err := tns.Fetch(...)
    require.NoError(t, err)
    assert.NotNil(t, config)
}`}</pre>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
        <h4 className="font-semibold text-purple-900 mb-2">💭 Why "Dream"?</h4>
        <p className="text-sm text-purple-800">
          Dream represents the ideal state — a perfect local mirror of production. When you're "dreaming,"
          you're in a sandboxed universe where everything works exactly like production, but nothing
          affects the real world. It's where ideas become reality before deployment.
        </p>
      </div>
    </div>
  );
}
