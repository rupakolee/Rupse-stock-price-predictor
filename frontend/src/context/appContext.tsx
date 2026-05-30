import { createContext, useState } from "react";
import type { ReactNode } from "react";

interface AppContextType {
  event: any;
  setEvent: (event: any) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [event, setEvent] = useState<any>(undefined);

  return (
    <AppContext.Provider value={{ event, setEvent }}>
      {children}
    </AppContext.Provider>
  );
};
