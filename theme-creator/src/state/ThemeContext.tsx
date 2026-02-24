import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { KTheme, ThemePack } from '../types/theme.ts';
import { createDefaultTheme } from '../utils/theme-defaults.ts';

interface ThemeState {
  currentTheme: KTheme;
  savedThemes: KTheme[];
  themePacks: ThemePack[];
  isDirty: boolean;
}

type ThemeAction =
  | { type: 'SET_THEME'; payload: KTheme }
  | { type: 'UPDATE_THEME'; payload: Partial<KTheme> }
  | { type: 'UPDATE_COLOR'; payload: { key: string; value: string } }
  | { type: 'UPDATE_METADATA'; payload: Partial<KTheme['metadata']> }
  | { type: 'UPDATE_EFFECTS'; payload: Partial<KTheme['effects']> }
  | { type: 'UPDATE_TYPOGRAPHY'; payload: Partial<KTheme['typography']> }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SAVE_CURRENT' }
  | { type: 'DELETE_SAVED'; payload: string }
  | { type: 'LOAD_SAVED_THEMES'; payload: KTheme[] }
  | { type: 'ADD_THEME_PACK'; payload: ThemePack }
  | { type: 'LOAD_THEME_PACKS'; payload: ThemePack[] }
  | { type: 'NEW_THEME' };

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, currentTheme: action.payload, isDirty: false };

    case 'UPDATE_THEME':
      return {
        ...state,
        currentTheme: { ...state.currentTheme, ...action.payload },
        isDirty: true,
      };

    case 'UPDATE_COLOR':
      return {
        ...state,
        currentTheme: {
          ...state.currentTheme,
          colorScheme: {
            ...state.currentTheme.colorScheme,
            [action.payload.key]: action.payload.value,
          },
        },
        isDirty: true,
      };

    case 'UPDATE_METADATA':
      return {
        ...state,
        currentTheme: {
          ...state.currentTheme,
          metadata: { ...state.currentTheme.metadata, ...action.payload },
        },
        isDirty: true,
      };

    case 'UPDATE_EFFECTS':
      return {
        ...state,
        currentTheme: {
          ...state.currentTheme,
          effects: { ...state.currentTheme.effects, ...action.payload },
        },
        isDirty: true,
      };

    case 'UPDATE_TYPOGRAPHY':
      return {
        ...state,
        currentTheme: {
          ...state.currentTheme,
          typography: action.payload as KTheme['typography'],
        },
        isDirty: true,
      };

    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        currentTheme: {
          ...state.currentTheme,
          darkMode: !state.currentTheme.darkMode,
        },
        isDirty: true,
      };

    case 'SAVE_CURRENT': {
      const now = new Date().toISOString();
      const themeToSave = {
        ...state.currentTheme,
        metadata: { ...state.currentTheme.metadata, updatedAt: now },
      };
      const existing = state.savedThemes.findIndex(
        (t) => t.metadata.id === themeToSave.metadata.id
      );
      const updated = [...state.savedThemes];
      if (existing >= 0) {
        updated[existing] = themeToSave;
      } else {
        updated.push(themeToSave);
      }
      localStorage.setItem('ktheme-saved', JSON.stringify(updated));
      return { ...state, savedThemes: updated, currentTheme: themeToSave, isDirty: false };
    }

    case 'DELETE_SAVED': {
      const filtered = state.savedThemes.filter((t) => t.metadata.id !== action.payload);
      localStorage.setItem('ktheme-saved', JSON.stringify(filtered));
      return { ...state, savedThemes: filtered };
    }

    case 'LOAD_SAVED_THEMES':
      return { ...state, savedThemes: action.payload };

    case 'ADD_THEME_PACK': {
      const packs = [...state.themePacks, action.payload];
      localStorage.setItem('ktheme-packs', JSON.stringify(packs));
      return { ...state, themePacks: packs };
    }

    case 'LOAD_THEME_PACKS':
      return { ...state, themePacks: action.payload };

    case 'NEW_THEME':
      return { ...state, currentTheme: createDefaultTheme(), isDirty: false };

    default:
      return state;
  }
}

const initialState: ThemeState = {
  currentTheme: createDefaultTheme(),
  savedThemes: [],
  themePacks: [],
  isDirty: false,
};

const ThemeContext = createContext<{
  state: ThemeState;
  dispatch: React.Dispatch<ThemeAction>;
} | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(themeReducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('ktheme-saved');
      const packs = localStorage.getItem('ktheme-packs');
      return {
        ...init,
        savedThemes: saved ? JSON.parse(saved) : [],
        themePacks: packs ? JSON.parse(packs) : [],
      };
    } catch {
      return init;
    }
  });

  return <ThemeContext.Provider value={{ state, dispatch }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
