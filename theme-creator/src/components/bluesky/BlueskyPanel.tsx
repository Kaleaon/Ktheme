import { useState, useEffect } from 'react';
import { LogIn, LogOut, Upload, RefreshCw, Loader, Download, Package } from 'lucide-react';
import { useBluesky } from '../../state/BlueskyContext.tsx';
import { useTheme } from '../../state/ThemeContext.tsx';
import { shareTheme, shareThemePack, fetchSharedThemes, fetchUserThemes } from '../../services/bluesky-themes.ts';
import type { KTheme } from '../../types/theme.ts';

type SubTab = 'community' | 'my-themes' | 'share';

export function BlueskyPanel() {
  const bsky = useBluesky();
  const { state, dispatch } = useTheme();

  const [subTab, setSubTab] = useState<SubTab>('community');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [communityThemes, setCommunityThemes] = useState<KTheme[]>([]);
  const [myThemes, setMyThemes] = useState<KTheme[]>([]);
  const [isLoadingThemes, setIsLoadingThemes] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  // Auto-resume session on mount
  useEffect(() => {
    bsky.resumeSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin() {
    if (!identifier || !password) return;
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      await bsky.login(identifier, password);
      setPassword('');
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function loadCommunityThemes() {
    if (!bsky.agent) return;
    setIsLoadingThemes(true);
    try {
      const themes = await fetchSharedThemes(bsky.agent);
      setCommunityThemes(themes);
    } catch {
      // silent
    } finally {
      setIsLoadingThemes(false);
    }
  }

  async function loadMyThemes() {
    if (!bsky.agent) return;
    setIsLoadingThemes(true);
    try {
      const themes = await fetchUserThemes(bsky.agent);
      setMyThemes(themes);
    } catch {
      // silent
    } finally {
      setIsLoadingThemes(false);
    }
  }

  async function handleShareTheme() {
    if (!bsky.agent) return;
    setIsSharing(true);
    setShareStatus(null);
    try {
      const uri = await shareTheme(bsky.agent, state.currentTheme);
      setShareStatus(`Shared! Post: ${uri}`);
    } catch (err) {
      setShareStatus(`Error: ${err instanceof Error ? err.message : 'Failed'}`);
    } finally {
      setIsSharing(false);
    }
  }

  async function handleSharePack() {
    if (!bsky.agent || state.savedThemes.length === 0) return;
    setIsSharing(true);
    setShareStatus(null);
    try {
      const pack = {
        id: crypto.randomUUID(),
        name: `${bsky.profile?.displayName || bsky.profile?.handle}'s Theme Pack`,
        description: `A collection of ${state.savedThemes.length} themes`,
        author: bsky.profile?.handle || 'Unknown',
        themes: state.savedThemes,
        createdAt: new Date().toISOString(),
      };
      const uri = await shareThemePack(bsky.agent, pack);
      setShareStatus(`Pack shared! Post: ${uri}`);
    } catch (err) {
      setShareStatus(`Error: ${err instanceof Error ? err.message : 'Failed'}`);
    } finally {
      setIsSharing(false);
    }
  }

  function loadTheme(theme: KTheme) {
    dispatch({ type: 'SET_THEME', payload: theme });
  }

  // Not logged in
  if (!bsky.profile) {
    return (
      <div className="panel bsky-panel">
        <div className="bsky-login-card">
          <div className="bsky-logo">
            <svg viewBox="0 0 568 501" width="48" height="48">
              <path
                fill="currentColor"
                d="M123.121 33.6637C188.241 82.5526 258.281 181.681 284 234.873C309.719 181.681 379.759 82.5526 444.879 33.6637C491.866 -1.61183 568 -28.9064 568 57.9464C568 75.2916 558.055 203.659 552.222 224.501C531.947 296.954 458.067 315.434 392.347 304.249C507.222 323.8 536.444 388.56 473.333 453.32C353.473 576.312 301.061 422.461 287.631 googl383.039C285.169 375.064 284.017 371.468 284 373.899C283.983 371.468 282.831 375.064 280.369 383.039C266.939 422.461 214.527 576.312 94.6667 453.32C31.5556 388.56 60.7778 323.8 175.653 304.249C109.933 315.434 36.0533 296.954 15.7778 224.501C9.94467 203.659 0 75.2916 0 57.9464C0 -28.9064 76.1345 -1.61183 123.121 33.6637Z"
              />
            </svg>
          </div>
          <h3>Connect to Bluesky</h3>
          <p>Log in to share themes and discover community theme packs on Bluesky.</p>

          {loginError && <div className="bsky-error">{loginError}</div>}

          <label className="form-field">
            <span className="field-label">Handle or Email</span>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="user.bsky.social"
            />
          </label>
          <label className="form-field">
            <span className="field-label">App Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="xxxx-xxxx-xxxx-xxxx"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </label>
          <p className="bsky-hint">
            Use an App Password from your Bluesky settings for security.
          </p>
          <button className="btn btn-primary" onClick={handleLogin} disabled={isLoggingIn}>
            {isLoggingIn ? <Loader size={16} className="spin" /> : <LogIn size={16} />}
            Log In
          </button>
        </div>
      </div>
    );
  }

  // Logged in
  return (
    <div className="panel bsky-panel">
      {/* Profile header */}
      <div className="bsky-profile-bar">
        <div className="bsky-profile-info">
          {bsky.profile.avatar && (
            <img src={bsky.profile.avatar} alt="" className="bsky-avatar" />
          )}
          <div>
            <strong>{bsky.profile.displayName || bsky.profile.handle}</strong>
            <span className="bsky-handle">@{bsky.profile.handle}</span>
          </div>
        </div>
        <button className="btn-icon" onClick={bsky.logout} title="Log out">
          <LogOut size={16} />
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="bsky-tabs">
        <button className={`bsky-tab ${subTab === 'community' ? 'active' : ''}`} onClick={() => { setSubTab('community'); loadCommunityThemes(); }}>
          Community
        </button>
        <button className={`bsky-tab ${subTab === 'my-themes' ? 'active' : ''}`} onClick={() => { setSubTab('my-themes'); loadMyThemes(); }}>
          My Themes
        </button>
        <button className={`bsky-tab ${subTab === 'share' ? 'active' : ''}`} onClick={() => setSubTab('share')}>
          Share
        </button>
      </div>

      <div className="bsky-content">
        {subTab === 'community' && (
          <>
            <div className="bsky-section-header">
              <h4>Community Themes</h4>
              <button className="btn-icon" onClick={loadCommunityThemes} disabled={isLoadingThemes}>
                {isLoadingThemes ? <Loader size={16} className="spin" /> : <RefreshCw size={16} />}
              </button>
            </div>
            {communityThemes.length === 0 && !isLoadingThemes && (
              <p className="bsky-empty">No community themes found yet. Be the first to share one!</p>
            )}
            <div className="theme-grid">
              {communityThemes.map((t) => (
                <ThemeCard key={t.metadata.id} theme={t} onLoad={loadTheme} />
              ))}
            </div>
          </>
        )}

        {subTab === 'my-themes' && (
          <>
            <div className="bsky-section-header">
              <h4>My Shared Themes</h4>
              <button className="btn-icon" onClick={loadMyThemes} disabled={isLoadingThemes}>
                {isLoadingThemes ? <Loader size={16} className="spin" /> : <RefreshCw size={16} />}
              </button>
            </div>
            {myThemes.length === 0 && !isLoadingThemes && (
              <p className="bsky-empty">You haven't shared any themes yet.</p>
            )}
            <div className="theme-grid">
              {myThemes.map((t) => (
                <ThemeCard key={t.metadata.id} theme={t} onLoad={loadTheme} />
              ))}
            </div>
          </>
        )}

        {subTab === 'share' && (
          <div className="bsky-share-section">
            <div className="share-card">
              <h4>Share Current Theme</h4>
              <p>Post "{state.currentTheme.metadata.name}" to Bluesky so others can discover and use it.</p>
              <button className="btn btn-primary" onClick={handleShareTheme} disabled={isSharing}>
                {isSharing ? <Loader size={16} className="spin" /> : <Upload size={16} />}
                Share Theme
              </button>
            </div>

            {state.savedThemes.length > 0 && (
              <div className="share-card">
                <h4>Share Theme Pack</h4>
                <p>Share all {state.savedThemes.length} saved themes as a theme pack.</p>
                <button className="btn btn-secondary" onClick={handleSharePack} disabled={isSharing}>
                  {isSharing ? <Loader size={16} className="spin" /> : <Package size={16} />}
                  Share Pack ({state.savedThemes.length} themes)
                </button>
              </div>
            )}

            {shareStatus && (
              <div className={`bsky-status ${shareStatus.startsWith('Error') ? 'error' : 'success'}`}>
                {shareStatus}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ThemeCard({ theme, onLoad }: { theme: KTheme; onLoad: (t: KTheme) => void }) {
  const c = theme.colorScheme;
  return (
    <div className="theme-card">
      <div className="theme-card-preview">
        <div className="theme-card-swatches">
          <div style={{ background: c.primary }} />
          <div style={{ background: c.secondary }} />
          <div style={{ background: c.tertiary }} />
          <div style={{ background: c.background }} />
        </div>
      </div>
      <div className="theme-card-info">
        <strong>{theme.metadata.name}</strong>
        <span className="theme-card-author">by {theme.metadata.author || 'Unknown'}</span>
      </div>
      <button className="btn btn-sm" onClick={() => onLoad(theme)}>
        <Download size={14} /> Load
      </button>
    </div>
  );
}
