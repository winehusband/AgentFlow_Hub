/**
 * Hub Context
 *
 * Provides the current hubId to all child components within a hub view.
 * This avoids prop drilling and allows any component to access hub data.
 */

import { createContext, useContext } from "react";

interface HubContextValue {
  hubId: string;
}

const HubContext = createContext<HubContextValue | null>(null);

interface HubProviderProps {
  hubId: string;
  children: React.ReactNode;
}

export function HubProvider({ hubId, children }: HubProviderProps) {
  return <HubContext.Provider value={{ hubId }}>{children}</HubContext.Provider>;
}

export function useHubId(): string {
  const context = useContext(HubContext);
  if (!context) {
    throw new Error("useHubId must be used within a HubProvider");
  }
  return context.hubId;
}
