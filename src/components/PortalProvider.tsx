import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';

type PortalCtx = {
  update: (id: string, node: React.ReactNode) => void;
  unmount: (id: string) => void;
};

const Ctx = createContext<PortalCtx>({ update: () => {}, unmount: () => {} });

export function usePortal() {
  return useContext(Ctx);
}

export function Portal({ id, children }: { id: string; children: React.ReactNode }) {
  const { update, unmount } = usePortal();

  // Sync portal content on every render — intentionally no deps array.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => { update(id, children); });

  useEffect(() => () => unmount(id), []);

  return null;
}

export function PortalHost({ children }: { children: React.ReactNode }) {
  const [portals, setPortals] = useState<Map<string, React.ReactNode>>(new Map());

  const update = useCallback((id: string, node: React.ReactNode) => {
    setPortals(prev => new Map(prev).set(id, node));
  }, []);

  const unmount = useCallback((id: string) => {
    setPortals(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{ update, unmount }}>
      <View style={{ flex: 1 }}>
        {children}
        {[...portals.entries()].map(([id, node]) => (
          <View key={id} style={StyleSheet.absoluteFill} pointerEvents="box-none">
            {node}
          </View>
        ))}
      </View>
    </Ctx.Provider>
  );
}
