import React, { ReactFragment, ReactNode, useReducer } from "react";
import {globalContext, globalStorageReducer,initialAppState} from "./lib/storage"

export const Store = ({children}: any) => {
  const [state, dispatch] = useReducer(globalStorageReducer
  , initialAppState);

  return (
    <globalContext.Provider value={[state, dispatch]}>
      {children}
    </globalContext.Provider>
  )
}
export default Store;