import React, { useState, useRef, useId, useCallback } from "react";

export interface TabItem<T extends string = string> {
  id: T;
  label?: string;
  disabled?: boolean;
}

export type TabInput<T extends string = string> = T | TabItem<T>;

export interface UseTablistOptions<T extends string = string> {
  tabs: readonly TabInput<T>[];
  activeTab?: T;
  defaultActiveTab?: T;
  onTabChange?: (tabId: T) => void;
  orientation?: "horizontal" | "vertical";
  labelPrefix?: string;
}

export interface TablistProps extends React.HTMLAttributes<HTMLElement> {
  role: "tablist";
  "aria-orientation": "horizontal" | "vertical";
}

export interface TabProps extends React.ButtonHTMLAttributes<HTMLElement> {
  role: "tab";
  id: string;
  "aria-selected": boolean;
  "aria-controls": string;
  tabIndex: number;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  ref: (node: HTMLElement | null) => void;
}

export interface PanelProps extends React.HTMLAttributes<HTMLElement> {
  role: "tabpanel";
  id: string;
  "aria-labelledby": string;
  tabIndex: number;
  hidden: boolean;
}

export interface UseTablistReturn<T extends string = string> {
  activeTab: T;
  setActiveTab: (tabId: T) => void;
  getTablistProps: <P extends React.HTMLAttributes<HTMLElement>>(userProps?: P) => P & TablistProps;
  getTabProps: <P extends React.ButtonHTMLAttributes<HTMLElement>>(
    tabId: T,
    index?: number,
    userProps?: P
  ) => P & TabProps;
  getPanelProps: <P extends React.HTMLAttributes<HTMLElement>>(
    tabId?: T,
    userProps?: P
  ) => P & PanelProps;
}

export function useTablist<T extends string = string>({
  tabs,
  activeTab: controlledActiveTab,
  defaultActiveTab,
  onTabChange,
  orientation = "horizontal",
  labelPrefix,
}: UseTablistOptions<T>): UseTablistReturn<T> {
  const generatedId = useId();
  const prefix = labelPrefix || `ktheme-tab-${generatedId.replace(/:/g, "")}`;

  // Normalize tabs
  const normalizedTabs = tabs.map((tab) => {
    if (typeof tab === "string") {
      return { id: tab as T, disabled: false };
    }
    return {
      id: tab.id,
      label: tab.label,
      disabled: !!tab.disabled,
    };
  });

  const initialTab =
    defaultActiveTab ||
    normalizedTabs.find((t) => !t.disabled)?.id ||
    normalizedTabs[0]?.id ||
    ("" as T);

  const [internalActiveTab, setInternalActiveTab] = useState<T>(initialTab);

  const isControlled = controlledActiveTab !== undefined;
  const currentActiveTab = isControlled ? controlledActiveTab : internalActiveTab;

  const tabRefs = useRef<Map<T, HTMLElement | null>>(new Map());

  const handleSelectTab = useCallback(
    (tabId: T) => {
      const tabObj = normalizedTabs.find((t) => t.id === tabId);
      if (tabObj?.disabled) return;

      if (!isControlled) {
        setInternalActiveTab(tabId);
      }
      onTabChange?.(tabId);
    },
    [isControlled, normalizedTabs, onTabChange]
  );

  const focusTab = useCallback((tabId: T) => {
    const el = tabRefs.current.get(tabId);
    if (el) {
      el.focus();
    }
  }, []);

  const getTabId = useCallback(
    (tabId: T) => `${prefix}-tab-${tabId}`,
    [prefix]
  );

  const getPanelId = useCallback(
    (tabId: T) => `${prefix}-panel-${tabId}`,
    [prefix]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>, currentId: T) => {
      const enabledTabs = normalizedTabs.filter((t) => !t.disabled);
      if (enabledTabs.length === 0) return;

      const currentIndex = enabledTabs.findIndex((t) => t.id === currentId);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          nextIndex = (currentIndex + 1) % enabledTabs.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = enabledTabs.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      const targetTab = enabledTabs[nextIndex];
      if (targetTab && targetTab.id !== currentId) {
        handleSelectTab(targetTab.id);
        focusTab(targetTab.id);
      }
    },
    [normalizedTabs, handleSelectTab, focusTab]
  );

  const getTablistProps = useCallback(
    <P extends React.HTMLAttributes<HTMLElement>>(userProps?: P): P & TablistProps => {
      return {
        ...userProps,
        role: "tablist",
        "aria-orientation": orientation,
      } as P & TablistProps;
    },
    [orientation]
  );

  const getTabProps = useCallback(
    <P extends React.ButtonHTMLAttributes<HTMLElement>>(
      tabId: T,
      _index?: number,
      userProps?: P
    ): P & TabProps => {
      const isSelected = currentActiveTab === tabId;
      const tabObj = normalizedTabs.find((t) => t.id === tabId);
      const isDisabled = tabObj?.disabled ?? false;

      const onClick = (e: React.MouseEvent<HTMLElement>) => {
        if (userProps && "onClick" in userProps && typeof userProps.onClick === "function") {
          (userProps.onClick as (e: React.MouseEvent<HTMLElement>) => void)(e);
        }
        if (!e.defaultPrevented && !isDisabled) {
          handleSelectTab(tabId);
        }
      };

      const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (userProps && "onKeyDown" in userProps && typeof userProps.onKeyDown === "function") {
          (userProps.onKeyDown as (e: React.KeyboardEvent<HTMLElement>) => void)(e);
        }
        if (!e.defaultPrevented) {
          handleKeyDown(e, tabId);
        }
      };

      const ref = (node: HTMLElement | null) => {
        if (node) {
          tabRefs.current.set(tabId, node);
        } else {
          tabRefs.current.delete(tabId);
        }
        const userRef = userProps && "ref" in userProps ? (userProps as { ref?: unknown }).ref : undefined;
        if (typeof userRef === "function") {
          userRef(node);
        } else if (userRef && typeof userRef === "object" && "current" in userRef) {
          (userRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      };

      return {
        disabled: isDisabled,
        ...userProps,
        role: "tab",
        id: getTabId(tabId),
        "aria-selected": isSelected,
        "aria-controls": getPanelId(tabId),
        tabIndex: isSelected ? 0 : -1,
        onClick,
        onKeyDown,
        ref,
      } as P & TabProps;
    },
    [currentActiveTab, normalizedTabs, getTabId, getPanelId, handleSelectTab, handleKeyDown]
  );

  const getPanelProps = useCallback(
    <P extends React.HTMLAttributes<HTMLElement>>(
      tabId?: T,
      userProps?: P
    ): P & PanelProps => {
      const targetId = tabId ?? currentActiveTab;
      const isSelected = currentActiveTab === targetId;

      return {
        ...userProps,
        role: "tabpanel",
        id: getPanelId(targetId),
        "aria-labelledby": getTabId(targetId),
        tabIndex: 0,
        hidden: !isSelected,
      } as P & PanelProps;
    },
    [currentActiveTab, getPanelId, getTabId]
  );

  return {
    activeTab: currentActiveTab,
    setActiveTab: handleSelectTab,
    getTablistProps,
    getTabProps,
    getPanelProps,
  };
}
