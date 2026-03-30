import { useEffect, useId, useRef, useState } from 'react';
import { Send, Key, Loader, Download, X } from 'lucide-react';
import { useTheme } from '../../state/ThemeContext.tsx';
import {
  createAISession,
  revokeAISession,
  sendAIMessage,
  sendGeminiMultimodalMessage,
  extractThemeFromResponse,
  type AIMessage,
  type AIRedesignPlan,
  type AIProvider,
  type AISession,
} from '../../services/ai.ts';

export function AIDesigner() {
  const { dispatch } = useTheme();
  const [apiKey, setApiKey] = useState('');
  const [session, setSession] = useState<AISession | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<AIProvider>('claude');
  const scrollRef = useRef<HTMLDivElement>(null);
  const providerSelectId = useId();
  const promptInputId = useId();
  const apiKeyInputId = useId();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function startSecureSession() {
    if (!apiKey.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      const nextSession = await createAISession(provider, apiKey.trim());
      setSession(nextSession);
      setProvider(nextSession.provider);
      setApiKey('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start session');
    } finally {
      setIsLoading(false);
    }
  }

  async function clearSession() {
    if (session?.sessionToken) {
      await revokeAISession(session.sessionToken).catch(() => undefined);
    }
    setSession(null);
    setApiKey('');
  }

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMsg: AIMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      if (!session?.sessionToken) throw new Error('Secure AI session has expired. Reconnect your key.');

      const response = provider === 'claude'
        ? await sendAIMessage(newMessages, session.sessionToken)
        : await sendGeminiMultimodalMessage(newMessages[newMessages.length - 1].content, session.sessionToken);
      const assistantMsg: AIMessage = { role: 'assistant', content: response };
      setMessages([...newMessages, assistantMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setIsLoading(false);
    }
  }

  function loadThemeFromMessage(content: string) {
    const parsed = extractThemeFromResponse(content);
    if (parsed?.theme) {
      dispatch({ type: 'SET_THEME', payload: parsed.theme });
    }
  }

  if (!session) {
    return (
      <div className="panel ai-panel">
        <section className="ai-key-setup" aria-labelledby="ai-key-heading">
          <Key size={48} className="ai-key-icon" aria-hidden="true" focusable="false" />
          <h2 id="ai-key-heading">Secure AI Session Required</h2>
          <p>
            Enter your provider key to open a short-lived server session. Your raw key is never stored in browser storage,
            and the client only keeps an expiring session token in memory.
          </p>
          <div className="ai-key-input-row">
            <label htmlFor={apiKeyInputId} className="sr-only">API key</label>
            <input
              id={apiKeyInputId}
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              onKeyDown={(e) => e.key === 'Enter' && startSecureSession()}
            />
            <button className="btn btn-primary" type="button" onClick={startSecureSession} disabled={isLoading}>
              {isLoading ? 'Connecting…' : 'Start Secure Session'}
            </button>
          </div>
          <div className="ai-key-input-row">
            <label htmlFor={providerSelectId} className="sr-only">Model provider</label>
            <select
              id={providerSelectId}
              className="ai-provider-select"
              value={provider}
              onChange={(e) => setProvider(e.target.value as AIProvider)}
              title="Choose model provider"
            >
              <option value="claude">Claude</option>
              <option value="gemini">Gemini 2.5 Pro</option>
            </select>
          </div>
          <p className="ai-key-hint">
            Session tokens expire automatically and are rate-limited server-side for safer usage.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="panel ai-panel">
      <div className="ai-header">
        <h2>AI Theme Designer</h2>
        <div className="ai-header-actions">
          <label htmlFor={providerSelectId} className="sr-only">Model provider</label>
          <select
            id={providerSelectId}
            className="ai-provider-select"
            value={provider}
            onChange={(e) => setProvider(e.target.value as AIProvider)}
            title="Choose model provider"
            disabled
          >
            <option value="claude">Claude</option>
            <option value="gemini">Gemini 2.5 Pro</option>
          </select>
          <span className="ai-key-hint">End session to switch provider</span>
          <button
            className="btn-icon"
            type="button"
            onClick={clearSession}
            title="End secure session"
            aria-label="End secure session"
          >
            <Key size={16} aria-hidden="true" focusable="false" />
            <X size={12} className="btn-icon-overlay" aria-hidden="true" focusable="false" />
          </button>
        </div>
      </div>

      <div className="ai-messages" ref={scrollRef} role="log" aria-live="polite" aria-relevant="additions text">
        {messages.length === 0 && (
          <div className="ai-welcome">
            <p>Describe the theme you want and I'll design it for you. Provider keys stay on the backend proxy.</p>
            <div className="ai-suggestions">
              {[
                'Create a cyberpunk neon theme with electric blue and magenta',
                'Design a calm forest theme with earthy greens and wood tones',
                'Make a retro synthwave theme with purple gradients and pink accents',
                'Create an elegant dark theme inspired by Art Deco gold and black',
                'Art Nouveau app redesign with nature-inspired curves and refined typography',
                'Art Deco app redesign with symmetry, geometric ornament, and premium contrast',
              ].map((s) => (
                <button
                  key={s}
                  className="ai-suggestion-chip"
                  type="button"
                  onClick={() => setInput(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`ai-message ${msg.role}`}>
            <div className="ai-message-header">
              {msg.role === 'user' ? 'You' : 'Ktheme AI'}
            </div>
            <div className="ai-message-content">
              {msg.role === 'assistant' ? (
                <>
                  <MessageContent text={msg.content} />
                  <ThemeActions content={msg.content} onLoad={loadThemeFromMessage} />
                </>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="ai-message assistant">
            <div className="ai-message-header">Ktheme AI</div>
            <div className="ai-message-content ai-loading">
              <Loader size={16} className="spin" aria-hidden="true" focusable="false" />
              Designing your theme...
            </div>
          </div>
        )}
      </div>

      {error && <div className="ai-error" role="alert">{error}</div>}

      <div className="ai-input-row">
        <label htmlFor={promptInputId} className="sr-only">Theme request</label>
        <input
          id={promptInputId}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your ideal theme..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleSend}
          disabled={isLoading}
          aria-label="Send prompt"
        >
          <Send size={16} aria-hidden="true" focusable="false" />
        </button>
      </div>
    </div>
  );
}

function ThemeActions({
  content,
  onLoad,
}: {
  content: string;
  onLoad: (content: string) => void;
}) {
  const parsed = extractThemeFromResponse(content);
  if (!parsed) return null;

  return (
    <>
      {parsed.redesignPlan && <RedesignPlanView redesignPlan={parsed.redesignPlan} />}
      <button className="btn btn-primary ai-load-btn" type="button" onClick={() => onLoad(content)}>
        <Download size={16} aria-hidden="true" focusable="false" />
        Load This Theme
      </button>
    </>
  );
}

function RedesignPlanView({ redesignPlan }: { redesignPlan: AIRedesignPlan }) {
  return (
    <div className="ai-redesign-plan">
      <p><strong>Redesign Plan</strong></p>
      <p>Layout density: {redesignPlan.layoutDensity}</p>
      <p>Corner strategy: {redesignPlan.cornerStrategy}</p>
      <p>Navigation model: {redesignPlan.navModel}</p>
      <p>Icon style: {redesignPlan.iconStyle}</p>
      <p>Component overrides:</p>
      <ul>
        {redesignPlan.componentOverrides.map((override) => (
          <li key={override}>{override}</li>
        ))}
      </ul>
    </div>
  );
}

function MessageContent({ text }: { text: string }) {
  const parts = text.split(/(```json[\s\S]*?```)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('```json')) {
          const code = part.replace(/```json\s*/, '').replace(/```$/, '');
          return (
            <pre key={i} className="ai-code-block">
              <code>{code}</code>
            </pre>
          );
        }
        return part
          .split('\n')
          .filter(Boolean)
          .map((line, j) => <p key={`${i}-${j}`}>{line}</p>);
      })}
    </>
  );
}
