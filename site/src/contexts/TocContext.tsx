import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/* eslint-disable react-refresh/only-export-components -- context + hook + DocPage live together */
export type TocItem = { id: string; label: string; children?: TocItem[] };

type TocContextValue = {
  sections: TocItem[];
  setSections: (sections: TocItem[]) => void;
};

const TocContext = createContext<TocContextValue | null>(null);

export function TocProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<TocItem[]>([]);
  return (
    <TocContext.Provider value={{ sections, setSections }}>
      {children}
    </TocContext.Provider>
  );
}

export function useToc() {
  const ctx = useContext(TocContext);
  if (!ctx) throw new Error("useToc must be used within TocProvider");
  return ctx;
}

export function DocPage({
  sections,
  children,
}: {
  sections: TocItem[];
  children: ReactNode;
}) {
  const { setSections } = useToc();
  useEffect(() => {
    setSections(sections);
    return () => setSections([]);
  }, [sections, setSections]);
  return <>{children}</>;
}
