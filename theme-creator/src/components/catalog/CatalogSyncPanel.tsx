import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Package } from 'lucide-react';

interface ComponentCatalogItem {
  id: string;
  name: string;
  description?: string;
  framework: string;
  category?: string;
  sourceFile?: string;
  props?: Array<{ name: string; type: string; description?: string }>;
  tokenBindings?: Record<string, string>;
  receivedAt?: string;
}

export function CatalogSyncPanel() {
  const [components, setComponents] = useState<ComponentCatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterFramework, setFilterFramework] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ComponentCatalogItem | null>(null);

  const fetchUpstreamComponents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sync/component-upstream');
      if (res.ok) {
        const data = await res.json() as { components?: ComponentCatalogItem[] };
        if (data.components) {
          setComponents(data.components);
          if (data.components.length > 0) {
            setSelectedItem((prev) => prev || data.components![0]);
          }
        }
      }
    } catch {
      // Offline or backend unavailable
    } finally {
      setLoading(false);
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchUpstreamComponents();
  }, [fetchUpstreamComponents]);

  const filteredComponents = components.filter(c => {
    if (filterFramework === 'all') return true;
    return c.framework === filterFramework;
  });

  return (
    <div className="panel-container catalog-sync-panel">
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package size={22} style={{ color: 'var(--accent)' }} />
          <h2 className="panel-title">Component Catalog Sync</h2>
        </div>
        <button
          type="button"
          className="icon-button"
          onClick={fetchUpstreamComponents}
          title="Refresh Catalog Proposals"
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? 'spin' : ''} />
        </button>
      </div>

      <p className="panel-description">
        Upstream component proposals from product repositories (CharMorph Compose & Blender Panels) synced via @ktheme/cli.
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          type="button"
          className={`filter-btn ${filterFramework === 'all' ? 'active' : ''}`}
          onClick={() => setFilterFramework('all')}
        >
          All ({components.length})
        </button>
        <button
          type="button"
          className={`filter-btn ${filterFramework === 'jetpack-compose' ? 'active' : ''}`}
          onClick={() => setFilterFramework('jetpack-compose')}
        >
          Compose
        </button>
        <button
          type="button"
          className={`filter-btn ${filterFramework === 'blender-python' ? 'active' : ''}`}
          onClick={() => setFilterFramework('blender-python')}
        >
          Blender UI
        </button>
      </div>

      {components.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>No upstream components proposed yet.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>
            Run <code>ktheme push</code> or Gradle/Python export tasks to upload component proposals.
          </p>
        </div>
      ) : (
        <div className="catalog-content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="catalog-list" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {filteredComponents.map(item => (
              <div
                key={item.id}
                className={`catalog-item-card ${selectedItem?.id === item.id ? 'selected' : ''}`}
                onClick={() => setSelectedItem(item)}
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  border: selectedItem?.id === item.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                  backgroundColor: selectedItem?.id === item.id ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{item.name}</strong>
                  <span className="badge" style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--border)' }}>
                    {item.framework}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {item.sourceFile || item.description}
                </div>
              </div>
            ))}
          </div>

          {selectedItem && (
            <div className="catalog-detail-panel" style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedItem.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '6px 0 12px 0' }}>
                {selectedItem.description}
              </p>

              <div style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
                <strong>Framework:</strong> <code>{selectedItem.framework}</code>
              </div>
              <div style={{ fontSize: '0.85rem', marginBottom: '12px' }}>
                <strong>Source:</strong> <code>{selectedItem.sourceFile || 'Local override'}</code>
              </div>

              {selectedItem.props && selectedItem.props.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>Props / Parameters:</div>
                  <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.8rem' }}>
                    {selectedItem.props.map((p, idx) => (
                      <li key={idx}>
                        <code>{p.name}</code>: <em>{p.type}</em>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedItem.tokenBindings && (
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>Token Bindings:</div>
                  <pre style={{ fontSize: '0.75rem', background: 'var(--bg-elevated)', padding: '8px', borderRadius: '4px', overflowX: 'auto' }}>
                    {JSON.stringify(selectedItem.tokenBindings, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
