import { useState, useRef, useEffect } from 'react';
import { Send, Key, Loader, Download, X } from 'lucide-react';
import { useTheme } from '../../state/ThemeContext.tsx';
import {
  sendAIMessage,
  sendGeminiMultimodalMessage,
  extractThemeFromResponse,
  getStoredApiKey,
  setStoredApiKey,
  clearStoredApiKey,
  type AIMessage,
  type AIRedesignPlan,
} from '../../services/ai.ts';

export function AIDesigner() {
  const { dispatch } = useTheme();
  const [apiKey, setApiKey] = useState(getStoredApiKey() || '');
  const [keyConfigured, setKeyConfigured] = useState(!!getStoredApiKey());
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<'claude' | 'gemini'>('claude');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  function saveKey() {
    if (apiKey.trim()) {
      setStoredApiKey(apiKey.trim());
      setKeyConfigured(true);
      setError(null);
    }
  }

  function removeKey() {
    clearStoredApiKey();
    setApiKey('');
    setKeyConfigured(false);
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
      const stored = getStoredApiKey();
      if (!stored) throw new Error('API key not configured');

      const response = provider === 'claude'
        ? await sendAIMessage(newMessages, stored)
        : await sendGeminiMultimodalMessage(newMessages[newMessages.length - 1].content, stored);
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

  if (!keyConfigured) {
    return (
      <div className="panel ai-panel">
        <div className="ai-key-setup">
          <Key size={48} className="ai-key-icon" />
          <h3>API Key Required</h3>
          <p>
            Enter your model API key to use the AI theme designer (Claude or Gemini).
            Your key is stored locally in your browser and never sent to any server other than the selected model API.
          </p>
          <div className="ai-key-input-row">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              onKeyDown={(e) => e.key === 'Enter' && saveKey()}
            />
            <button className="btn btn-primary" onClick={saveKey}>
              Save Key
            </button>
          </div>
          <p className="ai-key-hint">
            Get API keys from{' '}
            <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer">
              Anthropic
            </a>
            {' '}or{' '}
            <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer">
              Google AI Studio
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel ai-panel">
      <div className="ai-header">
        <h3>AI Theme Designer</h3>
        <div className="ai-header-actions">
          <select
            className="ai-provider-select"
            value={provider}
            onChange={(e) => setProvider(e.target.value as 'claude' | 'gemini')}
            title="Choose model provider"
          >
            <option value="claude">Claude</option>
            <option value="gemini">Gemini 2.5 Pro</option>
          </select>
          <button className="btn-icon" onClick={removeKey} title="Remove API key">
            <Key size={16} />
            <X size={12} className="btn-icon-overlay" />
          </button>
        </div>
      </div>

      <div className="ai-messages" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="ai-welcome">
            <p>Describe the theme you want and I'll design it for you.</p>
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
              <Loader size={16} className="spin" />
              Designing your theme...
            </div>
          </div>
        )}
      </div>

      {error && <div className="ai-error">{error}</div>}

      <div className="ai-input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your ideal theme..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <button className="btn btn-primary" onClick={handleSend} disabled={isLoading}>
          <Send size={16} />
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
      <button className="btn btn-primary ai-load-btn" onClick={() => onLoad(content)}>
        <Download size={16} />
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
  // Split on ```json...``` blocks and render them as styled code
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
