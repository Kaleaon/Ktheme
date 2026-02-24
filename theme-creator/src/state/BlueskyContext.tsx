import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { BskyAgent } from '@atproto/api';

interface BlueskyProfile {
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
}

interface BlueskyState {
  agent: BskyAgent | null;
  profile: BlueskyProfile | null;
  isLoading: boolean;
  error: string | null;
}

interface BlueskyContextValue extends BlueskyState {
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  resumeSession: () => Promise<boolean>;
}

const BlueskyContext = createContext<BlueskyContextValue | null>(null);

const SESSION_KEY = 'ktheme-bsky-session';

export function BlueskyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BlueskyState>({
    agent: null,
    profile: null,
    isLoading: false,
    error: null,
  });

  const login = useCallback(async (identifier: string, password: string) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const agent = new BskyAgent({ service: 'https://bsky.social' });
      const res = await agent.login({ identifier, password });

      const profileRes = await agent.getProfile({ actor: res.data.did });

      const profile: BlueskyProfile = {
        did: res.data.did,
        handle: res.data.handle,
        displayName: profileRes.data.displayName,
        avatar: profileRes.data.avatar,
      };

      // Store session for resume
      if (agent.session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(agent.session));
      }

      setState({ agent, profile, isLoading: false, error: null });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setState((s) => ({ ...s, isLoading: false, error: msg }));
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setState({ agent: null, profile: null, isLoading: false, error: null });
  }, []);

  const resumeSession = useCallback(async (): Promise<boolean> => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return false;

    setState((s) => ({ ...s, isLoading: true }));
    try {
      const session = JSON.parse(stored);
      const agent = new BskyAgent({ service: 'https://bsky.social' });
      await agent.resumeSession(session);

      if (!agent.session) throw new Error('Session resume failed');

      const profileRes = await agent.getProfile({ actor: agent.session.did });
      const profile: BlueskyProfile = {
        did: agent.session.did,
        handle: agent.session.handle,
        displayName: profileRes.data.displayName,
        avatar: profileRes.data.avatar,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(agent.session));
      setState({ agent, profile, isLoading: false, error: null });
      return true;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      setState({ agent: null, profile: null, isLoading: false, error: null });
      return false;
    }
  }, []);

  return (
    <BlueskyContext.Provider value={{ ...state, login, logout, resumeSession }}>
      {children}
    </BlueskyContext.Provider>
  );
}

export function useBluesky() {
  const ctx = useContext(BlueskyContext);
  if (!ctx) throw new Error('useBluesky must be used within BlueskyProvider');
  return ctx;
}
