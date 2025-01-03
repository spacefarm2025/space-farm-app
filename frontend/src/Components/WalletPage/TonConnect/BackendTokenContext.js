import { createContext } from "react";

export const BackendTokenContext = createContext({
  jwtToken: null,
  setToken: () => {},
});
