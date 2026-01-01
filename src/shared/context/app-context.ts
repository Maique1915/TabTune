import React, { createContext, useContext } from "react";

// Exemplo de contexto compartilhado
export const AppContext = createContext<any>(null);
export function useAppContext() {
  return useContext(AppContext);
}
