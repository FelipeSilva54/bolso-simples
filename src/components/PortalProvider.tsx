import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react';
import { StyleSheet, View } from 'react-native';

type PortalCtx = {
  update: (id: string, node: React.ReactNode) => void;
  unmount: (id: string) => void;
};

type PortalStore = {
  portals: Map<string, React.ReactNode>;
  listeners: Set<() => void>;
};

const Ctx = createContext<PortalCtx>({ update: () => {}, unmount: () => {} });

export function usePortal() {
  return useContext(Ctx);
}

export function Portal({ id, children }: { id: string; children: React.ReactNode }) {
  const { update, unmount } = usePortal();

  // Sync portal content on every render — intentionally no deps array.
  // This only re-renders the (sibling) PortalOutlet, never this subtree,
  // so it cannot trigger an update loop.
  useLayoutEffect(() => { update(id, children); });

  // Unmount the portal entry only when this component unmounts; `id` is stable.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => unmount(id), []);

  return null;
}

export function PortalHost({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<PortalStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = { portals: new Map(), listeners: new Set() };
  }
  const store = storeRef.current;

  const value = useMemo<PortalCtx>(() => {
    const emit = () => {
      store.listeners.forEach((listener) => listener());
    };
    return {
      update: (id, node) => {
        store.portals = new Map(store.portals).set(id, node);
        emit();
      },
      unmount: (id) => {
        const next = new Map(store.portals);
        next.delete(id);
        store.portals = next;
        emit();
      },
    };
  }, [store]);

  return (
    <Ctx.Provider value={value}>
      <View style={{ flex: 1 }}>
        {children}
        <PortalOutlet store={store} />
      </View>
    </Ctx.Provider>
  );
}

function PortalOutlet({ store }: { store: PortalStore }) {
  const subscribe = useCallback(
    (listener: () => void) => {
      store.listeners.add(listener);
      return () => {
        store.listeners.delete(listener);
      };
    },
    [store],
  );

  const portals = useSyncExternalStore(subscribe, () => store.portals);

  return (
    <>
      {[...portals.entries()].map(([id, node]) => (
        <View key={id} style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {node}
        </View>
      ))}
    </>
  );
}
