import React, { createContext, useContext } from 'react';

const EMPTY = Symbol();

export interface ContainerProviderProps<State = void> {
  initialState?: State;
  children: React.ReactNode;
}

interface GlobalHook<Value, State> {
  Provider: React.ComponentType<ContainerProviderProps<State>>;
  useHook: () => Value;
}

export function createGlobalHook<Value, State = void>(hook): GlobalHook<Value, State> {
  const Context = createContext<Value | typeof EMPTY>(EMPTY);

  function Provider(props) {
    const value = hook(props.initialState);

    return <Context.Provider value={value}>{props.children}</Context.Provider>;
  }

  function useHook() {
    const value = useContext(Context);
    if (value === EMPTY) {
      throw new Error('You forget to wrap component with<Context.Provider>');
    }
    return value;
  }

  return { Provider, useHook };
}
